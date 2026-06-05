import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const BASE = `${SUPABASE_URL}/storage/v1/object/public/generated-audio/bg-music`;
const BG_MUSIC: Record<string, string> = {
  piano:      `${BASE}/piano.mp3`,
  guitare:    `${BASE}/guitare.mp3`,
  festif:     `${BASE}/festif.mp3`,
  romantique: `${BASE}/romantique.mp3`,
  berceuse:   `${BASE}/berceuse.mp3`,
  classique:  `${BASE}/classique.mp3`,
  triomphal:  `${BASE}/triomphal.mp3`,
  jazz:       `${BASE}/jazz.mp3`,
  noel:       `${BASE}/noel.mp3`,
  halloween:  `${BASE}/halloween.mp3`,
  tendre:     `${BASE}/tendre.mp3`,
};

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const id  = url.searchParams.get('id') ?? '';

  if (!id) {
    return new Response('ID manquant', { status: 400 });
  }

  const bgParam = url.searchParams.get('bg') ?? '';

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
  const { data: msg } = await (supabase.from('messages') as any)
    .select('tts_url, tts_bg_music, contact_name, bg_theme')
    .eq('id', id)
    .single();

  const bgKey      = bgParam || msg?.tts_bg_music || 'aucune';
  const bgMusicUrl = BG_MUSIC[bgKey] ?? null;
  const recipient  = msg?.contact_name ? displayName(msg.contact_name) : null;

  if (!msg?.tts_url) {
    return new Response(JSON.stringify({ error: 'not_found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  return new Response(JSON.stringify({ tts_url: msg.tts_url, bg_url: bgMusicUrl, recipient, bg_theme: msg.bg_theme ?? 'none' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
});

function displayName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const firstNames = parts.filter((p) => !(p === p.toUpperCase() && /[A-Z]/.test(p)));
  return firstNames.join(' ') || parts[0] || name;
}

function htmlPlayer(ttsUrl: string, bgMusicUrl: string | null, recipient: string | null): string {
  const title    = recipient ? `Un message pour toi, ${recipient} 💛` : 'Un message pour toi 💛';
  const ogTitle  = recipient ? `🎙️ Un message vocal pour ${recipient}` : '🎙️ Un message vocal pour toi';
  const ogDesc   = 'Appuie sur lecture pour entendre le message — envoyé avec Confettis & Cake 🎂';
  const ttsJson  = JSON.stringify(ttsUrl);
  const bgJson   = JSON.stringify(bgMusicUrl ?? '');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escHtml(title)} — Confettis &amp; Cake</title>

  <!-- Open Graph (WhatsApp, iMessage, Telegram…) -->
  <meta property="og:title"       content="${escHtml(ogTitle)}">
  <meta property="og:description" content="${escHtml(ogDesc)}">
  <meta property="og:type"        content="website">
  <meta property="og:image"       content="https://confetticake.fr/og-vocal.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${escHtml(ogTitle)}">
  <meta name="twitter:description" content="${escHtml(ogDesc)}">

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(160deg, #f5f0ff 0%, #fff0f6 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 20px;
    }
    .card {
      background: white;
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(155, 107, 181, 0.18);
      padding: 36px 28px 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .logo { font-size: 13px; color: #9b6bb5; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; margin-bottom: 20px; }
    .emoji-big { font-size: 56px; margin-bottom: 16px; display: block; }
    .title { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 8px; line-height: 1.3; }
    .subtitle { font-size: 14px; color: #888; margin-bottom: 32px; line-height: 1.5; }
    .play-btn {
      width: 80px; height: 80px; border-radius: 50%;
      background: linear-gradient(135deg, #9b6bb5, #c084fc);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 4px 20px rgba(155, 107, 181, 0.4);
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .play-btn:active { transform: scale(0.95); box-shadow: 0 2px 10px rgba(155, 107, 181, 0.3); }
    .play-btn svg { width: 36px; height: 36px; fill: white; }
    .status { font-size: 13px; color: #9b6bb5; font-weight: 600; margin-bottom: 28px; min-height: 20px; }
    .music-bar {
      display: flex; align-items: center; justify-content: center;
      gap: 8px; padding: 10px 16px;
      background: #f5f0ff; border-radius: 99px;
      margin-bottom: 24px; font-size: 13px; color: #7c5a99;
    }
    .mute-btn {
      background: none; border: 1.5px solid #c084fc; border-radius: 99px;
      color: #9b6bb5; font-size: 12px; font-weight: 600;
      padding: 5px 14px; cursor: pointer; transition: background 0.15s;
    }
    .mute-btn:hover { background: #ede9fe; }
    .footer { margin-top: 28px; font-size: 12px; color: #bbb; }
    .footer a { color: #c084fc; text-decoration: none; }
    .wave { display: flex; align-items: flex-end; justify-content: center; gap: 3px; height: 32px; margin-bottom: 24px; }
    .wave-bar {
      width: 4px; background: linear-gradient(135deg, #9b6bb5, #c084fc);
      border-radius: 99px; animation: wave 1.2s ease-in-out infinite; opacity: 0.3;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .wave-bar:nth-child(4) { animation-delay: 0.3s; }
    .wave-bar:nth-child(5) { animation-delay: 0.4s; }
    .wave-bar:nth-child(6) { animation-delay: 0.15s; }
    .wave-bar:nth-child(7) { animation-delay: 0.25s; }
    @keyframes wave { 0%, 100% { height: 6px; } 50% { height: 28px; } }
    .wave.playing .wave-bar { opacity: 1; }
    #errorMsg { color: #ef4444; font-size: 13px; margin-top: 8px; display: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🎂 Confettis &amp; Cake</div>
    <span class="emoji-big">🎙️</span>
    <div class="title">${escHtml(title)}</div>
    <div class="subtitle">Appuie sur lecture pour entendre le message</div>

    <button class="play-btn" id="playBtn" onclick="togglePlay()">
      <svg id="playIcon" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
    </button>
    <div class="status" id="status">Appuie pour écouter</div>
    <div id="errorMsg"></div>

    <div class="wave" id="wave">
      <div class="wave-bar" style="height:14px"></div>
      <div class="wave-bar" style="height:22px"></div>
      <div class="wave-bar" style="height:18px"></div>
      <div class="wave-bar" style="height:28px"></div>
      <div class="wave-bar" style="height:20px"></div>
      <div class="wave-bar" style="height:16px"></div>
      <div class="wave-bar" style="height:24px"></div>
    </div>

    <div class="music-bar" id="musicBar" style="display:none">
      <span>🎵 Fond sonore activé</span>
      <button class="mute-btn" id="muteBtn" onclick="toggleMute()">Couper</button>
    </div>

    <div class="footer">
      Envoyé avec <a href="https://confetticake.fr" target="_blank">Confettis &amp; Cake</a>
    </div>
  </div>

  <script>
    var ttsUrl = ${ttsJson};
    var bgUrl  = ${bgJson};

    var voiceAudio = new Audio(ttsUrl);
    var bgAudio    = bgUrl ? new Audio(bgUrl) : null;
    if (bgAudio) {
      bgAudio.loop   = true;
      bgAudio.volume = 0.35;
      document.getElementById('musicBar').style.display = 'flex';
    }

    var isPlaying = false;
    var bgMuted   = false;
    var pauseIcon   = '<rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/>';
    var playIconSvg = '<polygon points="5,3 19,12 5,21"/>';
    var INTRO_MS    = 1800;

    function startVoice() {
      document.getElementById('status').textContent = 'Lecture en cours...';
      var vp = voiceAudio.play();
      if (vp && typeof vp.catch === 'function') {
        vp.catch(function(e) {
          document.getElementById('status').textContent = '⚠️ Impossible de lire le message';
          document.getElementById('errorMsg').style.display = 'block';
          document.getElementById('errorMsg').textContent = e.message || 'Erreur lecture audio';
          isPlaying = false;
          document.getElementById('playIcon').innerHTML = playIconSvg;
          document.getElementById('wave').classList.remove('playing');
        });
      }
    }

    function togglePlay() {
      if (!ttsUrl) {
        document.getElementById('errorMsg').style.display = 'block';
        document.getElementById('errorMsg').textContent = '⚠️ Lien de message invalide.';
        return;
      }
      if (!isPlaying) {
        isPlaying = true;
        document.getElementById('playIcon').innerHTML = pauseIcon;
        document.getElementById('wave').classList.add('playing');
        if (bgAudio && !bgMuted) {
          bgAudio.volume = 0.35;
          var bp = bgAudio.play();
          if (bp && typeof bp.catch === 'function') bp.catch(function(){});
          var unlock = voiceAudio.play();
          if (unlock && typeof unlock.then === 'function') {
            unlock.then(function() { voiceAudio.pause(); voiceAudio.currentTime = 0; }).catch(function(){});
          } else {
            voiceAudio.pause(); voiceAudio.currentTime = 0;
          }
          document.getElementById('status').textContent = '🎵 Intro...';
          setTimeout(function() { if (!isPlaying) return; startVoice(); }, INTRO_MS);
        } else {
          startVoice();
        }
      } else {
        voiceAudio.pause();
        if (bgAudio) bgAudio.pause();
        isPlaying = false;
        document.getElementById('playIcon').innerHTML = playIconSvg;
        document.getElementById('status').textContent = 'Appuie pour reprendre';
        document.getElementById('wave').classList.remove('playing');
      }
    }

    function toggleMute() {
      var btn = document.getElementById('muteBtn');
      if (!bgMuted) {
        if (bgAudio) bgAudio.volume = 0;
        bgMuted = true; btn.textContent = 'Rétablir';
      } else {
        if (bgAudio) bgAudio.volume = 0.35;
        bgMuted = false; btn.textContent = 'Couper';
      }
    }

    voiceAudio.addEventListener('ended', function() {
      isPlaying = false;
      document.getElementById('playIcon').innerHTML = playIconSvg;
      document.getElementById('status').textContent = '✓ Message écouté';
      document.getElementById('wave').classList.remove('playing');
      if (bgAudio) {
        var startVol = bgAudio.volume;
        var steps = 20; var i = 0;
        var fade = setInterval(function() {
          i++; bgAudio.volume = Math.max(0, startVol * (1 - i / steps));
          if (i >= steps) { clearInterval(fade); bgAudio.pause(); bgAudio.currentTime = 0; bgAudio.volume = startVol; }
        }, 80);
      }
    });

    voiceAudio.addEventListener('error', function() {
      document.getElementById('status').textContent = '⚠️ Impossible de lire le message';
    });
  </script>
</body>
</html>`;
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function html404(): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Message introuvable</title></head>
<body style="font-family:sans-serif;text-align:center;padding:60px 20px;color:#666">
  <p style="font-size:48px">😕</p>
  <h2>Message introuvable</h2>
  <p>Ce lien n'est plus valide ou le message a été supprimé.</p>
</body>
</html>`;
}
