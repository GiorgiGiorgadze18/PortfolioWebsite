from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json,re,os
from PIL import Image
import numpy as np
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/';out=Path('docs/case-study/evidence/reference')
slug=os.environ.get('CASE_SLUG','jbl-artwork');registry=json.loads(Path('case-studies/config.json').read_text());project=registry['projects'][slug];title=project['title'];short=project['shortTitle'];planeCount=len(json.loads(Path('case-studies/projects',slug,'manifest.json').read_text())['layers'])
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport=dict(width=int(os.environ.get('CASE_WIDTH','1280')),height=int(os.environ.get('CASE_HEIGHT','720'))));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'projects.html?view=3d&caseStudyPreview=1');page.locator('#museum-frame').scroll_into_view_if_needed();page.locator('[data-shelf-side=graphics]').click();expect(page.locator('.device-label[data-id="'+slug+'"]')).to_be_visible(timeout=90000);page.locator('.device-label[data-id="'+slug+'"]').click(force=True,timeout=90000);expect(page.locator('#inspector-title')).to_have_text(title,timeout=90000)
 trigger=page.get_by_role('button',name='Explore case study · Preview');expect(trigger).to_be_visible(timeout=90000)
 page.wait_for_timeout(1200)
 page.evaluate("async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');window.caseTestBridge=m.showroomBridge}")
 snapshot="async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');return m.showroomBridge.inspect()}"
 resources=page.evaluate("async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');return m.showroomBridge.resources()}")
 cycles=int(os.environ.get('CASE_CYCLES','3'))
 for i in range(cycles):
  before=page.evaluate(snapshot);y=page.evaluate('scrollY');trigger.click(force=True);f=page.frame_locator('iframe[title="'+short+' composition study"]');expect(f.locator('html')).to_have_class(re.compile(r'\bmotion-ready\b'),timeout=30000);f.locator('#next').click(force=True);f.locator('#next').click(force=True);page.wait_for_function("()=>window.caseTestBridge.layers?.inspect().progress>.39",timeout=90000)
  layerState=page.evaluate("async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');return m.showroomBridge.layers.inspect()}");assert layerState['planes']==planeCount and layerState['supportsHidden'] and max(layerState['depths'])>.7,layerState
  if i==0:
   page.screenshot(path=str(out/os.environ.get('CASE_SCREENSHOT','actual-webgl-desktop.png')))
   rgb=np.asarray(Image.open(out/os.environ.get('CASE_SCREENSHOT','actual-webgl-desktop.png')).convert('RGB'))[80:500,:int(page.viewport_size['width']*.6),:].astype(float)
   mask=((rgb[:,:,2]>80)&(rgb[:,:,1]>rgb[:,:,0]*1.2)&(rgb[:,:,2]>rgb[:,:,0]*1.4)) if slug=='jbl-artwork' else ((rgb[:,:,0]>70)&(rgb[:,:,0]>rgb[:,:,1]*1.05)&(rgb[:,:,0]>rgb[:,:,2]*1.2));mask=((rgb[:,:,2]>80)&(rgb[:,:,2]>rgb[:,:,1]*1.1)) if slug=='earthhour' else mask;artPixels=int(mask.sum());assert artPixels>1500,artPixels
  f.locator('#exit').click();
  try: expect(trigger).to_be_focused(timeout=30000)
  except Exception:
   print('EXIT DEBUG',page.evaluate('({active:{tag:document.activeElement.tagName,id:document.activeElement.id,className:document.activeElement.className},root:document.documentElement.dataset,inspectorInert:document.querySelector("#project-inspector").inert,bridge:window.caseTestBridge.inspect(),errors:[]})'),errors);raise
  after=page.evaluate(snapshot);assert after['pose']==before['pose'],(before,after);assert abs(page.evaluate('scrollY')-y)<2;expect(page.locator('#inspector-title')).to_have_text(title)
 afterResources=page.evaluate("async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');return m.showroomBridge.resources()}");assert afterResources==resources,(resources,afterResources)
 assert not errors,errors
 ctx=b.new_context(java_script_enabled=False);s=ctx.new_page();s.goto(base+'case-studies/'+project['preview']);assert s.locator('#static section').count()==6;expect(s.locator('#static')).to_be_visible()
 (out/os.environ.get('CASE_REPORT','entry-tests.json')).write_text(json.dumps(dict(status='PASS',cycles=cycles,scope='Chromium software GL actual graphic selection, iframe open/exit, exact real camera/board pose, focus and scroll restoration; no-JS static chapters',errors=errors,layerState=layerState,beforeResources=resources,afterResources=afterResources),indent=2)+'\n');b.close()
server.shutdown();print('PASS entry, actual WebGL layers, restore/disposal and no-JS')
