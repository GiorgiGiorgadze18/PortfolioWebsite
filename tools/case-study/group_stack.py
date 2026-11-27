from pathlib import Path
from PIL import Image
import json
specs={'jbl-artwork':[('environment',['environment','contact']),('stand',['glass']),('headphones',['rear','hero']),('identity',['identity'])],'tomford':[('sand',['sand']),('leaf',['leaf']),('smoke',['smoke-back','smoke-front']),('bottle',['bottle'])],'earthhour':[('background',['background']),('panel',['panel']),('shadow',['shadow']),('character',['character'])]}
labels={'jbl-artwork':['The finished artwork','The Audio panel rises first','The headphones follow','Clouds and identity','The complete composition','One composition again'],'tomford':['Warmth, texture and character','The leaf rises first','The smoke follows','The bottle comes last','A warm material palette','Back to the original'],'earthhour':['A playful vector world','The panel rises first','The shadow follows','The character comes last','Colour with a playful purpose','Back to the original']}
for slug,groups in specs.items():
 base=Path('case-studies/projects')/slug;mp=base/'manifest.json';m=json.loads(mp.read_text());old={l['id']:l for l in json.loads((base/'stack-source-manifest.json').read_text())['layers']};layers=[]
 for i,(name,ids) in enumerate(groups):
  if len(ids)==1:record={**old[ids[0]],'id':name}
  else:
   imgs=[Image.open(base/old[id]['src']).convert('RGBA') for id in ids];im=Image.new('RGBA',imgs[0].size)
   for image in imgs:im=Image.alpha_composite(im,image)
   path=f'assets/web/stack-{name}.webp';im.save(base/path,lossless=True);bbox=im.getchannel('A').getbbox();sx=m['canvas'][0]/im.width;sy=m['canvas'][1]/im.height;record={'id':name,'src':path,'canvas':m['canvas'],'bbox':[round(bbox[0]*sx),round(bbox[1]*sy),round(bbox[2]*sx),round(bbox[3]*sy)],'sourceLayers':ids,'representation':'plane'}
  record['order']=i;layers.append(record)
 m['layers']=layers;mp.write_text(json.dumps(m,indent=2)+'\n')
 cp=base/'presentation.json';c=json.loads(cp.read_text());c['stackOrder']=[0,1,2,3];c['offsets']=[[0,0,0],[0,0,75],[0,0,150],[0,0,225]];c['layerWindows']=[None,[.24,.34],[.39,.49],[.54,.64]];c['annotationLayers']=[{'from':0,'layer':layers[0]['id']},{'from':.27,'layer':layers[1]['id']},{'from':.42,'layer':layers[2]['id']},{'from':.57,'layer':layers[3]['id']}]
 for k in c['keyframes']:
  if 0<k['p']<1:k['state']['lower']=90
 cp.write_text(json.dumps(c,indent=2)+'\n')
 pp=base/'chapters.json';chap=json.loads(pp.read_text());progress=[0,.35,.5,.65,.78,1]
 for i,row in enumerate(chap):
  row['title']=labels[slug][i];row['progress']=progress[i]
  if i in [1,2,3]:row['copy']={'jbl-artwork':['The panel marked Audio rises first. Its shadow and reflection stay on the base.','Both headphone parts rise together above the Audio panel. Earlier sheets recede into shadow.','Clouds and the JBL lettering rise last, completing the vertical hierarchy.'],'tomford':['The tobacco leaf rises first above the sand.','The smoke rises into a separate sheet above the leaf.','The bottle rises last and stays brightest while earlier sheets darken.'],'earthhour':['The green message panel rises first.','The oval shadow lifts above the message panel.','The Earth character rises last, above the panel and its shadow.']}[slug][i-1];row['source']='implementation'
 pp.write_text(json.dumps(chap,indent=2)+'\n')
