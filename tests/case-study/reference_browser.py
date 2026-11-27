from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
import json
from playwright.sync_api import sync_playwright,expect
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
out=Path('docs/case-study/evidence/reference');out.mkdir(exist_ok=True);rows=[]
with sync_playwright() as p:
 for name,engine,path in [('chromium',p.chromium,'/usr/bin/chromium'),('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox'] if name=='chromium' else [])
  for width,height in [(1440,900),(390,844)]:
   page=b.new_page(viewport=dict(width=width,height=height));errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'case-studies/jbl-preview.html');expect(page.locator('html')).to_have_class('motion-ready',timeout=30000)
   page.locator('#chapters button').nth(1).click(force=True);page.wait_for_timeout(1800)
   assert page.locator('.plane').first.evaluate('el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m22<.75')
   assert page.locator('.plane').nth(4).evaluate('el=>Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m43)<1')
   page.screenshot(path=str(out/f'{name}-{width}-reclined.png'))
   weights=page.evaluate('''()=>new Promise(resolve=>{const until=performance.now()+2500;window.crossSamples=[];document.querySelectorAll('#chapters button')[2].click();function sample(){const w=[...document.querySelectorAll(".leader g")].map(el=>Number(el.style.opacity));window.crossSamples.push(w);if((w[0]>.001&&w[0]<.999&&w[1]>.001&&w[1]<.999)||performance.now()>until)resolve(w);else requestAnimationFrame(sample);}sample();})''');page.wait_for_timeout(1800);expect(page.locator('#chapter-title')).to_have_text('The product comes forward');page.screenshot(path=str(out/f'{name}-{width}-exploded.png'))
   planes=page.locator('.plane').evaluate_all('els=>els.map(el=>({top:el.getBoundingClientRect().top,z:new DOMMatrixReadOnly(getComputedStyle(el).transform).m43}))');assert planes[4]['top']<planes[0]['top']-20,planes
   assert page.locator('#chapters button[aria-current=true]').evaluate("el=>getComputedStyle(el,'::after').backgroundColor")=='rgb(14, 137, 230)'
   assert page.locator('.anchor-dot').count()==4
   assert .001<weights[0]<.999 and .001<weights[1]<.999,(weights,page.evaluate("window.crossSamples.slice(0,12)"))
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   page.locator('#chapters button').last.click(force=True);page.wait_for_timeout(1800);expect(page.locator('#chapter-title')).to_have_text('One composition again')
   page.locator('#replay').click();page.wait_for_timeout(1800);expect(page.locator('#chapter-title')).to_have_text('The finished artwork')
   page.emulate_media(reduced_motion='reduce');expect(page.locator('#static')).to_be_visible();assert page.locator('#static section').count()==6
   assert not errors,errors;rows.append(dict(browser=name,viewport=[width,height],status='PASS',errors=errors,planes=planes,lineCrossfadeWeights=weights));page.close()
  b.close()
(out/'tests.json').write_text(json.dumps(rows,indent=2)+'\n');server.shutdown();print(rows)
