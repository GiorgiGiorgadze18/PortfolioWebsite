from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,re,os,time
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[];out=Path('docs/case-study/evidence/stack');out.mkdir(exist_ok=True)
registry=json.loads(Path('case-studies/config.json').read_text())['projects']
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for slug in os.environ.get('CASE_STACK_SLUGS','jbl-artwork,tomford,earthhour').split(','):
   for w,h in [(1440,900),(390,844)]:
    page=b.new_page(viewport=dict(width=w,height=h));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/{registry[slug]["preview"]}?embedded=1');expect(page.locator('html')).to_have_class(re.compile('motion-ready'),timeout=60000)
    values=[]
    for step in [1,2,3]:
     page.locator('#next').click();started=time.monotonic();page.wait_for_function('step=>{const a=[...document.querySelectorAll(".plane")];return a.every((e,i)=>{const z=new DOMMatrixReadOnly(getComputedStyle(e).transform).m43,b=Number(e.style.getPropertyValue("--sheet-brightness"));return (i>step?Math.abs(z)<.1:true)&&(i<step?b<.22:b>.99)})}',arg=step,timeout=20000);page.evaluate('()=>new Promise(resolve=>{let last="",stable=0;function tick(){const value=[...document.querySelectorAll(".plane")].map(e=>e.style.transform+e.style.getPropertyValue("--sheet-brightness")).join();stable=value===last?stable+1:0;last=value;if(stable>=8)resolve();else requestAnimationFrame(tick)}requestAnimationFrame(tick)})');settle=time.monotonic()-started;z=page.locator('.plane').evaluate_all('els=>els.map(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m43)');bright=page.locator('.plane').evaluate_all('els=>els.map(e=>Number(e.style.getPropertyValue("--sheet-brightness")))');assert z[step]>0 and bright[step]>.99,(z,bright)
     for i in range(1,step):assert bright[i]<.22,bright
     for i in range(step+1,4):assert abs(z[i])<.1,z
     if step==3:assert max(z[i+1]-z[i] for i in range(3))-min(z[i+1]-z[i] for i in range(3))<.1,z
     values.append(dict(step=step,depths=z,brightness=bright,settleSeconds=round(settle,3)));page.screenshot(path=str(out/f'{name}-{slug}-{w}-step{step}.png'))
    page.locator('#chapters button').last.click();page.wait_for_function('()=>[...document.querySelectorAll(".plane")].every(e=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(e).transform).m43)<.1)',timeout=20000);assert all(abs(z)<.1 for z in page.locator('.plane').evaluate_all('els=>els.map(e=>new DOMMatrixReadOnly(getComputedStyle(e).transform).m43)'));page.emulate_media(reduced_motion='reduce');expect(page.locator('#static')).to_be_visible();assert not errors,errors;rows.append(dict(browser=name,project=slug,viewport=[w,h],status='PASS',steps=values,errors=errors));page.close()
  b.close()
s.shutdown();(out/'browser-tests.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
