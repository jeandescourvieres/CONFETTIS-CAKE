import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Voix disponibles ──────────────────────────────────────────────────────────
// Voix ElevenLabs stables (eleven_multilingual_v2)
// Pour changer : modifier les voice_id ici ou dans les variables d'env ELEVENLABS_VOICE_*
const VOICES: Record<string, string> = {
  homme_neutre:     Deno.env.get('ELEVENLABS_VOICE_HOMME_NEUTRE')     ?? 'pNInz6obpgDQGcFmaJgB', // Adam
  homme_chaleureux: Deno.env.get('ELEVENLABS_VOICE_HOMME_CHALEUREUX') ?? 'TxGEqnHWrfWFTfGW9XjX', // Josh
  femme_douce:      Deno.env.get('ELEVENLABS_VOICE_FEMME_DOUCE')      ?? '21m00Tcm4TlvDq8ikWAM', // Rachel
  femme_joyeuse:    Deno.env.get('ELEVENLABS_VOICE_FEMME_JOYEUSE')    ?? 'EXAVITQu4vr4xnSDxMaL', // Aria
};

interface GenerateTTSRequest {
  message_id: string;
  text:        string;
  voice_key:   keyof typeof VOICES; // 'homme_neutre' | 'homme_chaleureux' | 'femme_douce' | 'femme_joyeuse'
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  let body: GenerateTTSRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Corps JSON invalide' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { message_id, text, voice_key } = body;

  if (!message_id || !text || !voice_key) {
    return new Response(JSON.stringify({ error: 'message_id, text et voice_key sont requis' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const voiceId = VOICES[voice_key];
  if (!voiceId) {
    return new Response(JSON.stringify({ error: `Voix inconnue : ${voice_key}` }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ELEVENLABS_API_KEY non configurée' }), {
      status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Marquer comme "en cours"
  await (supabase.from('messages') as any)
    .update({ tts_status: 'generating', tts_voice: voice_key })
    .eq('id', message_id);

  try {
    // ── Appel ElevenLabs TTS ─────────────────────────────────────────────────
    const ttsResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.40,
          use_speaker_boost: true,
        },
      }),
    });

    if (!ttsResp.ok) {
      const errBody = await ttsResp.text();
      throw new Error(`ElevenLabs TTS failed ${ttsResp.status}: ${errBody}`);
    }

    // ── Upload vers Supabase Storage (bucket : generated-audio) ─────────────
    const audioBuffer = await ttsResp.arrayBuffer();
    const fileName = `tts/${message_id}_${voice_key}_${Date.now()}.mp3`;

    const { error: uploadErr } = await supabase.storage
      .from('generated-audio')
      .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: true });

    if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

    const { data: urlData } = supabase.storage
      .from('generated-audio')
      .getPublicUrl(fileName);

    const ttsUrl = urlData.publicUrl;

    // ── Mettre à jour le message ─────────────────────────────────────────────
    await (supabase.from('messages') as any)
      .update({ tts_url: ttsUrl, tts_status: 'ready', tts_voice: voice_key })
      .eq('id', message_id);

    return new Response(
      JSON.stringify({ status: 'ready', tts_url: ttsUrl }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[generate-tts] error:', message);

    await (supabase.from('messages') as any)
      .update({ tts_status: 'failed' })
      .eq('id', message_id);

    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
