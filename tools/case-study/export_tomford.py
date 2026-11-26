from pathlib import Path
from psd_tools import PSDImage
from PIL import Image,ImageDraw
import numpy as np,json,hashlib,shutil,argparse
from skimage.metrics import structural_similarity
parser=argparse.ArgumentParser(description='Export original Tom Ford PSD planes, including effects and opacity.');parser.add_argument('source_directory',type=Path);src=parser.parse_args().source_directory;out=Path('case-studies/projects/tomford');ev=Path('docs/case-study/evidence/tomford');ev.mkdir(parents=True,exist_ok=True)
for d in ['assets/masters','assets/web']:(out/d).mkdir(parents=True,exist_ok=True)
p=PSDImage.open(src/'Poster5_Exact_Assembled.psd');original=p.topil().convert('RGBA');original.save(out/'assets/masters/original.png');original.save(out/'assets/web/original.webp',lossless=True)
comp=Image.new('RGBA',p.size);records=[]
for i,(layer,id,label) in enumerate(zip(p,['sand','leaf','smoke-back','bottle','smoke-front'],['Sand environment','Tobacco leaf','Atmosphere behind the bottle','Tobacco Vanille bottle','Foreground aroma'])):
 im=layer.composite(viewport=(0,0,*p.size),force=True,alpha=0.0).convert('RGBA');im.save(out/f'assets/masters/{id}.png');web=im.copy();web.thumbnail((1200,1800));web.save(out/f'assets/web/{id}.webp',lossless=True);comp=Image.alpha_composite(comp,im)
 records.append(dict(id=id,label=label,src=f'assets/web/{id}.webp',bbox=im.getchannel('A').getbbox(),alpha=im.getchannel('A').getextrema(),canvas=list(p.size),order=i,sourceLayer=layer.name,opacity=layer.opacity,reconstructionStatus='original',representation='plane'))
a=np.asarray(comp.convert('RGB'));b=np.asarray(original.convert('RGB'));d=np.abs(a.astype(float)-b.astype(float));ssim=structural_similarity(a,b,channel_axis=2,data_range=255);metrics={'meanAbsoluteDifference255':float(d.mean()),'maxAbsoluteDifference255':float(d.max()),'SSIM':float(ssim),'status':'PASS' if d.mean()<=1 and ssim>=.995 else 'FAIL','target':'Owner PSD saved composite, not legacy website thumbnail'}
manifest=dict(slug='tomford',published=False,validated=metrics['status']=='PASS',canvas=list(p.size),original='assets/web/original.webp',accent='#a88046',layers=records,validation=metrics);(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
shutil.copy(src/'notes-TomFord.md',ev/'notes-TomFord.md');(ev/'validation.json').write_text(json.dumps({'metrics':metrics,'sources':[dict(name=f.name,bytes=f.stat().st_size,sha256=hashlib.sha256(f.read_bytes()).hexdigest()) for f in src.iterdir()]},indent=2)+'\n');comp.thumbnail((600,1000));comp.save(ev/'recomposition.png')
sheet=Image.new('RGB',(1500,550),'#303744');draw=ImageDraw.Draw(sheet)
for i,l in enumerate(records):
 im=Image.open(out/f"assets/masters/{l['id']}.png");im.thumbnail((270,500));sheet.paste(im,(i*300,0),im);draw.text((i*300,510),l['id'],fill='white')
sheet.save(ev/'layers.png');print(metrics)
