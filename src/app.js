const $=s=>document.querySelector(s),dn=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const PR=['أحسنت!','ممتاز!','رائع!','صحيح!','عمل جميل!'],LV=['🔤 رتّب الكانا','🔡 أكمل بعد أول كانا','⌨️ اكتب القراءة من الصوت فقط'];
const EN={dak:'خلط بين المنقوط وغير المنقوط (は/ば/ぱ)',sok:'خطأ في っ الصغيرة',long:'خطأ في المدّ',miss:'كانا ناقصة',extra:'كانا زائدة',swap:'تبديل مكان كانا',sub:'كانا خاطئة'};
let S={words:[],streak:0,last:0,log:{},rate:.8,ret:.9,err:{},am:'l'};
try{Object.assign(S,JSON.parse(localStorage.getItem('smj1')||'{}'))}catch(e){}
S.err=S.err||{};S.ret=S.ret||.9;
const save=()=>{try{localStorage.setItem('smj1',JSON.stringify(S))}catch(e){}};
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let tab='p',ses=null,cur=null,lc=null,voice=null,lh=[],lq=[],wf='all',wsq='',PQ={m:'l',q:''},nf=[],CT=0;

/* ===== أدوات الكانا والرومّاجي ===== */
const H2K=s=>String(s).replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)),K2K=s=>String(s).replace(/[\u3041-\u3096]/g,c=>String.fromCharCode(c.charCodeAt(0)+96));
const VW={};[['あ','あかさたなはまやらわがざだばぱぁゃゎ'],['い','いきしちにひみりぎじぢびぴぃゐ'],['う','うくすつぬふむゆるぐずづぶぷぅゅゔ'],['え','えけせてねへめれげぜでべぺぇゑ'],['お','おこそとのほもよろをごぞどぼぽぉょ']].forEach(([v,cs])=>{for(const c of cs)VW[c]=v});
const normR=s=>{let o='';for(const c of H2K(String(s).replace(/\s+/g,''))){if(c==='ー'){o+=VW[o[o.length-1]]||'ー'}else o+=c}return o};
const TB=(()=>{const t={},V='aiueo',R={'':'あいうえお',k:'かきくけこ',s:'さしすせそ',t:'たちつてと',n:'なにぬねの',h:'はひふへほ',m:'まみむめも',r:'らりるれろ',g:'がぎぐげご',z:'ざじずぜぞ',d:'だぢづでど',b:'ばびぶべぼ',p:'ぱぴぷぺぽ'};
for(const c in R)[...R[c]].forEach((k,i)=>{t[c+V[i]]=k});
Object.assign(t,{ya:'や',yu:'ゆ',yo:'よ',wa:'わ',wo:'を',shi:'し',chi:'ち',tsu:'つ',fu:'ふ',ji:'じ',si:'し',ti:'ち',tu:'つ',hu:'ふ',zi:'じ',di:'ぢ',du:'づ',vu:'ゔ',wi:'うぃ',we:'うぇ',sha:'しゃ',shu:'しゅ',sho:'しょ',she:'しぇ',cha:'ちゃ',chu:'ちゅ',cho:'ちょ',che:'ちぇ',ja:'じゃ',ju:'じゅ',jo:'じょ',je:'じぇ',fa:'ふぁ',fi:'ふぃ',fe:'ふぇ',fo:'ふぉ',va:'ゔぁ',vi:'ゔぃ',ve:'ゔぇ',vo:'ゔぉ',tsa:'つぁ',tse:'つぇ',tso:'つぉ',thi:'てぃ',dhi:'でぃ',xa:'ぁ',xi:'ぃ',xu:'ぅ',xe:'ぇ',xo:'ぉ',la:'ぁ',li:'ぃ',lu:'ぅ',le:'ぇ',lo:'ぉ',xya:'ゃ',xyu:'ゅ',xyo:'ょ',lya:'ゃ',lyu:'ゅ',lyo:'ょ',xtu:'っ',xtsu:'っ',ltu:'っ',ltsu:'っ'});
const Y={k:'き',g:'ぎ',n:'に',h:'ひ',m:'み',r:'り',b:'び',p:'ぴ'};for(const c in Y){t[c+'ya']=Y[c]+'ゃ';t[c+'yu']=Y[c]+'ゅ';t[c+'yo']=Y[c]+'ょ'}
for(const [a,b] of [['sy','し'],['ty','ち'],['cy','ち'],['jy','じ'],['zy','じ'],['dy','ぢ']])for(const [v,s] of [['a','ゃ'],['u','ゅ'],['o','ょ']])t[a+v]=b+s;return t})();
function r2k(s){s=String(s).toLowerCase();let o='',i=0;while(i<s.length){const c=s[i];
if(!/[a-z'\-]/.test(c)){o+=c;i++;continue}
if(c==='-'){o+='ー';i++;continue}
if(c==="'"){i++;continue}
if(c==='t'&&s[i+1]==='c'&&s[i+2]==='h'){o+='っ';i++;continue}
if(i+1<s.length&&c===s[i+1]&&/[bcdfghjklmpqrstvwxyz]/.test(c)){o+='っ';i++;continue}
let m=null;for(let L=4;L>=1;L--){const t=s.substr(i,L);if(TB[t]){m=[t,TB[t]];break}}
if(m){o+=m[1];i+=m[0].length;continue}
if(c==='n'){const n=s[i+1];if(n==="'"){o+='ん';i+=2;continue}
if(n==='n'){const n2=s[i+2];o+='ん';i+=(n2&&/[aiueoy]/.test(n2))?1:2;continue}
if(n&&!/[aiueoy]/.test(n)){o+='ん';i++;continue}}
o+=c;i++}return o}
const finalK=s=>r2k(s).replace(/n$/,'ん');
const KB={あ:'a',い:'i',う:'u',え:'e',お:'o',か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',や:'ya',ゆ:'yu',よ:'yo',ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',わ:'wa',を:'o',ん:'n',が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',ゔ:'vu',ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o',ゃ:'ya',ゅ:'yu',ょ:'yo',ゎ:'wa',ゐ:'i',ゑ:'e'};
const STEM={fu:'f',shi:'sh',chi:'ch',ji:'j',te:'t',de:'d',u:'w',vu:'v',tsu:'ts'};
function rom(s){const a=[...H2K(s)];let o='';for(let i=0;i<a.length;i++){const c=a[i],n=a[i+1];
if(c==='っ'){const r=KB[n]||'';o+=r?(r.startsWith('ch')?'t':r[0]):'';continue}
if(c==='ー'){const p=o[o.length-1];o+=/[aiueo]/.test(p)?p:'-';continue}
if(KB[c]===undefined){o+=c;continue}
let r=KB[c];
if(n&&'ゃゅょ'.includes(n)&&/i$/.test(r)){const st=r==='shi'?'sh':r==='chi'?'ch':r==='ji'?'j':r.slice(0,-1)+'y';r=st+{ゃ:'a',ゅ:'u',ょ:'o'}[n];i++}
else if(n&&'ぁぃぅぇぉ'.includes(n)&&'ふしちじてでうゔつ'.includes(c)){r=(STEM[r]||r.slice(0,-1))+{ぁ:'a',ぃ:'i',ぅ:'u',ぇ:'e',ぉ:'o'}[n];i++}
else if(c==='ん'&&n&&/[あいうえおやゆよ]/.test(n))r="n'";
o+=r}return o}
const CG=['あおめ','いり','うらつ','えねれ','かやが','きさま','くへ','けはほ','こに','さち','しつそん','すむぬ','たな','ちら','てち','とろ','なほは','ぬめわ','のめぬ','ひい','ふう','まも','みめ','もち','やゆ','らう','りい','るろ','れわね','をち','っつ','ゃや','ゅゆ','ょよ'];
const DKS=[['か','が'],['き','ぎ'],['く','ぐ'],['け','げ'],['こ','ご'],['さ','ざ'],['し','じ'],['す','ず'],['せ','ぜ'],['そ','ぞ'],['た','だ'],['ち','ぢ'],['つ','づ'],['て','で'],['と','ど'],['は','ば','ぱ'],['ひ','び','ぴ'],['ふ','ぶ','ぷ'],['へ','べ','ぺ'],['ほ','ぼ','ぽ']];
const DKM={},DK1={};DKS.forEach(g=>g.forEach(c=>{DKM[c]=g.filter(x=>x!==c);DK1[c]=g.join('')}));
function distract(chars,n){const kata=/[\u30a1-\u30ff]/.test(chars[0]),H=chars.map(c=>H2K(c)),pool=[];
H.forEach(c=>{CG.forEach(g=>{if(g.includes(c))pool.push(...[...g].filter(x=>x!==c))});if(DKM[c])pool.push(...DKM[c])});
const base=shuf([...new Set(pool)].filter(x=>!H.includes(x))),fill=shuf([...'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'].filter(x=>!H.includes(x)&&!base.includes(x)));
const out=[...base,...fill].slice(0,n);return kata?out.map(K2K):out}
function cls(w,g){w=normR(w);g=normR(g);const a=[...w],b=[...g];
if(a.length!==b.length){const D=x=>x.replace(/[っー]/g,'');if(D(w)===D(g))return /っ/.test(w+g)?'sok':'long';return b.length<a.length?'miss':'extra'}
const df=a.map((c,k)=>c!==b[k]?k:-1).filter(k=>k>=0);
if(df.length===2&&df[1]===df[0]+1&&a[df[0]]===b[df[1]]&&a[df[1]]===b[df[0]])return'swap';
return df.every(k=>DK1[a[k]]&&DK1[a[k]]===DK1[b[k]])?'dak':'sub'}

/* ===== القاموس الياباني (بلا إنترنت) ===== */
const JC={};
async function jget(p){if(p in JC)return JC[p];try{JC[p]=await(await fetch('dict/j/'+p)).json()}catch(e){JC[p]=null}return JC[p]}
const fh=f=>(f.codePointAt(0)%256).toString(16).padStart(2,'0');
async function jforms(f){const sh=await jget('f'+fh(f)+'.json'),v=sh&&sh[f];return Array.isArray(v)?v:[]}
async function jnorm(f){const sh=await jget('n'+fh(f)+'.json'),v=sh&&sh[f];return Array.isArray(v)?v:[]}
async function jentry(i){const sh=await jget('e'+Math.floor(i/400)+'.json');return sh?sh[i%400]:null}
const pickRead=(e,k)=>{const ra=e[4]||{};return e[1].find(r=>!ra[r]||ra[r].includes(k))||e[1][0]};
const posAr=t=>{t=t||[];if(t.some(x=>/^v1/.test(x)))return'فعل (إيتشيدان)';if(t.some(x=>/^v5/.test(x)))return'فعل (غودان)';if(t.some(x=>x==='vs'||/^vs-/.test(x)))return'فعل (سورو)';if(t.some(x=>/^v/.test(x)))return'فعل';if(t.includes('adj-i'))return'صفة (i)';if(t.includes('adj-na'))return'صفة (na)';if(t.some(x=>/^adj/.test(x)))return'صفة';if(t.some(x=>/^adv/.test(x)))return'حال';if(t.includes('pn'))return'ضمير';if(t.some(x=>x==='n'||/^n-/.test(x)))return'اسم';if(t.includes('prt'))return'أداة';if(t.includes('conj'))return'أداة ربط';if(t.includes('int'))return'تعجب';if(t.includes('exp'))return'عبارة';if(t.includes('ctr'))return'عدّاد';if(t.includes('num'))return'عدد';return t[0]||''};
async function resolveTok(t0){const t=t0.normalize('NFKC').trim();if(!t)return null;let form=t,rm=false;
if(/^[A-Za-z'\-]+$/.test(t)){form=finalK(r2k(t));rm=true}
if(/[A-Za-z]/.test(form))return null;
const kana=/^[\u3041-\u3096\u30a1-\u30fa\u30fc]+$/.test(form);
let ids=rm?[]:await jforms(form);
if(!ids.length&&kana)ids=await jnorm(normR(form));
if(!ids.length&&!kana)return null;
return{t,form,kana,ids}}
async function addWords(txt,m){const toks=[...new Set(txt.split(/[\s,;،、。]+/).map(x=>x.trim()).filter(Boolean))],have=new Set(S.words.map(w=>w.w+'|'+w.r));let added=0;nf=[];
for(const t of toks){const r=await resolveTok(t);if(!r){nf.push(t);continue}
const e=r.ids.length?await jentry(r.ids[0]):null;let w,rd;
if(e&&e[0].includes(r.form)){w=r.form;rd=pickRead(e,r.form)}
else if(e){const ex=e[1].find(x=>x===r.form)||e[1].find(x=>normR(x)===normR(r.form))||(r.kana?r.form:e[1][0]);w=ex;rd=ex}
else if(r.kana){w=r.form;rd=r.form}else{nf.push(t);continue}
if(have.has(w+'|'+rd))continue;have.add(w+'|'+rd);
S.words.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),w,r:rd,e:r.ids.length?r.ids[0]:null,alt:r.ids.slice(0,8),m,due:dn(),b:0,k:0});added++}
S.am=m;save();return added}
const NT=()=>{const C=window.Capacitor;if(!(C&&C.nativePromise&&C.isNativePlatform&&C.isNativePlatform()))return null;return NT.p||(NT.p={speak:o=>C.nativePromise('TextToSpeech','speak',o),isLanguageSupported:o=>C.nativePromise('TextToSpeech','isLanguageSupported',o),getSupportedLanguages:()=>C.nativePromise('TextToSpeech','getSupportedLanguages',{})})};let nok=null,LANGX='ja-JP';
const errm=e=>String((e&&(e.message||e.errorMessage))||e||''),VD=[1500,2000,3000,4000],LC=['ja-JP','ja'];
async function chkVoice(){const T=NT();if(!T)return;for(const d of VD){await new Promise(r=>setTimeout(r,d));if(nok===true)return;for(const l of LC){let ok=false;try{ok=(await T.isLanguageSupported({lang:l})).supported}catch(e){}if(ok){LANGX=l;nok=true;if(!cur)render();return}}}nok=false;if(!cur)render()}
function pickVoice(){if(NT())return nok===false?null:{name:nok?'صوت الهاتف ('+LANGX+')':'جارٍ فحص صوت الهاتف…',localService:true};try{const v=speechSynthesis.getVoices().filter(x=>/^ja/i.test(x.lang));voice=v.find(x=>x.localService&&/ja[-_]JP/i.test(x.lang))||v.find(x=>x.localService)||v[0]||null}catch(e){}return voice}
try{speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
function say(t,r){const T=NT();if(T){T.speak({text:t,lang:LANGX,rate:r||S.rate||.8,pitch:1,volume:1}).then(()=>{if(nok!==true){nok=true;if(!cur)render()}}).catch(e=>{const m=errm(e);if(/not supported/i.test(m)){nok=false;if(!cur)render();toast('الصوت الإنجليزي غير متوفر في محرك النطق')}else if(/initializ/i.test(m))toast('محرك النطق يجهّز نفسه… أعد المحاولة بعد لحظة');else toast('تعذّر النطق: '+m.slice(0,80))});return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=voice?voice.lang:'ja-JP';if(voice)u.voice=voice;u.rate=r||S.rate||.8;speechSynthesis.speak(u)}catch(e){}}
const spell=w=>say([...w].join('、'),.6);
function toast(t,u){const d=document.createElement('div');d.className='toast';d.textContent=t;if(u){const b=document.createElement('button');b.textContent='تراجع';b.style.cssText='margin-inline-start:12px;background:none;border:1px solid #fff;color:#fff;border-radius:10px;padding:2px 10px;font:inherit';b.onclick=()=>{u();d.remove()};d.append(b)}document.body.append(d);setTimeout(()=>d.remove(),u?8000:2200)}
const FW=[.4872,1.4003,3.7145,13.8206,5.1618,1.2298,.8975,.031,1.6474,.1367,1.0461,2.1072,.0793,.3246,1.587,.2272,2.8755],FC=19/81,cl=(x,a,b)=>Math.min(b,Math.max(a,x));
function fs(w,g,n){let s=w.s,d=w.d;
if(s==null){s=FW[g-1];d=FW[4]-FW[5]*(g-3)}
else{const R=Math.pow(1+FC*Math.max(0,n-(w.lr==null?n:w.lr))/s,-.5),s0=s;
s=g===1?Math.min(s0,FW[11]*Math.pow(d,-FW[12])*(Math.pow(s0+1,FW[13])-1)*Math.exp(FW[14]*(1-R))):s0*(1+Math.exp(FW[8])*(11-d)*Math.pow(s0,-FW[9])*(Math.exp(FW[10]*(1-R))-1)*(g===2?FW[15]:1)*(g===4?FW[16]:1));
d=FW[7]*FW[4]+(1-FW[7])*(d-FW[6]*(g-3))}
w.s=cl(s,.1,3650);w.d=cl(d,1,10);w.lr=n;
w.due=n+(g===1?1:Math.max(1,Math.round(w.s/FC*(Math.pow(S.ret||.9,-2)-1))))}
const lvl=w=>(w.b||0)<2?0:(w.b||0)<4?1:2,mv=(w,m)=>{w.m=m;w.due=dn();w.k=0;save()};
function grade(w,g){const n=dn(),ok=g>1;w.t=(w.t||0)+1;
if(ok){w.ok=(w.ok||0)+1;w.b=(w.b||0)+1}else{w.bad=(w.bad||0)+1;w.b=0}
if(w.lr!==n)fs(w,g,n);else if(!ok)w.due=n+1;
S.log[n]=(S.log[n]||0)+1;if(S.last!==n){S.streak=S.last===n-1?S.streak+1:1;S.last=n}
let lee=false;if(!ok&&w.bad>=4&&(w.ok||0)<w.bad*2){w.lc=1;w.bad=0;w.ok=0;lee=true}
save();return lee}
function fitAll(){document.querySelectorAll('.fw').forEach(e=>{let f=+(e.dataset.fs||42);e.style.whiteSpace='nowrap';e.style.wordBreak='normal';e.style.fontSize=f+'px';while(e.scrollWidth>e.clientWidth+1&&f>16){f-=2;e.style.fontSize=f+'px'}if(e.scrollWidth>e.clientWidth+1){e.style.whiteSpace='normal';e.style.wordBreak='break-all'}})}
const M=h=>{CT++;$('#main').innerHTML=h;fitAll()};

function render(){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));({p:vP,l:vL,w:vW,m:vM})[tab]()}
/* ===== التمرين ===== */
function vP(){if(cur)return vQ();if(ses&&ses.done)return vEnd();
const n=dn(),d=S.words.filter(w=>w.m==='d'),due=d.filter(w=>w.due<=n).length;
M(`${pickVoice()?'':'<div class="card" style="border-color:var(--bad)">⚠️ محرك النطق في هاتفك لا يملك صوتاً يابانياً. من الإعدادات ← اللغة والإدخال (أو إعدادات إضافية) ← إخراج تحويل النص إلى كلام ← محرك Google ← ⚙️ ← تثبيت بيانات الصوت ← 日本語. (هذا غير «الكتابة بالصوت».)</div>'}
<div class="card" style="text-align:center"><div class="tag">🔥 ${S.streak} يوم متتالي</div><div class="big" style="font-size:60px">${due}</div><p>${due?'كلمة مستحقة للمراجعة اليوم':d.length?'لا شيء مستحق اليوم 🎉':'لا توجد كلمات إملاء بعد'}</p>
<button class="btn" style="width:100%" data-a="${due?'start':d.length?'force':'goW'}">${due?'ابدأ التمرين':d.length?'تدرّب على أي حال':'أضف كلمات'}</button>${d.length?'<button class="btn g" style="width:100%;margin-top:10px" data-a="pkopen" data-m="d">📋 اختر كلمة معيّنة للتدرّب عليها</button>':''}</div>`)}
function startSession(force){const n=dn();let q=S.words.filter(w=>w.m==='d'&&(force||w.due<=n));q=shuf(q).slice(0,20).map(w=>w.id);if(!q.length)return toast('لا توجد كلمات');ses={q,i:0,ok:0,bad:0,rt:{}};nextQ()}
function nextQ(){if(ses.i>=ses.q.length){cur=null;ses.done=1;return render()}
const w=S.words.find(x=>x.id===ses.q[ses.i]);if(!w||w.m!=='d'){ses.i++;return nextQ()}
const L=[...w.r],lv=lvl(w);cur={w,lv,t0:Date.now(),hint:0,val:'',raw:''};
if(lv===0){cur.tiles=shuf([...L,...distract(L,Math.max(2,Math.ceil(L.length/3)))]).map(c=>({c}));cur.slots=Array(L.length).fill(-1)}
render();setTimeout(()=>say(w.r),250)}
const chars=c=>c.lv===0?c.slots.map(i=>i<0?'':c.tiles[i].c):[...c.w.r].map((x,k)=>k?([...c.val][k-1]||''):x),
guessOf=c=>c.lv===0?chars(c).join(''):c.lv===1?[...c.w.r][0]+finalK(c.raw||''):finalK(c.raw||''),
sh=(ch,res)=>ch.map((c,k)=>`<div class="slot ${c?'f':''} ${res?res[k]:''}" ${!res&&cur.lv===0?`data-a="rm" data-k="${k}"`:''}>${c}</div>`).join('');
const fb=c=>`<div class="fb">${c.ok?`<h2 style="color:var(--ok)">✅ ${c.pr}</h2><div class="big fw" data-fs="34">${c.w.w}</div><div class="mu ltr" style="text-align:center">${c.w.r!==c.w.w?c.w.r+' · ':''}${rom(c.w.r)}</div><p class="mu">مراجعتها القادمة بعد ${Math.max(1,c.w.due-dn())} يوم</p>`:`<h2 style="color:var(--bad)">❌ الصحيح:</h2><div class="big fw" data-fs="34">${c.w.r}</div><div class="mu ltr" style="text-align:center">${rom(c.w.r)}</div>${c.w.w!==c.w.r?`<div class="big fw" data-fs="30" style="margin-top:6px">${c.w.w}</div>`:''}<p class="mu">كتبت: <span class="ltr">${c.guess}</span></p>${c.leech?'<p>🧩 كلمة عنيدة (أخطأت فيها 4 مرات). هل تنقلها إلى الحفظ لتحفظها ثم تعود؟ <button class="btn g" data-a="lee2l">انقلها إلى الحفظ</button></p>':''}<p>✍️ اكتب القراءة الصحيحة مرة واحدة للمتابعة (رومّاجي أو كانا)</p><input id="cp" class="ti" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" dir="ltr">`}<div id="arf" class="arm"></div><div class="row" style="margin-top:10px"><button class="btn g" data-a="sp">🔤 تهجئة</button><button class="btn" id="nxb" data-a="nx" ${c.ok?'':'disabled'}>التالي ›</button></div></div>`;
function vQ(){const c=cur,tg=[...c.w.r];
const body=c.res?`<div class="slots">${sh(c.gch,c.res)}</div>`:c.lv===2?`<div id="kv" class="kv">${c.val||''}</div>`:`<div class="slots" id="sl">${sh(chars(c),null)}</div>`;
const inp=c.lv===0?`<div class="tiles">${c.tiles.map((t,i)=>`<button class="tile" data-a="pk" data-i="${i}" ${c.slots.includes(i)?'disabled':''}>${t.c}</button>`).join('')}</div>`:`<input id="ti" class="ti" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" dir="ltr" placeholder="${c.lv===1?'اكتب باقي القراءة (رومّاجي أو كانا)':'اكتب القراءة (رومّاجي أو كانا)'}" value="${c.raw||''}"><div id="hn" class="mu" style="min-height:26px;margin-top:6px;font-size:18px">${c.hint?'تلميح: '+tg.slice(0,(c.lv===1?1:0)+c.hint).join('')+'…':''}</div>`;
M(`<div class="bar"><i style="width:${ses.i/ses.q.length*100}%"></i></div><div class="card" style="margin-top:14px;text-align:center"><span class="tag">${LV[c.lv]}</span>
<div class="row" style="margin-top:10px"><button class="btn g" data-a="say">🔊 استمع</button><button class="btn g" data-a="slow">🐢 ببطء</button>${c.lv&&!c.res?'<button class="btn g" data-a="hint">💡 تلميح</button>':''}</div>
${body}${c.res?fb(c):inp+`<div class="row" style="margin-top:10px">${c.lv===0?'<button class="btn g" data-a="clr">مسح</button>':''}<button class="btn" data-a="chk">تحقق ✓</button></div>`}</div>`);
if(c.res)jmShort(c.w,'#arf');
if(c.lv&&!c.res)setTimeout(()=>{const t=$('#ti');t&&t.focus()},60);if(c.res&&!c.ok)setTimeout(()=>{const t=$('#cp');t&&t.focus()},60)}
function vEnd(){M(`<div class="card fb"><h2>🏁 انتهت الجلسة</h2><p>✅ ${ses.ok} صحيحة · ❌ ${ses.bad} خاطئة</p><p class="mu">الأخطاء ستعود إليك غداً تلقائياً.</p><button class="btn" style="width:100%" data-a="back">رجوع</button></div>`)}
/* ===== المعاني ===== */
async function jmShort(w,sel){const tk=CT,e=w.e!=null?await jentry(w.e):null;if(tk!==CT)return;const el=$(sel);if(!el)return;
el.innerHTML=e?e[2].slice(0,2).map(x=>`<div class="sn"><span class="tag">${posAr(x[0])}</span>${x[2]?`<div class="sar"><b>${x[2]}</b></div>`:''}<div class="sen mu">${x[1].slice(0,3).join('؛ ')}</div></div>`).join(''):'<span class="mu" style="font-size:14px">لا يوجد تعريف لهذه الكلمة في القاموس المدمج</span>'}
async function jmFill(w){const tk=CT,e=w.e!=null?await jentry(w.e):null;if(tk!==CT)return;const arm=$('#arm'),df=$('#df');
if(!e){if(df)df.innerHTML='<span class="mu">لا يوجد تعريف لهذه الكلمة في القاموس المدمج</span>';return}
const ar=e[2].map(x=>x[2]).filter(Boolean);
if(arm)arm.innerHTML=ar.length?`<div><span class="tag">${posAr(e[2][0][0])}</span> <b>${ar[0]}</b></div>`:'<span class="mu" style="font-size:14px">لا توجد ترجمة عربية مشتقة لهذه الكلمة</span>';
if(df)df.innerHTML='<div class="mu" style="font-size:12px;text-align:center">المعاني (الإنجليزية من JMdict، والعربية مشتقة عبر الإنجليزية وقد تحتوي أخطاء)</div>'+e[2].map(x=>`<div class="sn"><span class="tag">${posAr(x[0])}</span>${x[2]?`<div class="sar"><b>${x[2]}</b></div>`:''}<div class="sen mu">${x[1].join('؛ ')}</div></div>`).join('')}
/* ===== الحفظ ===== */
function vL(){const l=S.words.filter(w=>w.m==='l');
if(!l.length){const nd=S.words.length;return M(`<div class="card" style="text-align:center">${nd?`لا توجد كلمات في الحفظ الآن.<br>كلماتك كلها (<b>${nd}</b>) في الإملاء، وتنتقل الكلمة إليه فقط عندما تضغط أنت «حفظتها».<br><br><button class="btn" data-a="allto" data-t="l">رجّع كل الكلمات إلى الحفظ</button><br><br><button class="btn g" data-a="goW">كلماتي</button>`:`لا توجد كلمات بعد.<br><br><button class="btn" data-a="goW">أضف كلمات</button>`}</div>`)}
if(!l.find(w=>w.id===lc))lc=shuf(l)[0].id;const w=l.find(x=>x.id===lc);
M(`<button class="btn g" style="width:100%;margin-bottom:10px" data-a="pkopen" data-m="l">📋 اختر كلمة من القائمة (${l.length})</button><div class="card" style="text-align:center"><span class="tag">في الحفظ: ${l.length}</span> <span class="tag">في الإملاء: ${S.words.length-l.length}</span>${w.lc?' <span class="tag">🧩 عنيدة</span>':''}<div class="stk"><div class="big fw" data-fs="40" style="margin:0">${w.w}</div></div><div class="rd">${w.r}</div><div class="mu ltr" style="text-align:center">${rom(w.r)}</div><div id="arm" class="arm"></div><div id="df" class="mu" style="min-height:44px;margin-top:8px"></div>
<div class="row"><button class="btn g" data-a="lsay">🔊 استمع</button><button class="btn g" data-a="lslow">🐢 ببطء</button><button class="btn g" data-a="lsp">🔤 تهجئة</button></div><br>
<div class="row"><button class="btn g" data-a="lprev">السابق</button><button class="btn ok" data-a="lok">حفظتها ✓</button><button class="btn g" data-a="lnx">التالي</button></div><div class="mu" style="font-size:12px;margin:6px 0 10px">لن تنتقل أي كلمة إلى الإملاء إلا إذا ضغطت أنت «حفظتها» أو «انقلها»</div>
${w.alt&&w.alt.length>1?`<button class="btn g" style="width:100%;margin-bottom:10px" data-a="alt" data-id="${w.id}">هذه ليست الكلمة المقصودة؟ اختر معنى آخر (${w.alt.length})</button>`:''}<button class="btn g" style="width:100%" data-a="l2d">انقلها إلى الإملاء الآن 🎯</button></div>`);
$('#main').scrollTop=0;say(w.r);jmFill(w)}
/* ===== الكلمات ===== */
const matchQ=(w,q)=>{if(!q)return true;const k=/[a-z]/.test(q)?finalK(r2k(q)):q;return w.w.includes(q)||w.r.includes(q)||normR(w.r).includes(normR(k))||rom(w.r).includes(q)};
function wlist(){const L=S.words.filter(w=>(wf==='all'||w.m===wf)&&matchQ(w,wsq));return L.length?L.slice(0,500).map(w=>`<div class="w"><b data-a="wopen" data-id="${w.id}" style="color:var(--pr);cursor:pointer">${w.w}</b><span class="mu" style="font-size:13px">${w.r!==w.w?w.r:''}</span><span class="tag">${w.m==='l'?'حفظ':'إملاء · م'+(lvl(w)+1)}</span><button class="ic" data-a="wsay" data-id="${w.id}">🔊</button><button class="ic" data-a="wmv" data-id="${w.id}">⇄</button><button class="ic" data-a="wdel" data-id="${w.id}">🗑</button></div>`).join('')+(L.length>500?`<div class="mu" style="text-align:center;padding:10px">يُعرض أول 500 من ${L.length} — استعمل البحث</div>`:''):'لا توجد كلمات هنا'}
function vW(){const nl=S.words.filter(w=>w.m==='l').length,nd=S.words.length-nl,chip=(f,t)=>`<button class="btn ${wf===f?'':'g'}" style="padding:8px 4px;font-size:14px" data-a="wf" data-f="${f}">${t}</button>`;
M(`<div class="card"><textarea id="nw" rows="4" class="ltr" placeholder="الصق الكلمات اليابانية (كانجي أو كانا) أو بالرومّاجي: كلمة في كل سطر أو مفصولة بفواصل"></textarea>
<div class="mu" style="font-size:12px;margin-top:8px">أضف الكلمات إلى:</div>
<div class="row" style="margin-top:6px"><select id="nm"><option value="d" ${S.am==='l'?'':'selected'}>إملاء</option><option value="l" ${S.am==='l'?'selected':''}>حفظ</option></select><button class="btn" id="addb" data-a="add">إضافة</button></div></div>
${nf.length?`<div class="card" style="border-color:var(--bad)">لم أجد هذه الكلمات في القاموس (ولم أضفها): <b>${nf.join('، ')}</b><br><span class="mu" style="font-size:13px">تأكد من كتابتها، أو اكتبها بالكانا.</span></div>`:''}
<div class="card"><input id="wq" class="ti" style="font-size:16px;padding:10px;margin-bottom:10px" placeholder="ابحث في كلماتي" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" dir="ltr" value="${wsq}">
<div class="row" style="margin-bottom:10px">${chip('all','الكل ('+S.words.length+')')}${chip('l','حفظ ('+nl+')')}${chip('d','إملاء ('+nd+')')}</div>
${wf==='d'&&nd?`<button class="btn g" style="width:100%;margin-bottom:8px" data-a="allto" data-t="l">نقل كل كلمات الإملاء إلى الحفظ</button>`:''}${wf==='l'&&nl?`<button class="btn g" style="width:100%;margin-bottom:8px" data-a="allto" data-t="d">نقل كل كلمات الحفظ إلى الإملاء</button>`:''}
<div id="wl">${wlist()}</div></div>`)}
/* ===== قائمة اختيار كلمة معيّنة ===== */
function openWord(id){const w=S.words.find(x=>x.id===id);if(!w)return;if(w.m==='l'){tab='l';if(lc&&lc!==id)lh.push(lc);lc=id;lq=lq.filter(x=>x!==id);render()}else{tab='p';cur=null;ses={q:[id],i:0,ok:0,bad:0,rt:{}};nextQ()}}
function pickList(){const m=PQ.m,q=PQ.q,all=S.words.filter(w=>w.m===m),L=all.map((w,i)=>[w,i+1]).filter(([w])=>matchQ(w,q)),sh2=L.slice(0,300);
$('#pc').textContent=(m==='l'?'كلمات الحفظ: ':'كلمات الإملاء: ')+all.length+' (بترتيب الإدخال)'+(q?' · المطابق: '+L.length:'')+(L.length>300?' · يُعرض أول 300، اكتب للبحث':'');
$('#pl').innerHTML=sh2.length?sh2.map(([w,n])=>`<button class="pi ${m==='l'&&w.id===lc?'on':''}" data-a="pkpick" data-id="${w.id}"><span class="mu" style="width:44px;font-size:13px;flex:none">${n}</span><span style="flex:1">${w.w}${w.r!==w.w?` <span class="mu" style="font-size:14px">${w.r}</span>`:''}</span><span class="mu" style="font-size:13px">${m==='l'?(w.lc?'🧩':''):'م'+(lvl(w)+1)}</span></button>`).join(''):'<div class="mu" style="text-align:center;padding:30px">لا توجد كلمات مطابقة</div>'}
function openPick(m){PQ={m,q:''};const o0=$('#pk');if(o0)o0.remove();const o=document.createElement('div');o.id='pk';o.className='sheet';
o.innerHTML='<div class="top"><button class="btn g" data-a="pkx" style="padding:10px 16px">✕</button><input id="pq" class="ti" style="font-size:16px;padding:10px" placeholder="ابحث عن كلمة" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" dir="ltr"></div><div class="mu" id="pc" style="padding:8px 16px;font-size:13px"></div><div class="lst" id="pl"></div>';
document.body.append(o);pickList();const c0=o.querySelector('.pi.on');if(c0&&c0.scrollIntoView)c0.scrollIntoView({block:'center'})}
async function openAlt(id){const w=S.words.find(x=>x.id===id);if(!w||!w.alt)return;const o0=$('#pk');if(o0)o0.remove();const o=document.createElement('div');o.id='pk';o.className='sheet';
o.innerHTML='<div class="top"><button class="btn g" data-a="pkx" style="padding:10px 16px">✕</button><div style="flex:1;text-align:center;font-weight:700">اختر المعنى المقصود</div></div><div class="lst" id="pl"></div>';document.body.append(o);
const rows=[];for(const i of w.alt){const e=await jentry(i);if(!e)continue;const s0=e[2][0];rows.push(`<button class="pi ${i===w.e?'on':''}" data-a="altpick" data-id="${w.id}" data-i="${i}" style="flex-direction:column;align-items:flex-start;gap:3px"><span style="font-size:22px">${e[0][0]||e[1][0]} <span class="mu" style="font-size:15px">${e[1][0]}</span></span><span class="mu" style="font-size:13px">${s0?s0[1].slice(0,3).join('؛ '):''}</span>${s0&&s0[2]?`<span style="font-size:16px;direction:rtl"><b>${s0[2]}</b></span>`:''}</button>`)}
const pl=$('#pl');if(pl)pl.innerHTML=rows.join('')}
/* ===== الإحصائيات ===== */
function vM(){const n=dn(),d=S.words.filter(w=>w.m==='d'),t=d.reduce((a,w)=>a+(w.t||0),0),ok=d.reduce((a,w)=>a+(w.ok||0),0),top=Object.entries(S.err).sort((a,b)=>b[1]-a[1]).slice(0,3);pickVoice();
M(`<div class="card"><div class="row" style="text-align:center"><div><div class="big" style="font-size:28px">🔥${S.streak}</div>أيام</div><div><div class="big" style="font-size:28px">${S.log[n]||0}</div>اليوم</div><div><div class="big" style="font-size:28px">${t?Math.round(ok/t*100):0}%</div>الدقة</div></div></div>
<div class="card">الكلمات: ${S.words.length} (حفظ ${S.words.length-d.length} · إملاء ${d.length}) · مستحقة اليوم: ${d.filter(w=>w.due<=n).length}</div>
<div class="card"><b>🔍 أنماط أخطائك</b>${top.length?top.map(([k,v])=>`<div>${EN[k]||k} — ${v}</div>`).join(''):'<div class="mu">لا أخطاء بعد 👌</div>'}</div>
<div class="card"><b>🧠 نسبة التذكّر المستهدفة:</b> <span id="rv">${Math.round(S.ret*100)}%</span><br><input type="range" id="rr" min="80" max="95" value="${Math.round(S.ret*100)}" style="width:100%"><div class="mu">أعلى = مراجعات أكثر وحفظ أقوى. المعتمد 90%.</div></div>
<div class="card"><b>الصوت:</b> ${voice?'✅ '+voice.name+(voice.localService?' (محلي – بدون إنترنت)':' ⚠️ قد يحتاج إنترنت'):'⚠️ لا يوجد صوت ياباني في محرك النطق – ثبّته من إعدادات الهاتف ← إخراج تحويل النص إلى كلام'}<br><br>السرعة <input type="range" id="rt" min=".4" max="1.1" step=".05" value="${S.rate}"> <button class="btn g" data-a="test">جرّب</button></div>
<div class="card row"><button class="btn g" data-a="exp">تصدير</button><button class="btn g" data-a="imp">استيراد</button><button class="btn g" data-a="rst" style="color:var(--bad)">مسح الكل</button></div><div class="mu" style="font-size:11px;text-align:center">القاموس: JMdict © EDRDG (edrdg.org) · المعاني العربية مشتقة عبر الإنجليزية من koreader-dicts وArabic WordNet 4.1 وOpen English WordNet (CC BY-SA 4.0 / CC BY 4.0)</div>`)}
/* ===== الأحداث ===== */
document.addEventListener('click',e=>{
const nb=e.target.closest('nav button');if(nb){tab=nb.dataset.t;return render()}
const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id,W=()=>S.words.find(x=>x.id===id),LW=()=>S.words.find(x=>x.id===lc),next=()=>{const ok=new Set(S.words.filter(w=>w.m==='l').map(w=>w.id));lq=lq.filter(i=>ok.has(i)&&i!==lc);if(!lq.length)lq=shuf([...ok].filter(i=>i!==lc));if(lq.length){if(lc){lh.push(lc);if(lh.length>100)lh.shift()}lc=lq.shift()}render()};
switch(a){
case'start':startSession(false);break;case'force':startSession(true);break;case'goW':tab='w';render();break;
case'back':ses=null;cur=null;render();break;
case'say':say(cur.w.r);break;case'slow':say(cur.w.r,.5);break;case'sp':spell(cur.w.r);break;
case'hint':{cur.hint++;const h=$('#hn');if(h)h.textContent='تلميح: '+[...cur.w.r].slice(0,(cur.lv===1?1:0)+cur.hint).join('')+'…';break}
case'pk':{const k=cur.slots.indexOf(-1);if(k>=0){cur.slots[k]=+b.dataset.i;vQ()}break}
case'rm':if(!cur.res){cur.slots[+b.dataset.k]=-1;vQ()}break;
case'clr':cur.slots.fill(-1);vQ();break;
case'chk':{const c=cur,g=guessOf(c);if(c.lv===0&&c.slots.includes(-1))return toast('أكمل كل الخانات');if(!g.trim())return toast('اكتب القراءة');
const w=c.w,ok=normR(g)===normR(w.r),ms=Date.now()-c.t0;let r=1;if(ok){r=3;if(c.hint||ms>3e4)r=2;else if(c.lv>0&&ms<3500+1500*[...w.r].length)r=4}
const tg=[...w.r],gg=[...g];c.guess=g;c.ok=ok;c.pr=shuf(PR)[0];c.gch=tg.map((_,k)=>gg[k]||'');c.res=tg.map((x,k)=>ok||(gg[k]&&H2K(gg[k])===H2K(x))?'ok':'bad');
if(!ok){const k=cls(w.r,g);S.err[k]=(S.err[k]||0)+1}
c.leech=grade(w,r);ok?ses.ok++:ses.bad++;
if(!ok&&!c.leech&&!ses.rt[w.id]){ses.rt[w.id]=1;ses.q.push(w.id)}
if(navigator.vibrate)navigator.vibrate(ok?30:[60,40,60]);say(w.r);vQ();break}
case'nx':ses.i++;nextQ();break;
case'lsay':say(LW().r);break;case'lslow':say(LW().r,.5);break;case'lsp':spell(LW().r);break;
case'lok':{const w=LW();mv(w,'d');w.lc=0;toast('🎯 انتقلت «'+w.w+'» إلى الإملاء',()=>{w.m='l';w.k=0;save();lc=w.id;render()});next();break}
case'lnx':next();break;
case'lprev':{let ok=false;while(lh.length){const id2=lh.pop();if(S.words.some(x=>x.id===id2&&x.m==='l')){lc=id2;ok=true;break}}if(ok)render();else toast('هذه أول بطاقة');break}
case'l2d':{const w=LW();mv(w,'d');toast('🎯 انتقلت «'+w.w+'» إلى الإملاء',()=>{w.m='l';w.k=0;save();lc=w.id;render()});next();break}
case'lee2l':{const w=cur&&cur.w;if(w){mv(w,'l');w.s=null;save();toast('🧩 انتقلت «'+w.w+'» إلى الحفظ',()=>{w.m='d';save()});b.disabled=true}break}
case'add':{const m=$('#nm').value,txt=$('#nw').value;b.disabled=true;b.textContent='جارٍ البحث…';addWords(txt,m).then(n=>{toast(n?`أُضيفت ${n} كلمة إلى ${m==='l'?'الحفظ':'الإملاء'}`:'لا كلمات جديدة');vW()});break}
case'wsay':say(W().r);break;
case'wmv':{const w=W();mv(w,w.m==='d'?'l':'d');vW();break}
case'wdel':S.words=S.words.filter(x=>x.id!==id);save();vW();break;
case'wf':wf=b.dataset.f;vW();break;
case'allto':{const t=b.dataset.t,g=S.words.filter(x=>x.m===(t==='l'?'d':'l'));if(!g.length)break;if(confirm('نقل '+g.length+' كلمة إلى '+(t==='l'?'الحفظ':'الإملاء')+'؟')){g.forEach(x=>{x.m=t;x.k=0;x.due=dn()});save();toast('تم نقل '+g.length+' كلمة');render()}break}
case'pkopen':openPick(b.dataset.m);break;
case'pkx':{const o=$('#pk');if(o)o.remove();break}
case'pkpick':{const o=$('#pk');if(o)o.remove();openWord(id);break}
case'wopen':openWord(id);break;
case'alt':openAlt(id);break;
case'altpick':{const w=W(),i=+b.dataset.i;jentry(i).then(e=>{if(w&&e){w.e=i;if(e[0].includes(w.w))w.r=pickRead(e,w.w);save()}const o=$('#pk');if(o)o.remove();render()});break}
case'test':say('こんにちは');break;
case'exp':{const j=JSON.stringify(S);if(NT()){navigator.clipboard.writeText(j).then(()=>toast('تم نسخ النسخة الاحتياطية – الصقها في ملاحظات'),()=>toast('تعذّر النسخ'));break}const a2=document.createElement('a');a2.href=URL.createObjectURL(new Blob([j],{type:'application/json'}));a2.download='spellmaster-ja-backup.json';a2.click();break}
case'imp':if(NT()){const t=prompt('الصق النسخة الاحتياطية هنا');if(t)impT(t)}else $('#fi').click();break;
case'rst':if(confirm('مسح كل الكلمات والتقدّم؟')){S={words:[],streak:0,last:0,log:{},rate:.8,ret:.9,err:{},am:'l'};save();render()}break}});
document.addEventListener('input',e=>{const t=e.target,i=t.id;
if(i==='rt'){S.rate=+t.value;save()}
else if(i==='rr'){S.ret=t.value/100;$('#rv').textContent=t.value+'%';save()}
else if(i==='ti'&&cur){cur.raw=t.value;cur.val=r2k(t.value);const k=$('#kv');if(k)k.textContent=cur.val;if(cur.lv===1&&$('#sl'))$('#sl').innerHTML=sh(chars(cur),null)}
else if(i==='cp'&&cur){const bn=$('#nxb');if(bn)bn.disabled=normR(finalK(t.value))!==normR(cur.w.r)}
else if(i==='nm'){S.am=t.value;save()}
else if(i==='pq'){PQ.q=t.value.trim().toLowerCase();pickList()}
else if(i==='wq'){wsq=t.value.trim().toLowerCase();const el=$('#wl');if(el)el.innerHTML=wlist()}});
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;if(e.target.id==='ti'){const b=document.querySelector('[data-a=chk]');b&&b.click()}if(e.target.id==='cp'){const b=$('#nxb');if(b&&!b.disabled)b.click()}});
function impT(t){try{const j=JSON.parse(t);if(!Array.isArray(j.words))throw 0;S=Object.assign(S,j);S.err=S.err||{};save();toast('تم الاستيراد');render()}catch(x){toast('نسخة غير صالحة')}}
$('#fi').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>impT(r.result);r.readAsText(f)});
pickVoice();render();chkVoice();
