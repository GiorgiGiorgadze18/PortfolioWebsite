from PIL import Image
import numpy as np
from pathlib import Path
import json,hashlib
src=Path('/workspace/portfolio-work/case-study-sources/Earth/new');out=Path('case-studies/projects/earthhour');W,H=832,1177
char=Image.open(src/'04-layer 3.png').convert('RGBA');gen=Image.open('docs/case-study/evidence/earth/finger-generation.png').convert('RGBA').resize(char.size,Image.Resampling.LANCZOS)
original=np.array(char).astype(float);generated=np.array(gen).astype(float);weights=np.ones((40,1,1));weights[30:]=np.linspace(1,0,10)[:,None,None]
original[:40,530:608]=generated[:40,530:608]*weights+original[:40,530:608]*(1-weights)
repair=Image.new('RGBA',(628,647));repair.paste(Image.fromarray(original.astype('uint8')),(0,32));repair.save(out/'assets/masters/character-repaired-source.png')
records=[];composite=Image.new('RGBA',(W,H))
for i,(id,file,pos) in enumerate([('background','01-background.png',(0,0)),('panel','02-layer 1.png',(56,32)),('shadow','03-layer 2.png',(267,725)),('character',None,(130,116))]):
 layer=Image.new('RGBA',(W,H));layer.alpha_composite(repair if file is None else Image.open(src/file).convert('RGBA'),pos);layer.save(out/f'assets/masters/{id}.png');layer.save(out/f'assets/web/{id}.webp',lossless=True);composite=Image.alpha_composite(composite,layer)
 records.append(dict(id=id,label=id,src=f'assets/web/{id}.webp',bbox=layer.getchannel('A').getbbox(),canvas=[W,H],order=i,representation='plane',reconstructionStatus='reconstructed' if id=='character' else 'owner-supplied'))
original=Image.open('assets/project-earthhour.png').convert('RGBA');original.save(out/'assets/masters/original.png');original.save(out/'assets/web/original.webp',lossless=True)
d=dict(slug='earthhour',published=False,validated=True,canvas=[W,H],original='assets/web/original.webp',accent='#AD94D9',layers=records,validation={'scope':'Owner-approved new ZIP; full-canvas registration is approximate, no exact-original recomposition claim. Generated fingertip only; supplied character pixels below top margin retained unchanged. Original source image remains at endpoints.'})
(out/'manifest.json').write_text(json.dumps(d,indent=2)+'\n');composite.thumbnail((416,589));composite.save('docs/case-study/evidence/earth/zip-recomposition.png');Path('docs/case-study/evidence/earth/zip-sources.json').write_text(json.dumps([{'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in src.glob('*') if p.is_file()],indent=2)+'\n')
