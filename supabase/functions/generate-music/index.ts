import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface GenerateMusicRequest {
  message_id: string;
  user_id: string;
  lyrics: string;
  style: string;   // Ex: "pop joyful upbeat"
  tone: string;    // Ex: "humorous" | "touching" | ...
}

type ServiceResult =
  | { ok: true; audio_url: string; service: string; duration_s?: number }
  | { ok: false; error: string };

// ── Retry helper ──────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs = 2000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts - 1) {
        // Exponential backoff: 2s, 4s, 8s
        await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// ── SUNO AI ───────────────────────────────────────────────────────────────────
// Suno API: POST /api/generate → poll GET /api/feed/{id} until status === 'complete'

async function generateWithSuno(lyrics: string, style: string): Promise<ServiceResult> {
  const apiKey = Deno.env.get('SUNO_API_KEY');
  if (!apiKey) return { ok: false, error: 'SUNO_API_KEY manquante' };

  // 1. Submit generation job
  const submitResp = await fetch('https://api.suno.ai/api/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: lyrics,
      tags: style,
      make_instrumental: false,
      mv: 'chirp-v3-5',
    }),
  });

  if (!submitResp.ok) {
    const err = await submitResp.text();
    throw new Error(`Suno submit failed ${submitResp.status}: ${err}`);
  }

  const submitData = await submitResp.json();
  // Suno returns an array of clips
  const clipId: string = Array.isArray(submitData)
    ? submitData[0]?.id
    : submitData?.clips?.[0]?.id ?? submitData?.id;

  if (!clipId) throw new Error('Suno: no clip ID returned');

  // 2. Poll until complete (max 90s with 5s intervals)
  const maxPolls = 18;
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const pollResp = await fetch(`https://api.suno.ai/api/feed/${clipId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!pollResp.ok) continue;

    const pollData = await pollResp.json();
    const clip = Array.isArray(pollData) ? pollData[0] : pollData;

    if (clip?.status === 'complete' && clip?.audio_url) {
      return {
        ok: true,
        audio_url: clip.audio_url,
        service: 'suno',
        duration_s: clip.metadata?.duration ?? undefined,
      };
    }
    if (clip?.status === 'error') {
      throw new Error(`Suno clip error: ${clip?.error_message ?? 'unknown'}`);
    }
  }

  throw new Error('Suno: timeout after 90s');
}

// ── UDIO AI ───────────────────────────────────────────────────────────────────

async function generateWithUdio(lyrics: string, style: string): Promise<ServiceResult> {
  const apiKey = Deno.env.get('UDIO_API_KEY');
  if (!apiKey) return { ok: false, error: 'UDIO_API_KEY manquante' };

  // 1. Submit
  const submitResp = await fetch('https://www.udio.com/api/generate-proxy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `${style}\n\n${lyrics}`,
      samplerOptions: { seed: -1 },
    }),
  });

  if (!submitResp.ok) {
    const err = await submitResp.text();
    throw new Error(`Udio submit failed ${submitResp.status}: ${err}`);
  }

  const submitData = await submitResp.json();
  const trackId: string = submitData?.track_ids?.[0] ?? submitData?.id;
  if (!trackId) throw new Error('Udio: no track ID returned');

  // 2. Poll (max 90s)
  const maxPolls = 18;
  for (let i = 0; i < maxPolls; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const pollResp = await fetch(`https://www.udio.com/api/songs?songIds=${trackId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!pollResp.ok) continue;

    const pollData = await pollResp.json();
    const track = Array.isArray(pollData?.songs)
      ? pollData.songs[0]
      : pollData?.songs ?? pollData;

    if (track?.finished && track?.song_path) {
      return {
        ok: true,
        audio_url: `https://www.udio.com${track.song_path}`,
        service: 'udio',
        duration_s: track?.duration ?? undefined,
      };
    }
    if (track?.error_message) throw new Error(`Udio error: ${track.error_message}`);
  }

  throw new Error('Udio: timeout after 90s');
}

// ── ELEVENLABS (TTS chant / spoken word) ──────────────────────────────────────
// Fallback synchrone : synthèse vocale des paroles avec voix "Aria"

