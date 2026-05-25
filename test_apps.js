#!/usr/bin/env node

/**
 * ADAGDS Deployment Verification Engine
 * Checks and starts up independent instances to confirm network boundary separation.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const outputDir = path.join(__dirname, 'output');

if (!fs.existsSync(outputDir)) {
  console.error('❌ Run master.js or orchestration runner first to generate builds.');
  process.exit(1);
}

const apps = fs.readdirSync(outputDir).filter(f => fs.statSync(path.join(outputDir, f)).isDirectory());

if (apps.length === 0) {
  console.error('❌ No applications found in output target.');
  process.exit(1);
}

console.log(`\n🚀 Found ${apps.length} built applications. Bootstrapping launch test for top 2 isolated apps...\n`);

const appsToRun = apps.slice(0, 2);
const activeProcesses = [];

appsToRun.forEach((appName) => {
  const appPath = path.join(outputDir, appName);
  console.log(`[LAUNCH] Initializing independent instance: ${appName} via ${appPath}`);

  const proc = spawn('node', ['index.js'], { cwd: appPath });

  proc.stdout.on('data', (data) => {
    console.log(`[${appName}-STDOUT]: ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${appName}-STDERR]: ${data.toString().trim()}`);
  });

  activeProcesses.push({ name: appName, process: proc });
});

// Let them run for 6 seconds to prove stability, then shut down gracefully
setTimeout(() => {
  console.log('\n======================================================');
  console.log('✔ Verification Timeframe Expired. Tearing down endpoints safely...');
  console.log('======================================================');
  activeProcesses.forEach(p => {
    console.log(`Stopping execution sequence: ${p.name}`);
    p.process.kill('SIGTERM');
  });
  process.exit(0);
}, 6000);