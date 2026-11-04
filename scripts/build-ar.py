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
dump(heads,'');dump(inf,'_i')
for n in ('LICENSE','ATTRIBUTION'): open(os.path.join(OUT,n+'.txt'),'wb').write(rd(n))
print('arabic headwords:',len(heads),'| inflected forms:',len(inf))
