const $=s=>document.querySelector(s),dn=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*6e4)/864e5);
const PR=['أحسنت!','ممتاز!','رائع!','صحيح!','عمل جميل!'],LV=['🔤 رتّب الكانا','🔡 أكمل بعد أول كانا','⌨️ اكتب القراءة من الصوت فقط'];
const EN={dak:'خلط بين المنقوط وغير المنقوط (は/ば/ぱ)',sok:'خطأ في っ الصغيرة',long:'خطأ في المدّ',miss:'كانا ناقصة',extra:'كانا زائدة',swap:'تبديل مكان كانا',sub:'كانا خاطئة'};
let S={words:[],streak:0,last:0,log:{},rate:.8,ret:.9,err:{},am:'l'};
try{Object.assign(S,JSON.parse(localStorage.getItem('smj1')||'{}'))}catch(e){}
S.err=S.err||{};S.ret=S.ret||.9;
const save=()=>{try{localStorage.setItem('smj1',JSON.stringify(S))}catch(e){}};
const shuf=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let tab='p',ses=null,cur=null,lc=null,voice=null,lh=[],lq=[],wf='all',wsq='',PQ={m:'l',q:''},nf=[],CT=0;