async function generateWithElevenLabs(lyrics: string): Promise<ServiceResult> {
  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) return { ok: false, error: 'ELEVENLABS_API_KEY manquante' };

  // Use the "Aria" voice with expressive model
  const voiceId = Deno.env.get('ELEVENLABS_VOICE_ID') ?? 'EXAVITQu4vr4xnSDxMaL'; // Aria
  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: lyrics,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.35,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: true,
      },
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`ElevenLabs failed ${resp.status}: ${err}`);
  }

  // ElevenLabs returns raw audio bytes → upload to Supabase Storage
  const audioBuffer = await resp.arrayBuffer();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const fileName = `music/${crypto.randomUUID()}.mp3`;
  const { error: uploadErr } = await supabase.storage
    .from('generated-audio')
    .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: false });

  if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

  const { data: urlData } = supabase.storage
    .from('generated-audio')
    .getPublicUrl(fileName);

  return {
    ok: true,
    audio_url: urlData.publicUrl,
    service: 'elevenlabs',
  };
}

// ── Orchestrateur principal ───────────────────────────────────────────────────

async function tryGenerateMusic(lyrics: string, style: string): Promise<ServiceResult> {
  // 1. Suno — 3 tentatives
  try {
    return await withRetry(() => generateWithSuno(lyrics, style), 3);
  } catch (sunoErr) {
    console.warn('[generate-music] Suno failed:', sunoErr);
  }

  // 2. Udio — 3 tentatives
  try {
    return await withRetry(() => generateWithUdio(lyrics, style), 3);
  } catch (udoErr) {
    console.warn('[generate-music] Udio failed:', udoErr);
  }

  // 3. ElevenLabs — 3 tentatives
  try {
    return await withRetry(() => generateWithElevenLabs(lyrics), 3);
  } catch (elErr) {
    console.warn('[generate-music] ElevenLabs failed:', elErr);
  }

  return { ok: false, error: 'Tous les services de génération musicale sont indisponibles' };
}

// ── Serve ─────────────────────────────────────────────────────────────────────

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const body: GenerateMusicRequest = await req.json();
    const { message_id, user_id, lyrics, style, tone } = body;

    if (!message_id || !user_id || !lyrics) {
      return new Response(JSON.stringify({ error: 'message_id, user_id, lyrics requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Marquer le message comme "en cours de génération"
    await (supabase.from('messages') as any)
      .update({ music_status: 'generating' })
      .eq('id', message_id);

    const musicStyle = `${style} ${tone}`.trim();
    const result = await tryGenerateMusic(lyrics, musicStyle);

    if (result.ok) {
      // Succès : mettre à jour le message avec l'URL audio
      await (supabase.from('messages') as any)
        .update({
          audio_url: result.audio_url,
          music_status: 'ready',
          music_service: result.service,
          music_duration_s: result.duration_s ?? null,
        })
        .eq('id', message_id);

      return new Response(
        JSON.stringify({ status: 'ready', audio_url: result.audio_url, service: result.service }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Échec total → mettre en file d'attente
    await (supabase.from('messages') as any)
      .update({ music_status: 'queued' })
      .eq('id', message_id);

    // next_retry_at dans 5 minutes
    const nextRetry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { data: queueJob, error: queueErr } = await (supabase.from('music_queue') as any)
      .insert({
        message_id,
        user_id,
        lyrics,
        style: musicStyle,
        tone,
        last_error: result.error,
        next_retry_at: nextRetry,
      })
      .select('id')
      .single();

    if (queueErr) throw queueErr;

    return new Response(
      JSON.stringify({
        status: 'queued',
        queue_id: queueJob.id,
        message: 'Génération en file d\'attente. Vous recevrez une notification dès que votre chanson est prête.',
      }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';

    // En cas d'erreur inattendue, on remet le message en état "pending"
    try {
      const body = await req.clone().json().catch(() => ({}));
      if ((body as GenerateMusicRequest).message_id) {
        await (supabase.from('messages') as any)
          .update({ music_status: 'pending' })
          .eq('id', (body as GenerateMusicRequest).message_id);
      }
    } catch {/* ignore */}

    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
