// scripts/check-resources.js
const fs = require('fs');
const paths = [
  'static/configurable-validation/build',
  'static/edit/build',
  'static/traffic-view/build',
];

let missing = [];
for (const p of paths) {
  if (!fs.existsSync(p) || !fs.existsSync(`${p}/index.html`)) {
    missing.push(p);
  }
}
if (missing.length) {
  console.error('\n[Forge Predeploy] Fehlende Build-Ordner/Eintr\u00e4ge:\n' + missing.map(m => ` - ${m}`).join('\n'));
  console.error('\nBitte je Frontend zuerst `npm --prefix <pfad> install && npm --prefix <pfad> run build` ausf\u00fchren.\n' +
                'Beispiel:\n' +
                '  npm --prefix static/configurable-validation run build\n' +
                '  npm --prefix static/edit run build\n' +
                '  npm --prefix static/traffic-view run build\n');
  process.exit(1);
} else {
  console.log('[Forge Predeploy] Alle Resources vorhanden.');
}
