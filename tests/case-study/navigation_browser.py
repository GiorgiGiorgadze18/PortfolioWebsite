from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start();out=Path('docs/case-study/evidence/navigation');out.mkdir(exist_ok=True);rows=[]
registry=json.loads(Path('case-studies/config.json').read_text())['projects']
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  browser=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for slug in os.environ.get('CASE_SLUGS','jbl-artwork,tomford').split(','):
   chapters=json.loads(Path(f'case-studies/projects/{slug}/chapters.json').read_text())
   for width,height in [(1440,900),(390,844),(320,568),(844,390)]:
    page=browser.new_page(viewport=dict(width=width,height=height));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(f'http://127.0.0.1:{server.server_port}/case-studies/{registry[slug]["preview"]}?embedded=1');expect(page.locator('html')).to_have_class(__import__('re').compile('motion-ready'),timeout=60000)
    if height<500:
     expect(page.locator('#static')).to_be_visible();assert page.locator('#static section').count()==6
    else:
     previous=page.locator('#previous');next_button=page.locator('#next');assert next_button.evaluate('el=>getComputedStyle(el).backgroundColor')=={'jbl-artwork':'rgb(14, 137, 230)','tomford':'rgb(168, 133, 84)','earthhour':'rgb(173, 148, 217)'}[slug];dots=page.locator('#chapters button');expect(previous).to_be_disabled();assert dots.all_text_contents()==['']*6
     boxes=[dots.nth(i).bounding_box() for i in range(6)];assert all(boxes[i+1]['y']>boxes[i]['y'] and abs(boxes[i+1]['x']-boxes[i]['x'])<1 for i in range(5)),boxes
     next_button.click();expect(page.locator('#chapter-title')).to_have_text(chapters[1]['title']);next_button.click();next_button.click();previous.click();expect(page.locator('#chapter-title')).to_have_text(chapters[2]['title']);page.wait_for_timeout(1600)
     assert dots.nth(2).get_attribute('aria-current')=='true';dots.nth(2).focus();page.keyboard.press('ArrowDown');expect(dots.nth(3)).to_be_focused();expect(page.locator('#chapter-title')).to_have_text(chapters[3]['title']);page.wait_for_timeout(1600)
     page.evaluate('window.frameSettled={last:null,count:0}');page.wait_for_function('''()=>{const value=getComputedStyle(document.querySelector('.plane:last-child')).transform;const s=window.frameSettled;s.count=value===s.last?s.count+1:0;s.last=value;return s.count>=8}''');before=page.locator('.plane').last.evaluate('el=>getComputedStyle(el).transform');page.mouse.wheel(0,600);page.wait_for_timeout(300);after=page.locator('.plane').last.evaluate('el=>getComputedStyle(el).transform');assert max(abs(float(a)-float(b)) for a,b in zip(before.removeprefix('matrix3d(').removesuffix(')').split(','),after.removeprefix('matrix3d(').removesuffix(')').split(',')))<.1,(before,after);assert dots.nth(3).get_attribute('aria-current')=='true'
     assert page.evaluate('document.documentElement.scrollHeight<=innerHeight+1'),page.evaluate('({height:document.documentElement.scrollHeight,vh:innerHeight})')
     assert next_button.bounding_box()['y']+next_button.bounding_box()['height']<=height
     page.screenshot(path=str(out/f'{name}-{slug}-{width}.png'))
     dots.last.click();expect(next_button).to_be_disabled();previous.click();expect(page.locator('#chapter-title')).to_have_text(chapters[-2]['title']);page.locator('#replay').click();expect(previous).to_be_disabled();expect(page.locator('#chapter-title')).to_have_text(chapters[0]['title'])
     page.emulate_media(reduced_motion='reduce');expect(page.locator('#static')).to_be_visible();page.wait_for_function('document.getAnimations().filter(a=>a.playState==="running").length===0')
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert not errors,errors;rows.append(dict(browser=name,project=slug,viewport=[width,height],status='PASS',errors=errors));page.close()
  browser.close()
server.shutdown();(out/os.environ.get('CASE_NAV_REPORT','tests.json')).write_text(json.dumps(rows,indent=2)+'\n');print(rows)
