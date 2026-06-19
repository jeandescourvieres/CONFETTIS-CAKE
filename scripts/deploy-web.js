require('dotenv').config();
const { execSync } = require('child_process');
const ftp = require('basic-ftp');

const REQUIRED_VARS = ['O2SWITCH_FTP_HOST', 'O2SWITCH_FTP_USER', 'O2SWITCH_FTP_PASSWORD'];

async function main() {
  const missing = REQUIRED_VARS.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Variables manquantes dans .env : ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('Export du build web (npx expo export --platform web)...');
  execSync('npx expo export --platform web', { stdio: 'inherit' });

  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    console.log('Connexion FTP à o2switch...');
    await client.access({
      host: process.env.O2SWITCH_FTP_HOST,
      user: process.env.O2SWITCH_FTP_USER,
      password: process.env.O2SWITCH_FTP_PASSWORD,
      secure: false,
    });

    const remoteRoot = process.env.O2SWITCH_FTP_REMOTE_DIR;
    if (remoteRoot) await client.cd(remoteRoot);

    console.log('Suppression de l\'ancien build (_expo, assets)...');
    for (const dir of ['_expo', 'assets']) {
      try { await client.removeDir(dir); } catch { /* dossier absent, on ignore */ }
    }

    console.log('Upload du nouveau build...');
    await client.uploadFromDir('dist');

    console.log('Déploiement terminé : https://confetticake.fr');
  } finally {
    client.close();
  }
}

main().catch((err) => {
  console.error('Échec du déploiement :', err.message);
  process.exit(1);
});
