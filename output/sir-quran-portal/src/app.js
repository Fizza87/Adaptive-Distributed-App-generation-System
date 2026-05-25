const express=require('express'),cors=require('cors'),path=require('path'),cfg=require('../config.json');
const app=express();
app.use(cors());
app.use(express.static(path.join(__dirname,'../public')));
app.get('/',(req,res)=>{res.sendFile(path.join(__dirname,'../public/index.html'));});
app.listen(cfg.port,()=>{console.log('App running on port '+cfg.port);});