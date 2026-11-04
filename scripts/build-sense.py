# يبني: (1) شرح كل معنى بالإنجليزية والعربية  (2) رموز IPA — كله مضمّن داخل التطبيق
import gzip,json,os,re,xml.etree.ElementTree as ET
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');DATA=os.path.join(R,'data')
OS=os.path.join(R,'www','dict','s');OP=os.path.join(R,'www','dict','p');os.makedirs(OS,exist_ok=True);os.makedirs(OP,exist_ok=True)
key=lambda s:s.split('-',1)[1]
def tr(t,n):
    t=(t or '').strip()
    return t if len(t)<=n else t[:n-1].rsplit(' ',1)[0]+'…'
# العربية (Arabic WordNet 4.1): تعريف كل synset
ar={}
with gzip.open(os.path.join(DATA,'awn4.xml.gz')) as f:
    for _,el in ET.iterparse(f,events=('end',)):
        if el.tag=='Synset':
            d=el.find('Definition');ar[key(el.get('id'))]=(d.text if d is not None else '');el.clear()
# الإنجليزية (Open English WordNet 2024)
entries={};syn={}
with gzip.open(os.path.join(DATA,'oewn-2024.xml.gz')) as f:
    for _,el in ET.iterparse(f,events=('end',)):
        if el.tag=='LexicalEntry':
            l=el.find('Lemma');w=l.get('writtenForm')
            if re.fullmatch('[a-z]+',w):
                p='a' if l.get('partOfSpeech')=='s' else l.get('partOfSpeech')
                entries.setdefault(w,{}).setdefault(p,[]).extend(s.get('synset') for s in el.findall('Sense'))
            el.clear()
        elif el.tag=='Synset':
            d=el.find('Definition');e=el.find('Example');syn[el.get('id')]=(d.text if d is not None else '',e.text if e is not None else '');el.clear()
# ترتيب الأنواع النحوية حسب شيوع الاستعمال (تردد WordNet)
fr={};D=os.path.join(R,'node_modules','wordnet-db','dict')
for pf,pc in (('noun','n'),('verb','v'),('adj','a'),('adv','r')):
    fp=os.path.join(D,'index.'+pf)
    if os.path.exists(fp):
        for l in open(fp,encoding='utf-8'):
            if l.startswith('  '): continue
            f=l.split(' ');n=int(f[3]);fr[(f[0],pc)]=int(f[5+n])
out={};n=0
for w,pp in entries.items():
    res=[]
    for p in sorted(pp,key=lambda p:-fr.get((w,p),0))[:3]:
        for sid in pp[p][:2]:
            a=ar.get(key(sid));e,x=syn.get(sid,('',''))
            if a and e: res.append([p,tr(e,140),tr(a,150),tr(x,100)])
    if res: out.setdefault(w[0],{})[w]=res[:5];n+=1
for l,d in out.items(): open(os.path.join(OS,l+'.json'),'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False,separators=(',',':')))
# IPA (ipa-dict en_US، رخصة MIT): نُحوّل ɫ إلى l لأنها الأوضح للمتعلم
ip={};m=0
for line in open(os.path.join(DATA,'ipa-en_US.txt'),encoding='utf-8'):
    if '\t' not in line: continue
    w,v=line.rstrip('\n').split('\t',1)
    if re.fullmatch('[a-z]+',w):
        vs=[x.strip().strip('/').replace('ɫ','l') for x in v.split(',')][:2]
        if vs and vs[0]: ip.setdefault(w[0],{})[w]='|'.join(vs);m+=1
for l,d in ip.items(): open(os.path.join(OP,l+'.json'),'w',encoding='utf-8').write(json.dumps(d,ensure_ascii=False,separators=(',',':')))
open(os.path.join(R,'www','dict','ATTRIBUTION-sense.txt'),'w',encoding='utf-8').write("""Open English WordNet 2024 - CC BY 4.0 - https://en-word.net/ (based on Princeton WordNet 3.0, (c) 2006 Princeton University)
Arabic WordNet 4.1 by Salah Abdo (2026) - CC BY 4.0 - https://github.com/Salah-Sal/arabic-wordnet-v4 - Arabic definitions were translated with AI assistance (Google Gemini 3 Pro Preview; Anthropic Claude).
ipa-dict (open-dict-data) en_US - MIT - https://github.com/open-dict-data/ipa-dict - based on cmudict-ipa by @lingz (MIT) and the CMU Pronouncing Dictionary.
Changes: definitions/examples truncated; up to 5 senses kept per word; the 'ɫ' symbol replaced by 'l' in IPA.
""")
print('words with senses:',n,'| words with IPA:',m)
