from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json,sys,re,os,subprocess
phase=sys.argv[1];out=Path('docs/case-study/evidence/holographic');out.mkdir(exist_ok=True);source=(subprocess.check_output(['git','show','0a6c888:case-studies/shared/reference.mjs'],text=True) if phase=='before' else Path('case-studies/shared/reference.mjs').read_text());source+='\nwindow.frameSeek=p=>{observer?.dispose();observer=undefined;progress=p;describe(p);engine.seek(p)};window.frameBench=()=>{const times=[];for(let i=0;i<90;i++){progress=.5+Math.sin(i)*.2;const start=performance.now();engine.seek(progress);times.push(performance.now()-start)}return times.sort((a,b)=>a-b)};'
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for slug,file in [('jbl-artwork','jbl'),('tomford','tomford'),('earthhour','earthhour')]:
  for w,h in [(1440,900),(390,844)]:
   if os.environ.get('FRAME_PROJECTS') and slug not in os.environ['FRAME_PROJECTS'].split(','):continue
   page=b.new_page(viewport=dict(width=w,height=h));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.route('**/case-studies/shared/reference.mjs',lambda r:r.fulfill(body=source,content_type='text/javascript'));
   if phase=='before':page.route('**/case-studies/shared/reference.css',lambda r:r.fulfill(body=subprocess.check_output(['git','show','0a6c888:case-studies/shared/reference.css'],text=True),content_type='text/css'))
   page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/{file}-preview.html?embedded=1');expect(page.locator('html')).to_have_class(re.compile('motion-ready'),timeout=60000)
   poses=[]
   for value in [0,.5,.75]:
    page.evaluate('(p)=>window.frameSeek(p)',value);page.wait_for_timeout(150);poses.append(page.locator('.plane').evaluate_all('els=>els.map(el=>el.style.transform)'));page.screenshot(path=str(out/f'{phase}-{slug}-{w}-{value}.png'))
   samples=page.evaluate('window.frameBench()');assert not errors,errors;rows.append(dict(project=slug,viewport=[w,h],status='PASS',errors=errors,poses=poses,medianUpdateMs=samples[len(samples)//2],p95UpdateMs=samples[int(len(samples)*.95)],samples=90));page.close()
 b.close()
s.shutdown();
if os.environ.get('FRAME_PROJECTS') and (out/f'{phase}.json').exists():
 selected=os.environ['FRAME_PROJECTS'].split(',');rows=[r for r in json.loads((out/f'{phase}.json').read_text()) if r['project'] not in selected]+rows
(out/f'{phase}.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
