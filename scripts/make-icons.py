# يضع أيقونة SpellMaster بدل أيقونة Capacitor الافتراضية (بدون ImageMagick)
import os,shutil
from PIL import Image,ImageDraw
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');res=os.path.join(R,'android','app','src','main','res')
src=Image.open(os.path.join(R,'assets','icon-512.png')).convert('RGBA')
for d,s in (('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)):
    sq=src.resize((s,s),Image.LANCZOS);rd=Image.new('RGBA',(s,s),(0,0,0,0));m=Image.new('L',(s*4,s*4),0);ImageDraw.Draw(m).ellipse((0,0,s*4-1,s*4-1),fill=255)
    rd.paste(sq,(0,0),m.resize((s,s),Image.LANCZOS));dd=os.path.join(res,'mipmap-'+d);os.makedirs(dd,exist_ok=True)
    sq.save(os.path.join(dd,'ic_launcher.png'));sq.save(os.path.join(dd,'ic_launcher_foreground.png'));rd.save(os.path.join(dd,'ic_launcher_round.png'))
shutil.rmtree(os.path.join(res,'mipmap-anydpi-v26'),ignore_errors=True)
print('icons written')
