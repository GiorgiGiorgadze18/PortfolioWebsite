from pathlib import Path
from PIL import Image
import numpy as np,json
base=Path('case-studies/projects/jbl-artwork');m=json.loads((base/'manifest.json').read_text());old={l['id']:l for l in json.loads((base/'stack-source-manifest.json').read_text())['layers']};assert [l['id'] for l in m['layers']]==['environment','stand','headphones','identity'];assert m['layers'][1]['src']==old['glass']['src'];assert m['layers'][3]['src']==old['identity']['src']
for index,ids in [(0,['environment','contact']),(2,['rear','hero'])]:
 images=[Image.open(base/old[id]['src']).convert('RGBA') for id in ids];expected=Image.new('RGBA',images[0].size)
 for im in images:expected=Image.alpha_composite(expected,im)
 actual=np.array(Image.open(base/m['layers'][index]['src']).convert('RGBA'));e=np.array(expected);visible=e[:,:,3]>0;assert np.array_equal(actual[visible],e[visible]);assert np.array_equal(actual[:,:,3],e[:,:,3])
Path('docs/case-study/evidence/stack/jbl-group-validation.json').write_text(json.dumps({'status':'PASS','firstMovingLayer':'original glass/Audio source','headphones':['rear','hero'],'stationaryBackground':['environment','contact'],'cloudSourceUnchanged':True,'visibleCompositePixels':'exact lossless match to expected source compositions'},indent=2)+'\n');print('PASS Audio source, two-part headphone composite, stationary shadow/reflection and unchanged clouds')
