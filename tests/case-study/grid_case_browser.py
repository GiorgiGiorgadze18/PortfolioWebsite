from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json,os,re
from playwright.sync_api import sync_playwright,expect
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
slug=os.environ.get('CASE_SLUG','jbl-artwork'); project=json.loads(Path('case-studies/config.json').read_text())['projects'][slug]; chapters=json.loads(Path(f'case-studies/projects/{slug}/chapters.json').read_text())
s=ThreadingHTTPServer(('127.0.0.1',0),Q);Thread(target=s.serve_forever,daemon=True).start();rows=[]
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else []);page=b.new_page(viewport={'width':390,'height':844});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(f'http://127.0.0.1:{s.server_port}/projects.html?view=grid&caseStudyPreview=1');page.locator(f'[data-explore="{slug}"]').click();button=page.locator('[data-case-grid]');button.click();f=page.frame_locator(f'iframe[title="{project["shortTitle"]} composition study"]');expect(f.locator('html')).to_have_class(re.compile(r'\bmotion-ready\b'),timeout=30000);assert f.locator('html.scene-mode').count()==0;f.locator('#chapters button').nth(2).click(force=True);page.wait_for_timeout(1600);expect(f.locator('#chapter-title')).to_have_text(chapters[2]['title']);f.locator('#exit').click();expect(button).to_be_focused();assert not errors,errors;rows.append({'browser':name,'status':'PASS','scope':'Grid opens standalone CSS3D case and restores grid detail focus','errors':errors});b.close()
s.shutdown();Path('docs/case-study/evidence/reference/'+os.environ.get('CASE_GRID_REPORT','grid-case-tests.json')).write_text(json.dumps(rows,indent=2)+'\n');print(rows)
