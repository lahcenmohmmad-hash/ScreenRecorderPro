// يبني قاموساً مدمجاً (WordNet 3.1) على شكل ملفات JSON صغيرة حسب الحرف الأول
const fs=require('fs'),path=require('path');
const D=path.join(__dirname,'..','node_modules','wordnet-db','dict'),OUT=path.join(__dirname,'..','www','dict');
fs.mkdirSync(OUT,{recursive:true});
const POS={noun:'n',verb:'v',adj:'adj',adv:'adv'},rd=f=>fs.readFileSync(path.join(D,f),'utf8').split('\n');
const trunc=(s,n)=>s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s;
const gl={};
for(const p in POS){gl[p]=new Map();for(const l of rd('data.'+p)){if(!l||l.startsWith('  '))continue;const i=l.indexOf(' | ');if(i>0)gl[p].set(l.slice(0,8),l.slice(i+3).trim())}}
const all=Object.create(null);
for(const p in POS){for(const l of rd('index.'+p)){if(!l||l.startsWith('  '))continue;const f=l.split(' '),w=f[0];if(!/^[a-z]+$/.test(w))continue;
const pc=+f[3],tag=+f[5+pc],offs=f.slice(6+pc).filter(Boolean).slice(0,2);
const s=offs.map(o=>{const g=gl[p].get(o);if(!g)return null;const i=g.indexOf('; "');const def=i<0?g:g.slice(0,i),ex=i<0?'':g.slice(i+3).split('"')[0];return[POS[p],trunc(def,170),trunc(ex,130)]}).filter(Boolean);
if(s.length)(all[w]=all[w]||[]).push({tag,s})}}
const shards=Object.create(null);let n=0;
for(const w in all){const e=all[w].sort((a,b)=>b.tag-a.tag).flatMap(x=>x.s).slice(0,3);(shards[w[0]]=shards[w[0]]||Object.create(null))[w]=e;n++}
for(const l in shards)fs.writeFileSync(path.join(OUT,l+'.json'),JSON.stringify(shards[l]));
const lic=rd('data.noun').filter(l=>l.startsWith('  ')).join('\n');fs.writeFileSync(path.join(OUT,'WORDNET-LICENSE.txt'),lic);
console.log('words:',n,'shards:',Object.keys(shards).length);
