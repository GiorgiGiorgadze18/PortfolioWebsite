"""Measure reference fidelity and source alpha; no synthesized pixels."""
from pathlib import Path
import json
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity
project=Path('case-studies/projects/jbl-artwork');manifest=json.loads((project/'manifest.json').read_text());comp=Image.new('RGBA',(2480,3508));rows=[]
for layer in manifest['layers']:
 im=Image.open(project/f"assets/masters/{layer['id']}.png").convert('RGBA');a=np.asarray(im)[:,:,3];comp=Image.alpha_composite(comp,im);rows.append(dict(id=layer['id'],minimum=int(a.min()),maximum=int(a.max()),transparentPixels=int((a==0).sum()),partialPixels=int(((a>0)&(a<255)).sum()),status='PASS' if layer['id']=='environment' or (a.min()==0 and a.max()>0) else 'FAIL'))
a=np.asarray(comp.convert('RGB'));b=np.asarray(Image.open('assets/project-jbl.png').convert('RGB'));ssim=structural_similarity(a,b,channel_axis=2,data_range=255)
result=dict(fullCanvasRGBSSIM=float(ssim),target=.995,ssimStatus='PASS' if ssim>=.995 else 'FAIL',alpha=rows,scope='All pixels; no reconstructed regions. Alpha sanity is not halo certification. Full-size original vs full-size layered composite.',haloStatus='NOT RUN')
Path('docs/case-study/evidence/jbl/quality-reference.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
