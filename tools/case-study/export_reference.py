"""Bake PSD blend appearance into normal-alpha planes against assembled lower layers."""
from pathlib import Path
from PIL import Image,ImageDraw
import numpy as np,json,sys
src=Path(sys.argv[1]);files=sorted(src.glob('*.png'));out=Path('case-studies/projects/jbl-artwork');evidence=Path('docs/case-study/evidence/jbl')
groups=[('environment','Sky and rhythm',[(5,'normal'),*[(i,'normal') for i in range(31,18,-1)],(18,'normal'),(17,'normal')]),('contact','Grounding the composition',[(0,'screen'),(14,'normal')]),('rear','Product silhouette',[(13,'normal')]),('glass','Glass and audio interface',[(12,'screen'),(11,'overlay'),(10,'normal'),(9,'normal'),(8,'normal'),(7,'normal')]),('hero','The focal point',[(6,'normal')]),('identity','Atmosphere and identity',[(4,'normal'),(3,'normal'),(2,'normal'),(1,'dodge')])]
base=np.zeros((3508,2480,4),np.float32);records=[]
for idx,(id,label,stack) in enumerate(groups):
 group=np.zeros_like(base)
 for i,mode in stack:
  b=np.asarray(Image.open(files[i]).convert('RGBA'),dtype=np.float32)/255;alpha=b[:,:,3:];cb=b[:,:,:3];ca=base[:,:,:3]
  fg=cb if mode=='normal' else 1-(1-ca)*(1-cb) if mode=='screen' else np.where(ca<=.5,2*ca*cb,1-2*(1-ca)*(1-cb)) if mode=='overlay' else np.minimum(1,ca/np.maximum(1-cb,1e-6))
  ga=group[:,:,3:];na=alpha+ga*(1-alpha)
  group[:,:,:3]=(fg*alpha+group[:,:,:3]*ga*(1-alpha))/np.maximum(na,1e-6);group[:,:,3:]=na
  ba=base[:,:,3:];oa=alpha+ba*(1-alpha);base[:,:,:3]=(fg*alpha+ca*ba*(1-alpha))/np.maximum(oa,1e-6);base[:,:,3:]=oa
 im=Image.fromarray(np.clip(np.rint(group*255),0,255).astype('uint8'));im.save(out/f'assets/masters/{id}.png');web=im.copy();web.thumbnail((1131,1600));web.save(out/f'assets/web/{id}.webp',lossless=True)
 records.append(dict(id=id,label=label,src=f'assets/web/{id}.webp',canvas=[2480,3508],bbox=im.getchannel('A').getbbox(),alpha=im.getchannel('A').getextrema(),order=idx,representation='plane',rotationLimits=[-10,10],reconstructionStatus='original',blendAppearance='PSD blends baked against assembled lower layers',sourceFiles=[files[i].name for i,m in stack]))
comp=Image.new('RGBA',(2480,3508))
for l in records:comp=Image.alpha_composite(comp,Image.open(out/f"assets/masters/{l['id']}.png"))
d=np.abs(np.asarray(comp).astype(float)-np.asarray(Image.open('assets/project-jbl.png').convert('RGBA')).astype(float));metrics=dict(meanAbsoluteDifference255=float(d.mean()),maxAbsoluteDifference255=float(d.max()),meanTargetStatus='PASS' if d.mean()<=1 else 'FAIL',endpoint='Crossfade to untouched original at p=0 and p=1; not exact layered recomposition',haloStatus='NOT RUN')
comp.thumbnail((600,850));comp.save(evidence/'reference-recomposition.png');(evidence/'reference-validation.json').write_text(json.dumps(metrics,indent=2)+'\n')
manifest=dict(slug='jbl-artwork',published=False,validated=bool(d.mean()<=1),canvas=[2480,3508],layers=records,validation=metrics)
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(metrics)
