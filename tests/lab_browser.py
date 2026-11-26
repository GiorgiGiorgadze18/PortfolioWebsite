"""Exercise the real Lab controls and shared Home hologram in browser emulation."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
base='http://127.0.0.1:8052/'
out=Path(__file__).resolve().parents[1]/'docs/phase07'
rows=[]
with sync_playwright() as p:
 for engine,path in [(p.chromium,'/usr/bin/chromium'),(p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path)
  for w,h in [(1440,900),(320,568),(390,844),(768,1024),(1024,768),(2560,1080)]:
   page=b.new_page(viewport={'width':w,'height':h},is_mobile=w<900,has_touch=w<900,ignore_https_errors=True)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(base+'lab.html',wait_until='domcontentloaded')
   page.evaluate('document.fonts.ready')
   card=page.locator('[data-hologram] .discipline-card')
   card.scroll_into_view_if_needed()
   page.wait_for_function("document.querySelector('.discipline-card').classList.contains('is-in-view')")
   assert page.locator('h1').count()==1
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(engine.name,w)
   strength=page.locator('#lab-strength')
   strength.focus();page.keyboard.press('ArrowRight')
   assert float(strength.input_value())>1
   reflection=page.locator('#lab-reflection')
   reflection.focus();page.keyboard.press('ArrowLeft')
   assert float(reflection.input_value())<.35
   assert card.evaluate("e=>e.style.getPropertyValue('--lab-reflection')") == reflection.input_value()
   pause=page.locator('#lab-pause')
   pause.click()
   assert pause.get_attribute('aria-pressed')=='true'
   assert card.locator('.discipline-card__surface').evaluate('e=>getComputedStyle(e).animationPlayState')=='paused'
   page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))")
   assert card.locator('.discipline-card__surface').evaluate('e=>getComputedStyle(e).animationPlayState')=='paused'
   page.locator('[type=reset]').click()
   page.wait_for_function("document.querySelector('#lab-strength').value==='1'")
   assert pause.get_attribute('aria-pressed')=='false'
   assert page.locator('#reflection-value').inner_text()=='0.35'
   page.emulate_media(reduced_motion='reduce')
   page.wait_for_function("document.querySelector('#lab-strength').disabled")
   assert pause.is_disabled()
   assert reflection.is_enabled()
   assert card.locator('.discipline-card__surface').evaluate('e=>getComputedStyle(e).animationName')=='none'
   page.emulate_media(reduced_motion='no-preference')
   page.wait_for_function("!document.querySelector('#lab-strength').disabled")
   if w in (1440,390) and engine.name=='chromium':
    page.evaluate("scrollTo({top:0,behavior:'instant'})")
    page.screenshot(path=str(out/f'lab-{w}.png'),full_page=True)
   assert not errors,errors
   rows.append([engine.name,w,'controls/keyboard/pause/visibility/reset/reduced/overflow','PASS'])
   print(rows[-1],flush=True);page.close()
  page=b.new_page(java_script_enabled=False,ignore_https_errors=True)
  page.goto(base+'lab.html',wait_until='domcontentloaded')
  assert page.locator('.discipline-card').is_visible()
  assert page.locator('.lab-controls').is_hidden()
  assert page.locator('noscript').last.is_visible()
  page.close()
  # Shared engine still selects the four Home cards and returns to neutral.
  page=b.new_page(viewport={'width':1440,'height':900},ignore_https_errors=True)
  page.goto(base+'index.html',wait_until='domcontentloaded')
  card=page.locator('.discipline-card').first;card.scroll_into_view_if_needed()
  page.wait_for_function("document.querySelector('.discipline-card').classList.contains('is-in-view')")
  page.wait_for_function("getComputedStyle(document.querySelector('.discipline-card')).opacity==='1'")
  bb=card.bounding_box();page.mouse.move(bb['x']+bb['width']*.8,bb['y']+bb['height']*.4)
  page.wait_for_function("parseFloat(document.querySelector('.discipline-card').style.getPropertyValue('--holo-ry'))>3")
  page.mouse.move(1,1)
  page.wait_for_function("document.querySelector('.discipline-card').style.getPropertyValue('--holo-ry')==='0deg'")
  assert page.locator('.discipline-card').count()==4
  assert page.locator('header a[href="lab.html"]').count()>=1
  page.close();b.close()
  rows.append([engine.name,'no-JS static Lab and Home tilt regression','PASS'])
(out/'tests.json').write_text(json.dumps(rows,indent=2)+'\n')
