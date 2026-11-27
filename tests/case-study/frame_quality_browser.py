from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,re
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[]
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for slug,file in [('jbl-artwork','jbl'),('tomford','tomford'),('earthhour','earthhour')]:
   page=b.new_page(viewport=dict(width=390,height=844));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/{file}-preview.html?embedded=1');expect(page.locator('html')).to_have_class(re.compile('motion-ready'),timeout=60000)
   result=page.evaluate('''async(slug)=>{const {resolveFrame,frameContrast,createDOMSheet}=await import('./shared/frame-style.mjs');const m=await fetch('./projects/'+slug+'/manifest.json').then(r=>r.json());const imgs=await Promise.all([m.layers[0],m.layers.at(-1)].map(async(l)=>{const im=new Image;im.src='./projects/'+slug+'/'+l.src;await im.decode();return im}));const auto=resolveFrame({...m,frame:undefined},imgs);const style=resolveFrame(m);const sums=[];for(const opaque of [false,true]){const src=document.createElement('canvas');src.width=src.height=100;if(opaque){src.getContext('2d').fillStyle='white';src.getContext('2d').fillRect(0,0,100,100)}const plane=document.createElement('div');document.body.append(plane);createDOMSheet(plane,src,style).resize(100,100);const cv=plane.querySelector('canvas'),scale=cv.width/100,data=cv.getContext('2d').getImageData(20*scale,20*scale,60*scale,60*scale).data;let sum=0;for(let i=3;i<data.length;i+=4)sum+=data[i];sums.push(sum);plane.remove()}return {color:style.color,auto: auto.color,autoContrast:frameContrast(auto.color),opaqueGridRatio:sums[1]/sums[0]}}''',slug)
   assert .25<result['opaqueGridRatio']<.35,result;assert result['autoContrast']>=3,result
   page.set_viewport_size(dict(width=430,height=900));page.wait_for_timeout(300);assert page.locator('.holo-sheet').first.evaluate('c=>c.width>0&&c.getAttribute("aria-hidden")==="true"');page.emulate_media(reduced_motion='reduce');expect(page.locator('#static')).to_be_visible();assert not errors,errors;rows.append(dict(browser=name,project=slug,status='PASS',errors=errors,**result));page.close()
  b.close()
s.shutdown();Path('docs/case-study/evidence/holographic/quality.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
