const { execSync } = require('child_process');

const apps = [
  'static/configurable-validation',
  'static/edit',
  'static/traffic-view',
];

for (const app of apps) {
  try {
    console.log(`[predeploy] Installing dependencies in ${app}...`);
    execSync(`npm --prefix ${app} install`, { stdio: 'inherit' });
    console.log(`[predeploy] Building ${app}...`);
    execSync(`npm --prefix ${app} run build`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`[predeploy] Failed for ${app}`);
    process.exitCode = 1;
    throw err;
  }
}

require('./check-resources');
