// يجهّز eSpeak NG (مولّد النطق) للعمل داخل التطبيق: سكربت عادي + بيانات الإنجليزية فقط بلا ضغط
const fs=require('fs'),path=require('path'),zlib=require('zlib');
const P=path.join(__dirname,'..','node_modules','@spelling-creator','spellophone'),OUT=path.join(__dirname,'..','www','vendor');
const D=path.join(OUT,'espeak-ng-data');fs.mkdirSync(D,{recursive:true});
fs.copyFileSync(path.join(P,'dist','legacy','spellophone.iife.js'),path.join(OUT,'spellophone.iife.js'));
fs.copyFileSync(path.join(P,'LICENSE'),path.join(OUT,'LICENSE-spellophone-espeak-ng-GPL3.txt'));
const m=JSON.parse(fs.readFileSync(path.join(P,'espeak-ng-data','manifest.json'),'utf8'));
const core=zlib.gunzipSync(fs.readFileSync(path.join(P,'espeak-ng-data',m.core.file)));fs.writeFileSync(path.join(D,'core.bin'),core);
const en=m.dictionaries.en,ed=zlib.gunzipSync(fs.readFileSync(path.join(P,'espeak-ng-data',en.file)));fs.writeFileSync(path.join(D,'en_dict'),ed);
const out=Object.assign({},m,{encoding:'identity',core:Object.assign({},m.core,{file:'core.bin',size:core.length}),dictionaries:{en:Object.assign({},en,{file:'en_dict',size:ed.length})}});
fs.writeFileSync(path.join(D,'manifest.json'),JSON.stringify(out));
console.log('espeak assets ready: core',core.length,'bytes, en_dict',ed.length,'bytes');
