"""Local checks only. All form requests are blocked and preview demos use sample data."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path(__file__).resolve().parents[1]/'docs/phase05'
results={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--enable-unsafe-swiftshader','--use-angle=swiftshader'])
 for name in ['index','about','contact','projects']:
  page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,ignore_https_errors=True)
  page.route('https://formspree.io/**',lambda r:r.abort())
  page.goto('http://127.0.0.1:8047/'+name+'.html'+('?view=grid' if name=='projects' else ''),wait_until='domcontentloaded')
  page.wait_for_timeout(1000)
  page.add_script_tag(path='/tmp/portfolio00-axe.js')
  results[name]=page.evaluate("async()=> (await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.length,targets:v.nodes.map(n=>n.target)}))")
  if name!='projects':
   assert page.locator('#mobile-menu').evaluate('e=>e.inert')
   page.locator('#hamburger').click()
   assert page.locator('#mobile-menu').evaluate('e=>e.contains(document.activeElement)&&!e.inert')
   page.keyboard.press('Escape')
   assert page.locator('#hamburger').evaluate('e=>e===document.activeElement')
   assert page.locator('#mobile-menu').evaluate('e=>e.inert')
  page.evaluate("document.documentElement.style.fontSize='200%'")
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),name
  page.screenshot(path=str(out/(name+'-mobile.png')))
  page.close()
 # Initial desktop 3D must not prewarm the application.
 page=b.new_page(viewport={'width':1280,'height':900},ignore_https_errors=True)
 requests=[];page.on('request',lambda r:requests.append(r.url))
 page.goto('http://127.0.0.1:8047/projects.html',wait_until='domcontentloaded')
 page.wait_for_selector('#shelf-switch:not([hidden])',timeout=60000)
 assert not any('meetab-demo.html' in url for url in requests)
 # Invalid bridge messages from this document have no matching frame source.
 page.evaluate("postMessage({showroom:true,kind:'wheel',delta:'bad',mode:0},'*')")
 results['menu_keyboard']='PASS'
 results['reflow_200_percent']='PASS'
 results['desktop_no_demo_prewarm']='PASS'
 page.close();b.close()
(out/'accessibility.json').write_text(json.dumps(results,indent=2)+'\n')
print(results)
