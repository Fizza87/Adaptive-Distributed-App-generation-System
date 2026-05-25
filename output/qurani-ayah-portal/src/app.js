const express=require('express');
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
  console.log('✓ App "Qurani Ayah Portal" running on port '+config.port);
  console.log('  Color: #14b8a6');
});