from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/';out=Path('docs/case-study/evidence/reference')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport=dict(width=1280,height=720));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'projects.html?view=3d&caseStudyPreview=1');page.locator('#museum-frame').scroll_into_view_if_needed();page.locator('[data-shelf-side=graphics]').click();page.locator('.device-label[data-id="jbl-artwork"]').click(force=True,timeout=90000);expect(page.locator('#inspector-title')).to_have_text('JBL Premium Audio Campaign',timeout=90000)
 trigger=page.get_by_role('button',name='Explore case study · Preview');expect(trigger).to_be_visible(timeout=90000)
 page.wait_for_timeout(1200)
 snapshot="async()=>{const m=await import('./case-studies/shared/showroom-bridge.mjs');return m.showroomBridge.inspect()}"
 for i in range(3):
  before=page.evaluate(snapshot);y=page.evaluate('scrollY');trigger.click(force=True);f=page.frame_locator('iframe[title="JBL composition study"]');expect(f.locator('html')).to_have_class('motion-ready',timeout=30000);f.locator('#exit').click();expect(trigger).to_be_focused(timeout=30000);after=page.evaluate(snapshot);assert after['pose']==before['pose'],(before,after);assert abs(page.evaluate('scrollY')-y)<2;expect(page.locator('#inspector-title')).to_have_text('JBL Premium Audio Campaign')
 assert not errors,errors
 ctx=b.new_context(java_script_enabled=False);s=ctx.new_page();s.goto(base+'case-studies/jbl-preview.html');assert s.locator('#static section').count()==6;expect(s.locator('#static')).to_be_visible()
 (out/'entry-tests.json').write_text(json.dumps(dict(status='PASS',cycles=3,scope='Chromium software GL actual graphic selection, iframe open/exit, exact real camera/board pose, focus and scroll restoration; no-JS static chapters',errors=errors),indent=2)+'\n');b.close()
server.shutdown();print('PASS entry, three return cycles and no-JS')
