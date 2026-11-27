from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
import json
s=ThreadingHTTPServer(('127.0.0.1',0),SimpleHTTPRequestHandler);Thread(target=s.serve_forever,daemon=True).start();rows=[]
with sync_playwright() as p:
 for engine,path in [(p.chromium,'/usr/bin/chromium'),(p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if engine==p.chromium else [])
  for w,h in [(1440,900),(768,1024),(390,844),(320,740)]:
   page=b.new_page(viewport={'width':w,'height':h});errors=[];page.on('pageerror',lambda e:errors.append(str(e)+str(e.stack)));page.goto(f'http://127.0.0.1:{s.server_port}/projects.html?view=grid')
   for slug,short in [('jbl-artwork','JBL'),('tomford','Tom Ford'),('earthhour','Earth Hour')]:
    control=page.locator('[data-explore="'+slug+'"]');control.click();expect(page.locator('.case-study-dialog')).to_be_visible();f=page.frame_locator('iframe[title="'+short+' composition study"]');expect(f.locator('#next')).to_be_visible(timeout=30000);sizes=f.locator('#previous,#next,#replay,#quit,#chapters button').evaluate_all('els=>els.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))');assert all(r['height']>=44 and r['width']>=44 for r in sizes),sizes;assert f.locator('html').evaluate('e=>e.scrollWidth<=innerWidth');f.locator('#next').click();f.locator('#next').click();f.locator('#previous').click();f.locator('#replay').click();f.locator('#next').click();f.locator('#quit').click();expect(page.locator('.case-study-dialog')).not_to_be_visible();expect(control).to_be_focused();rows.append({'browser':engine.name,'width':w,'project':slug,'status':'PASS'});print(engine.name,w,slug,'PASS',flush=True)
   assert not errors,errors;page.close()
  b.close()
Path('docs/case-study/evidence/about-grid.json').write_text(json.dumps(rows,indent=2)+'\n');s.shutdown();print('PASS',len(rows),'grid About cases')
