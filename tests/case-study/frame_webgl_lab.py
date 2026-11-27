from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,subprocess
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[];old=subprocess.check_output(['git','show','0a6c888:case-studies/shared/webgl-layers.mjs'],text=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport=dict(width=320,height=400));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);page.route('**/frame-harness.html',lambda r:r.fulfill(body='<!doctype html><link rel="icon" href="data:,"><body></body>',content_type='text/html'));page.goto(f'http://127.0.0.1:{s.server_port}/frame-harness.html');page.route('**/webgl-layers.mjs?baseline=1',lambda r:r.fulfill(body=old,content_type='text/javascript'));page.add_script_tag(url=f'http://127.0.0.1:{s.server_port}/showroom/vendor/three.js')
 for slug in ['jbl-artwork','tomford','earthhour']:
  for phase in ['before','after']:
   result=page.evaluate('''async({slug,phase})=>{const T=window.SHOWROOM_THREE;const {loadWebGLLayers}=await import('/case-studies/shared/webgl-layers.mjs?'+(phase==='before'?'baseline=1':'current=1'));const renderer=new T.WebGLRenderer({antialias:false});renderer.setSize(320,400);renderer.setPixelRatio(1);const scene=new T.Scene(),group=new T.Group();scene.add(group);const camera=new T.PerspectiveCamera(42,.8,.1,100);camera.position.set(0,.3,9.5);camera.lookAt(0,0,3.2);camera.updateMatrixWorld();const device={group,screen:{visible:true},screenDimensions:{w:1.3,h:1.8},bodyDimensions:{w:1.3,h:1.8},project:{camera:{focusZ:3.2}}};const stage=await loadWebGLLayers({THREE:T,device,camera,layer:0,baseURL:new URL('/case-studies/projects/'+slug+'/',location.href)});const rect={x:0,y:0,width:320,height:400};const gl=renderer.getContext();stage.draw(.5,rect);renderer.render(scene,camera);gl.finish();const samples=[];for(let i=0;i<24;i++){const start=performance.now();stage.draw(.5+Math.sin(i)*.01,rect);renderer.render(scene,camera);gl.finish();samples.push(performance.now()-start)}samples.sort((a,b)=>a-b);const active={...renderer.info.memory},calls=renderer.info.render.calls;stage.dispose();renderer.render(scene,camera);gl.finish();const after={...renderer.info.memory};renderer.dispose();renderer.forceContextLoss();return {medianMs:samples[12],p95Ms:samples[22],active,after,calls,samples:24}}''',dict(slug=slug,phase=phase))
   assert result['after']=={'geometries':0,'textures':0},result;rows.append(dict(project=slug,phase=phase,status='PASS',**result))
 assert not errors,errors;b.close()
s.shutdown();Path('docs/case-study/evidence/holographic/webgl-lab.json').write_text(json.dumps({'conditions':'Chromium headless SwiftShader, 320x400, DPR1, AA off,24 render+gl.finish samples; isolated plane harness, not full showroom or hardware FPS','errors':errors,'results':rows},indent=2)+'\n');print(rows)
