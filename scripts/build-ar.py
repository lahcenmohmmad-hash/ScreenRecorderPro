# يحوّل قاموس koreader-dicts (en-ar، رخصة CC BY-SA 4.0) إلى ملفات JSON صغيرة حسب الحرف الأول
import zipfile,gzip,struct,re,json,html,os
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');OUT=os.path.join(R,'www','dict','ar');os.makedirs(OUT,exist_ok=True)
z=zipfile.ZipFile(os.path.join(R,'data','en-ar.zip'));rd=lambda n:z.read('en-ar/'+n)
idx,dz,syn=rd('en-ar.idx'),gzip.decompress(rd('en-ar.dict.dz')),rd('en-ar.syn')
ents=[];i=0
while i<len(idx):
    j=idx.index(b'\0',i);off,sz=struct.unpack('>II',idx[j+1:j+9]);ents.append((idx[i:j].decode(),off,sz));i=j+9
DIA=re.compile('[\u064B-\u0652\u0670\u0640]');ARB=re.compile('[\u0600-\u06FF]')
def parse(h):
    pos='';groups=[];cur=None
    for m in re.finditer(r'<i>([^<]*)</i>|<b>([^<]*)</b>',h):
        if m.group(1) is not None: pos=html.unescape(m.group(1)).strip();cur=None;continue
        if cur is None: cur={'p':pos,'g':[],'k':set()};groups.append(cur)
        for part in re.split(r'\s*[,،]\s*',html.unescape(m.group(2))):
            part=part.strip();k=DIA.sub('',part)
            if part and ARB.search(part) and k not in cur['k']: cur['k'].add(k);cur['g'].append(part)
    return [[g['p'],'، '.join(g['g'][:8])] for g in groups[:4] if g['g']]
heads={}
for w,o,s in ents:
    if re.fullmatch('[a-z]+',w):
        r=parse(dz[o:o+s].decode())
        if r: heads[w]=r
inf={};i=0
while i<len(syn):
    j=syn.index(b'\0',i);f=syn[i:j].decode();k,=struct.unpack('>I',syn[j+1:j+5]);h=ents[k][0];i=j+5
    if re.fullmatch('[a-z]+',f) and f!=h and f not in heads and h in heads: inf[f]=h
def dump(d,suffix):
    sh={}
    for k,v in d.items(): sh.setdefault(k[0],{})[k]=v
    for l,x in sh.items(): open(os.path.join(OUT,l+suffix+'.json'),'w',encoding='utf-8').write(json.dumps(x,ensure_ascii=False,separators=(',',':')))
# ---- مصدر ثانٍ: عكس قاموس ar-en للكلمات التي ليس لها ترجمة مباشرة (تُوسَم بـ ≈ أي «مستنتَجة») ----
RZ=os.path.join(R,'data','ar-en.zip')
if os.path.exists(RZ):
    zr=zipfile.ZipFile(RZ);rr=lambda n:zr.read('ar-en/'+n);ridx,rdz=rr('ar-en.idx'),gzip.decompress(rr('ar-en.dict.dz'))
    BAD=re.compile(r'<i style="[^"]*">\([^)]*(vulgar|offensive|derogatory|pejorative|obscene|slur|taboo|insult)[^)]*\)</i>',re.I)
    inv={};i=0;skipped=0
    while i<len(ridx):
        j=ridx.index(b'\0',i);off,sz=struct.unpack('>II',ridx[j+1:j+9]);ar=ridx[i:j].decode();h=rdz[off:off+sz].decode();i=j+9
        if not ARB.search(ar): continue
        if BAD.search(h): skipped+=1;continue   # أي كلمة فيها معنى موسوم بذيء/مسيء تُستبعد كلها
        sn=0
        for blk in h.split('<br/>'):
            m=re.search(r'<span style="color:#666666">\d+\.</span>\s*(.*)',blk)
            if not m: continue
            sn+=1
            t=html.unescape(re.sub(r'<[^>]+>',' ',re.sub(r'<span[^>]*>&mdash;.*','',m.group(1))));t=re.sub(r'\([^)]*\)','',t)
            for gp,g in enumerate(re.split(r'[,;]',t)):
                g=re.sub(r'^(to|a|an|the)\s+','',g.strip().lower())
                if re.fullmatch('[a-z]{2,}',g): inv.setdefault(g,[]).append((sn,gp,ar))
    added=0
    for g,c in inv.items():
        if g in heads or g in inf: continue
        ars=[]
        for _,_,ar in sorted(c):
            if ar not in ars: ars.append(ar)
        heads[g]=[['≈','، '.join(ars[:3])]];added+=1
    open(os.path.join(OUT,'ATTRIBUTION-ar-en.txt'),'wb').write(rr('ATTRIBUTION'))
    print('reverse-derived words added:',added,'| Arabic entries skipped (tagged vulgar/offensive):',skipped)
dump(heads,'');dump(inf,'_i')
for n in ('LICENSE','ATTRIBUTION'): open(os.path.join(OUT,n+'.txt'),'wb').write(rd(n))
print('arabic headwords:',len(heads),'| inflected forms:',len(inf))
