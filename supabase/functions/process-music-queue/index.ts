import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ── Types ─────────────────────────────────────────────────────────────────────

type ServiceResult =
  | { ok: true; audio_url: string; service: string; duration_s?: number }
  | { ok: false; error: string };

interface QueueJob {
  id: string;
  message_id: string;
  user_id: string;
  lyrics: string;
  style: string;
  retries: number;
  max_retries: number;
}

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
        await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

// ── SUNO AI ───────────────────────────────────────────────────────────────────

async function generateWithSuno(lyrics: string, style: string): Promise<ServiceResult> {
  const apiKey = Deno.env.get('SUNO_API_KEY');
  if (!apiKey) return { ok: false, error: 'SUNO_API_KEY manquante' };

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
  const clipId: string = Array.isArray(submitData)
    ? submitData[0]?.id
    : submitData?.clips?.[0]?.id ?? submitData?.id;

  if (!clipId) throw new Error('Suno: no clip ID returned');

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

// ── ELEVENLABS ────────────────────────────────────────────────────────────────

async function generateWithElevenLabs(
  lyrics: string,
  supabase: ReturnType<typeof createClient>,
): Promise<ServiceResult> {
  const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
  if (!apiKey) return { ok: false, error: 'ELEVENLABS_API_KEY manquante' };

  const voiceId = Deno.env.get('ELEVENLABS_VOICE_ID') ?? 'EXAVITQu4vr4xnSDxMaL';
  const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
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

  const audioBuffer = await resp.arrayBuffer();
  const fileName = `music/${crypto.randomUUID()}.mp3`;
  const { error: uploadErr } = await supabase.storage
    .from('generated-audio')
    .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: false });

  if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

  const { data: urlData } = supabase.storage.from('generated-audio').getPublicUrl(fileName);

  return { ok: true, audio_url: urlData.publicUrl, service: 'elevenlabs' };
}

// ── Orchestrateur ─────────────────────────────────────────────────────────────

async function tryGenerateMusic(
  lyrics: string,
  style: string,
  supabase: ReturnType<typeof createClient>,
): Promise<ServiceResult> {
  try {
    return await withRetry(() => generateWithSuno(lyrics, style), 3);
  } catch (sunoErr) {
    console.warn('[process-queue] Suno failed:', sunoErr);
  }

  try {
    return await withRetry(() => generateWithUdio(lyrics, style), 3);
  } catch (udoErr) {
    console.warn('[process-queue] Udio failed:', udoErr);
  }

  try {
    return await withRetry(() => generateWithElevenLabs(lyrics, supabase), 3);
  } catch (elErr) {
    console.warn('[process-queue] ElevenLabs failed:', elErr);
  }

  return { ok: false, error: 'Tous les services de génération musicale sont indisponibles' };
}

// ── Push notification ─────────────────────────────────────────────────────────

async function sendPushNotification(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  title: string,
  body: string,
) {
  // Récupérer les tokens push de l'utilisateur
  const { data: tokens } = await (supabase.from('push_tokens') as any)
    .select('token')
    .eq('user_id', userId);

  if (!tokens || tokens.length === 0) return;

  const messages = tokens.map((row: { token: string }) => ({
    to: row.token,
    title,
    body,
    sound: 'default',
    data: { type: 'music_ready' },
  }));

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
}

// ── Calcul du prochain retry (backoff exponentiel) ────────────────────────────

function nextRetryDelay(retries: number): number {
  // 5 min, 10 min, 20 min, 40 min, 60 min (cap)
  const minutes = Math.min(5 * Math.pow(2, retries), 60);
  return minutes * 60 * 1000;
}

// ── Traitement d'un job ───────────────────────────────────────────────────────

async function processJob(
  job: QueueJob,
  supabase: ReturnType<typeof createClient>,
): Promise<void> {
  // Marquer comme en cours
  await (supabase.from('music_queue') as any)
    .update({ status: 'processing' })
    .eq('id', job.id);

  await (supabase.from('messages') as any)
    .update({ music_status: 'generating' })
    .eq('id', job.message_id);

  const result = await tryGenerateMusic(job.lyrics, job.style, supabase);

  if (result.ok) {
    // Succès
    await (supabase.from('messages') as any)
      .update({
        audio_url: result.audio_url,
        music_status: 'ready',
        music_service: result.service,
        music_duration_s: result.duration_s ?? null,
      })
      .eq('id', job.message_id);

    await (supabase.from('music_queue') as any)
      .update({ status: 'done' })
      .eq('id', job.id);

    // Notification push
    await sendPushNotification(
      supabase,
      job.user_id,
      '🎵 Ta chanson est prête !',
      'Ta chanson personnalisée vient d\'être générée. Écoute-la maintenant !',
    );

    console.log(`[process-queue] Job ${job.id} done — ${result.service}`);
    return;
  }

  // Échec — retry ou abandon
  const newRetries = job.retries + 1;
  if (newRetries >= job.max_retries) {
    await (supabase.from('music_queue') as any)
      .update({ status: 'abandoned', last_error: result.error, retries: newRetries })
      .eq('id', job.id);

    await (supabase.from('messages') as any)
      .update({ music_status: 'failed' })
      .eq('id', job.message_id);

    console.warn(`[process-queue] Job ${job.id} abandoned after ${newRetries} retries`);
  } else {
    const delayMs = nextRetryDelay(newRetries);
    const nextRetryAt = new Date(Date.now() + delayMs).toISOString();

    await (supabase.from('music_queue') as any)
      .update({
        status: 'pending',
        retries: newRetries,
        last_error: result.error,
        next_retry_at: nextRetryAt,
      })
      .eq('id', job.id);

    await (supabase.from('messages') as any)
      .update({ music_status: 'queued' })
      .eq('id', job.message_id);

    console.log(`[process-queue] Job ${job.id} retry ${newRetries}/${job.max_retries} at ${nextRetryAt}`);
  }
}

// ── Serve ─────────────────────────────────────────────────────────────────────
// Appelé par un cron Supabase toutes les 5 minutes (ou via trigger manuel)

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    // Récupérer les jobs en attente dont le next_retry_at est passé
    const { data: jobs, error: fetchErr } = await (supabase.from('music_queue') as any)
      .select('id, message_id, user_id, lyrics, style, retries, max_retries')
      .eq('status', 'pending')
      .lte('next_retry_at', new Date().toISOString())
      .order('next_retry_at', { ascending: true })
      .limit(5); // traiter 5 jobs max par invocation

    if (fetchErr) throw fetchErr;

    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'Aucun job en attente' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[process-queue] Processing ${jobs.length} job(s)`);

    // Traiter les jobs séquentiellement (évite de surcharger les APIs externes)
    const results: Array<{ id: string; outcome: string }> = [];
    for (const job of jobs as QueueJob[]) {
      try {
        await processJob(job, supabase);
        results.push({ id: job.id, outcome: 'processed' });
      } catch (err) {
        console.error(`[process-queue] Unexpected error for job ${job.id}:`, err);
        // Remettre le job en pending pour le prochain cycle
        await (supabase.from('music_queue') as any)
          .update({ status: 'pending' })
          .eq('id', job.id);
        results.push({ id: job.id, outcome: 'error' });
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[process-queue] Fatal error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
