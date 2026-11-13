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
