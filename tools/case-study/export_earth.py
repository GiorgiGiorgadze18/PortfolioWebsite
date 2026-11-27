"""Conventional original-pixel separation; reconstructed hidden flat shapes are explicit."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
from scipy.ndimage import binary_fill_holes,distance_transform_edt
import numpy as np,json,hashlib
out=Path('case-studies/projects/earthhour');ev=Path('docs/case-study/evidence/earth')
for d in ['masters','web','masks']:(out/'assets'/d).mkdir(parents=True,exist_ok=True)
im=Image.open('assets/project-earthhour.png').convert('RGB');a=np.array(im);H,W=a.shape[:2];sx=W/420;sy=H/594
Y,X=np.mgrid[:H,:W];x=X/sx;y=Y/sy;bg=np.array([173,148,217]);purple=np.array([162,111,186]);green=np.array([123,186,91]);pink=np.array([233,165,208])
# Filled design colors identify the original character; surrounding band includes its ink edge.
seed=(np.max(abs(a.astype(int)-purple),axis=2)<5)&(y>99)&(y<390)
seed|=(np.max(abs(a.astype(int)-green),axis=2)<5)&(y>120)&(y<313)
seed|=(np.max(abs(a.astype(int)-pink),axis=2)<5)&(y>300)&(y<390)&(x>65)&(x<360)
seed=binary_fill_holes(seed);band=distance_transform_edt(~seed)<11
# Original panel gradient sampled from unobstructed left/right interior pixels.
rowcolors=[]
for j in range(H):
 vals=a[j];good=(vals[:,0]>85)&(vals[:,0]<165)&(vals[:,1]>145)&(vals[:,1]<195)&(vals[:,2]>75)&(vals[:,2]<180)
 rowcolors.append(np.median(vals[good],axis=0) if good.sum()>20 else [145,162,153])
rowcolors=np.array(rowcolors)
ys=np.arange(H)/sy;valid=(ys>=315)&(ys<=465)
fit=np.stack([np.polyval(np.polyfit(ys[valid],rowcolors[valid,c],1),ys) for c in range(3)],axis=1).clip(0,255)
panelbg=np.broadcast_to(fit[:,None,:],a.shape).copy().astype('uint8')
dome=((x-214)/185)**2+((y-434)/185)**2<=1;dome|=(y>=434)&(x>=29)&(x<=398);dome&=y<=570
under=np.broadcast_to(bg,a.shape).copy();under[dome]=panelbg[dome]
# Retain all original fill pixels and only genuinely non-background ink in the outer band.
diff=np.max(abs(a.astype(int)-under.astype(int)),axis=2)
char=(seed|band)&(diff>22)
# The open arm loop is background, not an opaque purple cutout.
char&=np.max(abs(a.astype(int)-bg),axis=2)>8
# Shadow is a separate ellipse; its obscured edge is reconstructed, not recovered history.
shadow_shape=((x-242.5)/107.5)**2+((y-380.5)/15.5)**2<=1
# Panel spans the lower dome and preserves every visible original glyph/flower.
panelregion=dome|((y>=280)&(x>24)&(x<406))
# Reconstruct the upper dome cleanly; keep all lower typography and flower source pixels.
panel=panelbg.copy();panelalpha=dome.copy()
edge=dome&(distance_transform_edt(dome)<2*sx);panel[edge]=0
# Keep observed gradient samples and ink outside the removed character/shadow.
visible=dome&~char&~shadow_shape&(y<397)&(np.max(abs(a.astype(int)-bg),axis=2)>8)&(a[:,:,1]>140)&(a[:,:,0]<165)
panel[visible]=a[visible]
low=(y>=397)&(x>24)&(x<409)&(np.max(abs(a.astype(int)-bg),axis=2)>8)
panel[low]=a[low];panelalpha[low]=True
for region in [((x>24)&(x<65)&(y>350)&(y<393)),((x>378)&(x<409)&(y>397)&(y<439))]:
 keep=region&(np.max(abs(a.astype(int)-bg),axis=2)>8);panel[keep]=a[keep];panelalpha[keep]=True
background=a.copy();background[char|panelregion|shadow_shape]=bg
# Character retains original pixels. Hole backgrounds have true transparency.
character=np.zeros((H,W,4),dtype='uint8');character[:,:,:3]=a;character[:,:,3]=char*255
shadow=np.zeros_like(character);shadow[:,:,:3]=[50,48,46];shadow[:,:,3]=shadow_shape*255
panelrgba=np.zeros_like(character);panelrgba[:,:,:3]=panel;panelrgba[:,:,3]=panelalpha*255
layers=[('background',Image.fromarray(background).convert('RGBA'),'Original sky, lettering and clouds','original'),('panel',Image.fromarray(panelrgba),'Green text panel','reconstructed'),('shadow',Image.fromarray(shadow),'Character shadow','reconstructed'),('character',Image.fromarray(character),'Earth character','original')]
comp=Image.new('RGBA',im.size);records=[]
for i,(id,img,label,status) in enumerate(layers):
 img.save(out/f'assets/masters/{id}.png');web=img.copy();web.thumbnail((1400,2000));web.save(out/f'assets/web/{id}.webp',lossless=True);comp=Image.alpha_composite(comp,img)
 records.append(dict(id=id,label=label,src=f'assets/web/{id}.webp',bbox=img.getchannel('A').getbbox(),canvas=[W,H],order=i,alpha=img.getchannel('A').getextrema(),representation='plane',reconstructionStatus=status))
im.save(out/'assets/masters/original.png');im.save(out/'assets/web/original.webp',lossless=True)
Image.fromarray((char*255).astype('uint8')).save(out/'assets/masks/character.png')
d=np.abs(np.asarray(comp.convert('RGB')).astype(int)-a.astype(int));processing=panelregion|shadow_shape|band;Image.fromarray((processing*255).astype('uint8')).save(out/'assets/masks/processing.png')
metrics={'untouchedMeanAbsoluteDifference255':float(d[~processing].mean()),'untouchedPixels':int((~processing).sum()),'status':'PASS' if d[~processing].max()==0 else 'FAIL','reconstruction':'Upper panel dome/gradient and occluded oval shadow; original image is used at both endpoints','meanAbsoluteDifference255':float(d.mean()),'maxAbsoluteDifference255':int(d.max()),'sourceSHA256':hashlib.sha256(Path('assets/project-earthhour.png').read_bytes()).hexdigest()}
(out/'manifest.json').write_text(json.dumps(dict(slug='earthhour',published=False,validated=metrics['status']=='PASS',canvas=[W,H],original='assets/web/original.webp',accent='#AD94D9',layers=records,validation=metrics),indent=2)+'\n')
comp.thumbnail((420,594));comp.save(ev/'recomposition.png');sheet=Image.new('RGB',(1260,594),'#29303b')
for i,(_,img,_,_) in enumerate(layers[1:]):
 img=img.copy();img.thumbnail((420,594));sheet.paste(img,(i*420,0),img)
sheet.save(ev/'layers.png');print(metrics)
