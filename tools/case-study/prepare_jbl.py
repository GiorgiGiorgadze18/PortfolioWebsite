"""Reproducible conventional compositing of owner PNG layers; originals unchanged."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,hashlib,json,shutil,sys
src=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/tmp/case-study-input/docs-casestudy-projects/JBL');files=sorted(src.glob('*.png'))
out=Path('case-studies/projects/jbl-artwork');(out/'assets/web').mkdir(parents=True,exist_ok=True);(out/'assets/masters').mkdir(exist_ok=True)
evidence=Path('docs/case-study/evidence/jbl');evidence.mkdir(exist_ok=True)
shutil.copy(src/'notes-JBL.md',evidence/'notes-JBL.md')
# Layers listed bottom to top. Keep glass between rear and front product components.
groups=[('environment','Sky, light and architectural rhythm',[5,*range(31,18,-1),18,17,4,3]),('contact','Contact shadows and reflection',[16,15,14,0]),('rear','Rear headphone silhouette',[13]),('glass','Glass display surface',[12]),('hero','Hero headphone',[6]),('interface','Audio interface',[11,10,9,8,7]),('identity','JBL and Premium',[2,1])]
records=[];comp=Image.new('RGBA',(2480,3508));originals=[]
for f in files:
 im=Image.open(f).convert('RGBA');a=im.getchannel('A');originals.append(dict(path=f.name,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),bytes=f.stat().st_size,canvas=list(im.size),alpha=list(a.getextrema()),bbox=a.getbbox()))
for order,(id,label,indices) in enumerate(groups):
 layer=Image.new('RGBA',(2480,3508))
 for i in indices:layer=Image.alpha_composite(layer,Image.open(files[i]).convert('RGBA'))
 comp=Image.alpha_composite(comp,layer)
 layer.save(out/f'assets/masters/{id}.png');web=layer.copy();web.thumbnail((1131,1600));web.save(out/f'assets/web/{id}.webp',lossless=True)
 a=layer.getchannel('A');records.append(dict(id=id,label=label,sourceFiles=[files[i].name for i in indices],canvas=[2480,3508],bbox=a.getbbox(),alpha=list(a.getextrema()),order=order,src=f'assets/web/{id}.webp',representation='plane',rotationLimits=[-12,12],reconstructionStatus='original',validationStatus='NOT RUN'))
orig=Image.open('assets/project-jbl.png').convert('RGBA');delta=np.abs(np.asarray(orig).astype(float)-np.asarray(comp).astype(float))
comp.save(evidence/'recomposition.png');
contact=Image.new('RGB',(1200,((len(files)+5)//6)*205),'#303040');draw=ImageDraw.Draw(contact)
for i,f in enumerate(files):
 preview=Image.open(f).convert('RGBA');preview.thumbnail((190,170));x=i%6*200;y=i//6*205;contact.paste(preview,(x,y),preview);draw.text((x,y+170),str(i)+' '+f.name[:22],fill='white')
contact.save(evidence/'source-contact.png')
metrics=dict(meanAbsoluteDifference255=float(delta.mean()),maxAbsoluteDifference255=float(delta.max()),exactPixelFraction=float(np.all(delta==0,axis=2).mean()),status='FAIL',reason='Normal-alpha composition does not yet match flattened artwork; Photoshop blend/visibility/blur metadata absent. Do not animate or publish these candidate groups before validation.')
(evidence/'validation.json').write_text(json.dumps(dict(originals=originals,recomposition=metrics),indent=2)+'\n')
(out/'manifest.json').write_text(json.dumps(dict(slug='jbl-artwork',published=False,canvas=[2480,3508],layers=records,validation=metrics),indent=2)+'\n')
print(json.dumps(metrics))
