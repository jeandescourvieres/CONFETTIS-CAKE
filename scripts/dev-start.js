// Lance Metro (expo start) et maintient automatiquement `adb reverse tcp:8081`
// en USB, pour que l'appli ne reste plus bloquée sur la splash quand le
// téléphone se déconnecte/reconnecte (verrouillage, câble, etc.) en cours de session.
const { spawn, exec } = require('child_process');

function applyAdbReverse() {
  exec('adb reverse tcp:8081 tcp:8081', () => { /* ignoré si pas d'appareil USB / adb absent */ });
}

applyAdbReverse();
const intervalId = setInterval(applyAdbReverse, 7000);

const args = process.argv.slice(2);
const expo = spawn('npx', ['expo', 'start', ...args], { stdio: 'inherit', shell: true });

expo.on('exit', (code) => {
  clearInterval(intervalId);
  process.exit(code ?? 0);
});
