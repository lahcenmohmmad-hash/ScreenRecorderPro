# يحوّل JMdict (EDRDG) إلى ملفات JSON صغيرة، ويشتق معنى عربياً لكل معنى عبر الإنجليزية
import json,zipfile,os,re,glob,xml.etree.ElementTree as ET,gzip,collections
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');OUT=os.path.join(R,'www','dict','j');os.makedirs(OUT,exist_ok=True)
# ---------- أدوات الكانا (نفس منطق التطبيق) ----------
VW={}
for v,cs in (('あ','あかさたなはまやらわがざだばぱぁゃゎ'),('い','いきしちにひみりぎじぢびぴぃゐ'),('う','うくすつぬふむゆるぐずづぶぷぅゅゔ'),('え','えけせてねへめれげぜでべぺぇゑ'),('お','おこそとのほもよろをごぞどぼぽぉょ')):
    for c in cs: VW[c]=v
def h2k(s): return ''.join(chr(ord(c)-96) if '\u30a1'<=c<='\u30f6' else c for c in s)
def normr(s):
    o=''
    for c in h2k(re.sub(r'\s+','',s)):
        o+=VW.get(o[-1:] ,'ー') if c=='ー' else c
    return o
# ---------- الاشتقاق العربي ----------
A={};I={}
for f in glob.glob(os.path.join(R,'build','ar','*.json')):
    (I if f.endswith('_i.json') else A).update(json.load(open(f,encoding='utf-8')))
key=lambda s:s.split('-',1)[1];lem={}
with gzip.open(os.path.join(R,'data','awn4.xml.gz')) as f:
    for _,el in ET.iterparse(f,events=('end',)):
        if el.tag=='LexicalEntry':
            w=el.find('Lemma').get('writtenForm')
            for sn in el.findall('Sense'):
                L=lem.setdefault(key(sn.get('synset')),[])
                if w not in L: L.append(w)
            el.clear()
        elif el.tag=='Synset': el.clear()
ow={}
with gzip.open(os.path.join(R,'data','oewn-2024.xml.gz')) as f:
    for _,el in ET.iterparse(f,events=('end',)):
        if el.tag=='LexicalEntry':
            l=el.find('Lemma').get('writtenForm')
            if re.fullmatch('[a-z]+',l): ow.setdefault(l,[]).extend(s.get('synset') for s in el.findall('Sense'))
            el.clear()
        elif el.tag=='Synset': el.clear()
PS={'n.':'n','v.':'v','adj.':'as','adv.':'r'}
def awn_first(w,pos):
    sids=[x for x in ow.get(w,[]) if (not pos) or x[-1] in PS.get(pos,'')]
    for sid in sids[:2]:
        L=lem.get(key(sid),[])
        if L: return L[:2]
    return []
def ar_of(w,pos=None):
    a=awn_first(w,pos)
    if a: return a
    g=A.get(w) or (A.get(I.get(w)) if I.get(w) else None)
    if g:
        grp=next((x for x in g if pos and x[0]==pos),g[0])
        return [x.strip() for x in grp[1].split('،')][:2]
    return []
def cl(g): return re.sub(r'^(to|a|an|the)\s+','',re.sub(r'\([^)]*\)','',g).strip().lower())
def posmap(tags):
    for t in tags:
        if t.startswith('v'): return 'v.'
        if t.startswith('adj'): return 'adj.'
        if t.startswith('adv'): return 'adv.'
        if t=='n' or t.startswith('n-') or t=='pn': return 'n.'
    return None
def pivot(gl,tags=()):
    out=[];pos=posmap(tags)
    for g in gl[:4]:
        c=cl(g)
        if re.fullmatch('[a-z]+',c):
            for a in ar_of(c,pos):
                if a not in out: out.append(a)
        if len(out)>=3: break
    return '، '.join(out[:3])
# ---------- JMdict ----------
d=json.load(zipfile.ZipFile(os.path.join(R,'data','jmdict-eng.json.zip')).open([n for n in zipfile.ZipFile(os.path.join(R,'data','jmdict-eng.json.zip')).namelist() if n.endswith('.json')][0]))
E=[];forms={};norm={};withar=0
for i,w in enumerate(d['words']):
    k=[x['text'] for x in w['kanji']];r=[x['text'] for x in w['kana']]
    ra={x['text']:x['appliesToKanji'] for x in w['kana'] if x.get('appliesToKanji') and x['appliesToKanji']!=['*']}
    c=1 if any(x['common'] for x in w['kanji']+w['kana']) else 0
    sn=[]
    for s in w['sense']:
        gl=[g['text'] for g in s['gloss'] if g['lang']=='eng']
        if not gl: continue
        a=pivot(gl,s['partOfSpeech']);sn.append([s['partOfSpeech'][:3],gl[:5],a])
        if len(sn)>=6: break
    if any(x[2] for x in sn): withar+=1
    E.append([k,r,sn,c,ra or 0])
    for f in set(k+r): forms.setdefault(f,[]).append(i)
    for f in set(normr(x) for x in r): norm.setdefault(f,[]).append(i)
def rank(ids): return sorted(ids,key=lambda j:(-E[j][3],j))[:12]
def shard(dct,prefix):
    sh={}
    for f,ids in dct.items(): sh.setdefault('%02x'%(ord(f[0])%256),{})[f]=rank(ids)
    for h,x in sh.items(): open(os.path.join(OUT,prefix+h+'.json'),'w',encoding='utf-8').write(json.dumps(x,ensure_ascii=False,separators=(',',':')))
shard(forms,'f');shard(norm,'n')
for b in range(0,len(E),400): open(os.path.join(OUT,'e%d.json'%(b//400)),'w',encoding='utf-8').write(json.dumps(E[b:b+400],ensure_ascii=False,separators=(',',':')))
com=[e for e in E if e[3]]
print('entries:',len(E),'| common:',len(com),'| with Arabic (any sense):',withar,'| common with Arabic:',sum(1 for e in com if any(x[2] for x in e[2])))
