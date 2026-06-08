import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Voix disponibles ──────────────────────────────────────────────────────────
const VOICES: Record<string, string> = {
  // Voix standard
  homme_neutre:     Deno.env.get('ELEVENLABS_VOICE_HOMME_NEUTRE')     ?? 'pNInz6obpgDQGcFmaJgB', // Adam
  homme_chaleureux: Deno.env.get('ELEVENLABS_VOICE_HOMME_CHALEUREUX') ?? 'TxGEqnHWrfWFTfGW9XjX', // Josh
  femme_douce:      Deno.env.get('ELEVENLABS_VOICE_FEMME_DOUCE')      ?? '21m00Tcm4TlvDq8ikWAM', // Rachel
  femme_joyeuse:    Deno.env.get('ELEVENLABS_VOICE_FEMME_JOYEUSE')    ?? 'EXAVITQu4vr4xnSDxMaL', // Aria
  // Voix fun (réutilisent des voix existantes avec settings et texte adaptés)
  pere_noel:        'TxGEqnHWrfWFTfGW9XjX', // Josh — chaleureux et jovial
  pirate:           'pNInz6obpgDQGcFmaJgB', // Adam — grave et rauque
  robot:            'pNInz6obpgDQGcFmaJgB', // Adam — très stable, robotique
  presentateur:     'TxGEqnHWrfWFTfGW9XjX', // Josh — clair et professionnel
  roi_reine:        '21m00Tcm4TlvDq8ikWAM', // Rachel — posée et solennelle
};

// ── Settings et transformations par personnage ────────────────────────────────
type VoiceSettings = { stability: number; similarity_boost: number; style: number; use_speaker_boost: boolean };

function getVoiceSettings(voice_key: string): VoiceSettings {
  const map: Record<string, VoiceSettings> = {
    robot:        { stability: 0.95, similarity_boost: 0.80, style: 0.05, use_speaker_boost: false },
    pirate:       { stability: 0.55, similarity_boost: 0.70, style: 0.75, use_speaker_boost: true  },
    pere_noel:    { stability: 0.60, similarity_boost: 0.75, style: 0.75, use_speaker_boost: true  },
    presentateur: { stability: 0.85, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true  },
    roi_reine:    { stability: 0.80, similarity_boost: 0.80, style: 0.55, use_speaker_boost: true  },
  };
  return map[voice_key] ?? { stability: 0.45, similarity_boost: 0.75, style: 0.40, use_speaker_boost: true };
}

function transformText(text: string, voice_key: string): string {
  switch (voice_key) {
    case 'pere_noel':    return `Ho ho ho ! ${text} Joyeux Noël à toi !`;
    case 'pirate':       return `Arrr ! ${text} Arrr, bonne route, matelot !`;
    case 'robot':        return `Message. En. Cours. De. Transmission. ${text} Fin. De. Message.`;
    case 'presentateur': return `Chers auditeurs, voici un message exceptionnel. ${text} Restez à l'écoute !`;
    case 'roi_reine':    return `Nous, en notre royale grandeur, vous adressons ce message. ${text} Qu'il en soit ainsi.`;
    default: return text;
  }
}

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
    const finalText = transformText(text, voice_key);
    const ttsResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: finalText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: getVoiceSettings(voice_key),
      }),
    });

    if (!ttsResp.ok) {
      const errBody = await ttsResp.text();
      throw new Error(`ElevenLabs TTS failed ${ttsResp.status}: ${errBody}`);
    }

    // ── Upload vers Supabase Storage (bucket : generated-audio) ─────────────
    const audioBuffer = await ttsResp.arrayBuffer();
    const fileName    = `tts/${message_id}_${voice_key}_${Date.now()}.mp3`;

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
