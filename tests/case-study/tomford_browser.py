from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();out=Path('docs/case-study/evidence/tomford');rows=[]
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for w,h in [(1440,900),(390,844)]:
   page=b.new_page(viewport=dict(width=w,height=h));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/tomford-preview.html');expect(page.locator('html')).to_have_class('motion-ready',timeout=60000)
   page.locator('#chapters button').nth(2).click(force=True);page.wait_for_timeout(1800);expect(page.locator('#chapter-title')).to_have_text('The bottle leads');depths=page.locator('.plane').evaluate_all('els=>els.map(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m43)');assert depths[3]>depths[1]+20,depths
   page.locator('#chapters button').nth(3).click(force=True);page.wait_for_timeout(1800);page.screenshot(path=str(out/f'{name}-{w}.png'));assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.locator('#chapters button').last.click(force=True);page.wait_for_timeout(1800);expect(page.locator('#chapter-title')).to_have_text('Back to the original');page.emulate_media(reduced_motion='reduce');expect(page.locator('#static')).to_be_visible();assert not errors,errors;rows.append(dict(browser=name,viewport=[w,h],status='PASS',errors=errors,bottleFirstDepths=depths));page.close()
  b.close()
s.shutdown();(out/'browser-tests.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
