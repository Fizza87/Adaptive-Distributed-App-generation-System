#!/usr/bin/env node
/**
 * ADAGDS Worker Node — FIXED DYNAMIC DASHBOARD CONNECTION
 * ✅ Color, name, owner — sab proper show hoga
 */

const path = require('path');

function buildProfile(config) {
  // ✅ FIX: Direct config values use karo - pehle check, fallback ke saath
  
  // Name lena - displayName priority
  let name = config.displayName || config.appName || "Custom App";
  
  // Owner name
  let owner = config.ownerName || "Developer";

  // ✅ CRITICAL FIX: Color properly read karo - accentColor OR color dono check karo
  let selectedColor = config.accentColor || config.color || '#4f7cff';
  
  console.log('[PROFILE] Building with:');
  console.log(`  Name: ${name}`);
  console.log(`  Owner: ${owner}`);
  console.log(`  Color: ${selectedColor}`);

  const ayahs = config.quranData || [];
  
  // Ayah ko surah-wise group karo
  const surahMap = {};
  ayahs.forEach(a => {
    const sNum = a.SurahNumber || 1; 
    const sName = a.SurahNameEnglish || a.SurahNameArabic || a.SurahName || "";

    if (!surahMap[sNum]) {
      surahMap[sNum] = {
        number: sNum,
        name: sName ? sName : "Surah " + sNum,
        ayahs: []
      };
    }
    surahMap[sNum].ayahs.push(a);
  });

  const surahList = Object.values(surahMap).sort((a,b) => a.number - b.number);

  return {
    icon: '📖', 
    title: name,           // ✅ displayName se aa raha
    subtitle: "Engineered by " + owner,
    color: selectedColor,  // ✅ accentColor se aa raha
    statLabels: ['Total Ayahs Loaded', 'Surahs Detected', 'Active Environment', 'Data Status'],
    statValues: [
      ayahs.length,
      surahList.length,
      (config.environment || 'production').toUpperCase(),
      'VERIFIED ✓'
    ],
    surahList: surahList
  };
}

