from pathlib import Path
from PIL import Image
import numpy as np,json,sys
src=Path(sys.argv[1]);f=sorted(src.glob('*.png'))
stack=[(5,'normal'),*[(i,'normal') for i in range(31,18,-1)],(18,'normal'),(17,'normal'),(0,'screen'),(14,'normal'),(13,'normal'),(12,'screen'),(11,'overlay'),(10,'normal'),(9,'normal'),(8,'normal'),(7,'normal'),(6,'normal'),(4,'normal'),(3,'normal'),(2,'normal'),(1,'dodge')]
a=np.zeros((3508,2480,4),np.float32)
for i,mode in stack:
 b=np.asarray(Image.open(f[i]).convert('RGBA'),dtype=np.float32)/255;ab=b[:,:,3:];aa=a[:,:,3:];cb=b[:,:,:3];ca=a[:,:,:3]
 blend=cb if mode=='normal' else 1-(1-ca)*(1-cb) if mode=='screen' else np.where(ca<=.5,2*ca*cb,1-2*(1-ca)*(1-cb)) if mode=='overlay' else np.minimum(1,ca/np.maximum(1-cb,1e-6))
 alpha=ab+aa*(1-ab);rgb=((1-ab)*aa*ca+(1-aa)*ab*cb+aa*ab*blend)/np.maximum(alpha,1e-6);a=np.concatenate([rgb,alpha],axis=2)
 print(i,flush=True)
im=Image.fromarray(np.clip(np.rint(a*255),0,255).astype('uint8'));im.save('docs/case-study/evidence/jbl/corrected-recomposition.png')
b=np.asarray(Image.open('assets/project-jbl.png').convert('RGBA'),dtype=np.float32)
d=np.abs(a*255-b);print('metrics',d.mean(),d.max())
