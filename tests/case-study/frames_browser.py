from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json,re
from playwright.sync_api import sync_playwright,expect
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[]
registry=json.loads(Path('case-studies/config.json').read_text())['projects']
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for slug in registry:
   page=b.new_page(viewport=dict(width=390,height=844));page.goto(f'http://127.0.0.1:{s.server_port}/case-studies/{registry[slug]["preview"]}?embedded=1');expect(page.locator('html')).to_have_class(re.compile('motion-ready'),timeout=60000);page.locator('#chapters button').nth(3).click();page.wait_for_timeout(600);rail=page.locator('#chapters').bounding_box();board=page.locator('.board').bounding_box();assert rail['x']+rail['width']<board['x'],(rail,board)
   styles=page.locator('.plane').evaluate_all("els=>els.map(e=>({canvas:e.querySelector('canvas').width,hidden:e.querySelector('canvas').getAttribute('aria-hidden'),color:e.style.getPropertyValue('--frame-color')}))");assert all(v['canvas']>0 and v['hidden']=='true' for v in styles),styles;rows.append(dict(browser=name,project=slug,status='PASS',planes=len(styles),railRight=rail['x']+rail['width'],boardLeft=board['x']));page.close()
  b.close()
s.shutdown();Path('docs/case-study/evidence/navigation/holographic-specific.json').write_text(json.dumps(rows,indent=2)+'\n');print(rows)
