from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=s.serve_forever,daemon=True).start();rows=[];out=Path('docs/case-study/evidence/reference')
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else []);page=b.new_page(viewport={'width':1440,'height':900});page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/jbl-preview.html');expect(page.locator('html')).to_have_class('motion-ready',timeout=30000)
  ports=[]
  for index in [2,3,4]:
   page.locator('#chapters button').nth(index).click(force=True);page.wait_for_timeout(1800)
   ports.append(page.locator('.leader path').first.get_attribute('d').split('L')[-1])
  assert len(set(ports))==1,ports
  page.emulate_media(reduced_motion='reduce');assert page.evaluate('document.getAnimations().filter(a=>a.playState==="running").length')==0
  rows.append({'browser':name,'status':'PASS','scope':'Stable description-side line port across differently wrapping chapters; reduced-motion cancels text animation','ports':ports});b.close()
s.shutdown();(out/'annotation-tests.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
