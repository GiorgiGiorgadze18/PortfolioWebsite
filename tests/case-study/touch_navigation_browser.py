from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import os,json,re
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start();rows=[]
registry=json.loads(Path('case-studies/config.json').read_text())['projects']
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  browser=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for slug in os.environ.get('CASE_SLUGS','jbl-artwork,tomford').split(','):
   context=browser.new_context(viewport=dict(width=390,height=844),has_touch=True,is_mobile=True);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));chapters=json.loads(Path(f'case-studies/projects/{slug}/chapters.json').read_text());page.goto(f'http://127.0.0.1:{server.server_port}/case-studies/{registry[slug]["preview"]}?embedded=1');expect(page.locator('html')).to_have_class(re.compile('motion-ready'),timeout=60000);page.locator('#next').tap();expect(page.locator('#chapter-title')).to_have_text(chapters[1]['title']);page.locator('#previous').tap();expect(page.locator('#chapter-title')).to_have_text(chapters[0]['title']);page.locator('#chapters button').nth(4).tap();expect(page.locator('#chapter-title')).to_have_text(chapters[4]['title']);assert not errors,errors;rows.append(dict(browser=name,project=slug,status='PASS',scope='mobile touch emulation, Next/Previous and direct-dot tap',errors=errors));context.close()
  browser.close()
server.shutdown();Path('docs/case-study/evidence/navigation/'+os.environ.get('CASE_TOUCH_REPORT','touch-tests.json')).write_text(json.dumps(rows,indent=2)+'\n');print(rows)
