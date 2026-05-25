#!/usr/bin/env node
/**
 * ADAGDS Generator Server — FIXED VERSION
 * ✅ Color, name, aur sab data properly generated app tak pohanch jaayega
 */

const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');
const { spawn } = require('child_process');

const { generateHTML, generateAppJs } = require('./worker.js');

const app  = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'dashboard')));

const USED_PORTS = new Set([4000]);
let portCounter  = 3010; 

function getNextPort() {
  while (USED_PORTS.has(portCounter)) portCounter++;
  USED_PORTS.add(portCounter);
  return portCounter;
}

const generatedApps = [];

app.post('/api/generate', async (req, res) => {
  // ✅ FIX: Sab keys ko capture karo - displayName, accentColor, dono versions accept karo
  const { 
    appName, 
    displayName, 
    appType, 
    ownerName, 
    features, 
    environment, 
    color, 
    accentColor,
    quranData 
  } = req.body;

  if (!appName || !appType) {
    return res.status(400).json({ error: 'appName and appType are required' });
  }

  const safeName = appName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const port     = getNextPort();
  const appId    = `usr-${Date.now()}-${safeName}`;
  const featureList = Array.isArray(features) ? features : (features || '').split(',').map(f => f.trim()).filter(Boolean);

  // ✅ FIX: Color ko properly assign karo - accentColor priority, phir color
  const finalColor = accentColor || color || '#4f7cff';
  const finalName = displayName || appName;

  const config = {
    appName: safeName,
    displayName: finalName,  // ✅ Add this
    appId,
    version: '1.0.0',
    environment: environment || 'production',
    port,
    features: featureList.length ? featureList : ['api'],
    description: `${appType} — ${finalName} by ${ownerName || 'Developer'}`,
    appType,
    ownerName: ownerName || 'Developer',
    accentColor: finalColor,  // ✅ Store both
    color: finalColor,        // ✅ Backup key
    generatedAt: new Date().toISOString(),
    quranData: quranData || []
  };

  console.log('\n[SERVER] Config ready:');
  console.log(`  Name: ${finalName}`);
  console.log(`  Color: ${finalColor}`);
  console.log(`  Owner: ${ownerName}`);
  console.log(`  Port: ${port}\n`);

  // 1. Write Config JSON
  const configDir = path.join(__dirname, 'configs');
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir, { recursive: true });
  const configPath = path.join(configDir, `${safeName}-${Date.now()}.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  // 2. Setup Output Directories
  const outputDir = path.join(__dirname, 'output', safeName);
  const publicDir = path.join(outputDir, 'public');
  const srcDir    = path.join(outputDir, 'src');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });

  // ✅ FIX: Sabse important - config.json properly write karo
  fs.writeFileSync(path.join(outputDir, 'config.json'), JSON.stringify(config, null, 2));
  
  // ✅ Pass config directly to HTML generator
  fs.writeFileSync(path.join(publicDir, 'index.html'), generateHTML(config));
  fs.writeFileSync(path.join(srcDir, 'app.js'), generateAppJs(config));
  fs.writeFileSync(path.join(outputDir, 'index.js'), `require('./src/app.js');`);
  
  // ✅ Package.json bhi add karo taake npm install ka need na ho
  fs.writeFileSync(path.join(outputDir, 'package.json'), JSON.stringify({
    name: safeName,
    version: '1.0.0',
    main: 'index.js',
    dependencies: {
      express: '^4.18.2',
      cors: '^2.8.5'
    }
  }, null, 2));

  console.log(`[GENERATOR] Building "${finalName}" on port ${port}`);

  // 3. Auto-start the app
  const appProcess = spawn('node', ['index.js'], {
    cwd: outputDir,
    stdio: 'ignore',
    detached: true,
  });
  appProcess.unref();

  const appRecord = {
    displayName: finalName,
    appName: safeName,
    appId,
    appType,
    ownerName: config.ownerName,
    port,
    environment: config.environment,
    features: featureList,
    endpoint: `http://localhost:${port}`,
    status: 'running',
    generatedAt: config.generatedAt,
    accentColor: finalColor,
  };

  generatedApps.push(appRecord);

  console.log(`[✓] App ready at http://localhost:${port}\n`);
  res.json({ success: true, app: appRecord });
});

app.get('/api/apps', (req, res) => {
  res.json({ apps: generatedApps, total: generatedApps.length });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'ADAGDS Generator Server (FIXED)',
    port: PORT,
    appsBuilt: generatedApps.length,
    uptime: process.uptime().toFixed(1) + 's',
  });
});

app.listen(PORT, () => {
  console.log('═'.repeat(60));
  console.log('  ADAGDS Generator Server — FIXED VERSION');
  console.log(`  Dashboard → http://localhost:${PORT}`);
  console.log('═'.repeat(60));
});