function generateHTML(config) {
  const p = buildProfile(config);
  const bundledData = JSON.stringify(p.surahList);
  const themeColor = p.color;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${p.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Amiri&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020817; color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
    .app-container { display: grid; grid-template-columns: 360px 1fr; gap: 24px; max-width: 1500px; margin: 0 auto; padding: 24px; height: calc(100vh - 40px); }
    .sidebar { background: #070d19; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px; height: 100%; }
    .surah-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 4px; }
    
    .surah-btn { width: 100%; text-align: left; background: #0f172a; border: 1px solid #1e293b; padding: 14px 16px; border-radius: 10px; color: #cbd5e1; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
    .surah-btn:hover { background: ${themeColor}22; border-color: ${themeColor}; color: #fff; }
    .surah-btn.active { background: ${themeColor} !important; border-color: ${themeColor} !important; color: #ffffff !important; }
    .surah-btn.active span { color: #ffffff !important; }
    
    .reader-pane { display: flex; flex-direction: column; gap: 20px; height: 100%; overflow: hidden; }
    .reader-header { background: #070d19; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; }
    .ayah-workspace { flex: 1; overflow-y: auto; padding-right: 8px; display: flex; flex-direction: column; gap: 16px; }
    .ayah-card { background: #070d19; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .arabic-text { font-family: 'Amiri', serif; font-size: 32px; line-height: 2.2; direction: rtl; text-align: right; color: #f8fafc; word-wrap: break-word; }
    .stat-box { background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 12px 14px; }
  </style>
</head>
<body>

<div class="app-container">
  
  <div class="sidebar">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
      <span style="font-size: 28px">${p.icon}</span>
      <div>
        <h2 style="font-size: 18px; font-weight: 800; color: #fff">${p.title}</h2>
        <p style="font-size: 11px; color: #64748b">${p.subtitle}</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
      <div class="stat-box">
        <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Total Ayahs</div>
        <div style="font-size: 16px; font-weight: 700; color: ${themeColor}">${p.statValues[0]}</div>
      </div>
      <div class="stat-box">
        <div style="font-size: 9px; color: #64748b; text-transform: uppercase;">Surahs</div>
        <div style="font-size: 16px; font-weight: 700; color: ${themeColor}">${p.statValues[1]}</div>
      </div>
    </div>

    <h3 style="font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Surah Index List</h3>
    <div id="surah-list-container" class="surah-list"></div>
  </div>

  <div class="reader-pane">
    <div class="reader-header">
      <div>
        <h2 id="active-surah-title" style="font-size: 20px; font-weight: 700; color: #fff">Loading Surah...</h2>
        <p id="ayah-count-badge" style="font-size: 12px; color: #64748b; margin-top: 2px;"></p>
      </div>
      <span style="font-size: 11px; padding: 5px 14px; border-radius: 20px; background: ${themeColor}1a; color: ${themeColor}; border: 1px solid ${themeColor}33; font-weight: 700; font-family: 'DM Mono'; text-transform: uppercase;">PORT :${config.port}</span>
    </div>

    <div id="ayah-reader-workspace" class="ayah-workspace">
      <div style="text-align: center; color: #475569; padding: 60px; font-style: italic;">Please select a Surah from the left list.</div>
    </div>
  </div>

</div>

<script>
  const surahData = ${bundledData};
  const appColor = "${themeColor}";

  if(surahData.length > 0) {
    const container = document.getElementById('surah-list-container');
    
    surahData.forEach((s, idx) => {
      const btn = document.createElement('button');
      btn.className = 'surah-btn';
      btn.id = 'btn-surah-' + s.number;
      
      let displayName = "Surah " + s.number;
      if (s.name && !s.name.includes("Surah")) {
         displayName = s.number + ". " + s.name;
      } else if (s.name) {
         displayName = s.name;
      }

      btn.innerHTML = '<span style="font-size:14px;">📖 ' + displayName + '</span><span style="font-size: 11px; background: #1e293b; padding: 2px 8px; border-radius: 6px; color: #94a3b8">' + s.ayahs.length + ' Verses</span>';
      btn.onclick = function() { loadSurah(s.number); };
      container.appendChild(btn);
      
      if(idx === 0) loadSurah(s.number);
    });
  } else {
    document.getElementById('ayah-reader-workspace').innerHTML = '<div style="color:#ef4444; text-align:center; padding:40px;">No data injected!</div>';
  }

  function loadSurah(surahNum) {
    document.querySelectorAll('.surah-btn').forEach(function(b) { b.classList.remove('active'); });
    const targetBtn = document.getElementById('btn-surah-' + surahNum);
    if(targetBtn) targetBtn.classList.add('active');

    const activeSurah = surahData.find(function(item) { return item.number == surahNum; });
    if(!activeSurah) return;

    document.getElementById('active-surah-title').textContent = activeSurah.name + ' — Reading Workspace';
    document.getElementById('ayah-count-badge').textContent = 'Displaying all ' + activeSurah.ayahs.length + ' holy verses';

    const workspace = document.getElementById('ayah-reader-workspace');
    workspace.innerHTML = '';

    activeSurah.ayahs.forEach(function(a) {
      const card = document.createElement('div');
      card.className = 'ayah-card';
      
      const arabicText = a.AyahTextMuhammadi || a.AyahTextPdms || '';
      const rukuNum = a.RukuSurahNumber || 1;
      
      card.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 10px;"><span style="font-size: 12px; background: ' + appColor + '1a; color: ' + appColor + '; padding: 3px 10px; border-radius: 6px; font-weight: 700;">Ayah ' + a.AyahNumber + '</span><span style="font-size: 11px; color: #475569; font-family:\\'DM Mono\\'">Para ' + a.ParahNumber + ' | Ruku ' + rukuNum + '</span></div><div class="arabic-text">' + arabicText + '</div>';
      workspace.appendChild(card);
    });
    
    workspace.scrollTop = 0;
  }
</script>
</body>
</html>`;
}

function generateAppJs(config) {
  // ✅ Config ko properly read karo app.js mein
  return `const express=require('express');
const cors=require('cors');
const path=require('path');
const fs=require('fs');

const app=express();
app.use(cors());
app.use(express.static(path.join(__dirname,'../public')));

// Read config.json from parent directory
const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

app.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'));
});

app.listen(config.port,()=>{
  console.log('✓ App "${config.displayName}" running on port '+config.port);
  console.log('  Color: ${config.accentColor}');
});`;
}

module.exports = { generateHTML, generateAppJs };