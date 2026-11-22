"""Integration regression: python3 tests/showroom-browser.py [base URL]."""
from pathlib import Path
import argparse, json, re, urllib.request
from playwright.sync_api import sync_playwright, expect
parser=argparse.ArgumentParser();parser.add_argument('base_url',nargs='?',default='http://127.0.0.1:8014/PortfolioWebsite/');parser.add_argument('--smoke',action='store_true');parser.add_argument('--desktop-only',action='store_true');args=parser.parse_args()
BASE=args.base_url.rstrip('/')+'/';SMOKE=args.smoke
OUT=Path(__file__).resolve().parent/'artifacts';OUT.mkdir(exist_ok=True)
results=[]
expect.set_options(timeout=60000)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader'])
 for width in ([1440] if SMOKE else [1440,820]):
  context=browser.new_context(viewport={'width':width,'height':1000})
  context.set_default_timeout(60000)
  page=context.new_page();errors=[];failed=[];external=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 else None)
  page.on('request',lambda r:external.append(r.url) if not r.url.startswith((BASE,'data:','blob:')) else None)
  response=page.goto(BASE+'projects.html',wait_until='networkidle');assert response.status==200
  expect(page.locator('#stage-enter')).to_have_class(re.compile('is-done'))
  expect(page.locator('#showroom-canvas canvas')).to_be_visible()
  expect(page.locator('.archive-card')).to_have_count(5)
  expect(page.locator('.device-label:visible')).to_have_count(2)
  page.locator('[data-filter="uiux"]').click();expect(page.locator('.archive-card:visible')).to_have_count(2)
  page.locator('[data-filter="graphics"]').click();expect(page.locator('.archive-card:visible')).to_have_count(3)
  page.locator('[data-filter="all"]').click()
  # The archive keeps its direct JBL artwork dialog.
  page.locator('[data-explore="jbl-artwork"]').click()
  expect(page.locator('dialog.mobile-project-dialog')).to_be_visible();expect(page.locator('dialog.mobile-project-dialog h2')).to_have_text('JBL Premium Audio Campaign')
  page.keyboard.press('Escape');expect(page.locator('dialog.mobile-project-dialog')).not_to_be_visible()
  page.locator('#museum-frame').scroll_into_view_if_needed();page.wait_for_timeout(1200)
  if not SMOKE: page.screenshot(path=str(OUT/f'gallery-{width}.png'),animations='disabled',timeout=90000)
  for project in ([] if SMOKE else ['tsero','tomford','earthhour']):
   page.locator(f'[data-explore="{project}"]').click()
   expect(page.locator('#project-inspector')).to_have_class(re.compile('is-open'))
   expect(page.locator('#inspector-close')).to_be_in_viewport()
   page.wait_for_timeout(1000)
   expect(page.locator('#inspector-open')).to_have_attribute('href',re.compile('assets/project-'))
   page.locator('#inspector-close').click()
   print('Inspector checked',width,project,flush=True)
   expect(page.locator('#reset-view')).to_be_hidden();page.wait_for_timeout(900)
  print('Testing MeeTab',width,flush=True)
  page.locator('[data-explore="jbl"]').click()
  expect(page.locator('#try-preview')).to_be_visible()
  page.locator('#museum-frame').scroll_into_view_if_needed();page.wait_for_timeout(1000)
  iframe=page.frame_locator('#screen-portal iframe');expect(iframe.locator('#nav')).to_be_attached()
  frame=next(f for f in page.frames if f!=page.main_frame)
  frame_id=frame.evaluate('performance.timeOrigin')
  page.locator('#try-preview').click()
  expect(page.locator('#museum-frame')).to_have_class(re.compile('is-demo'))
  expect(page.locator('.demo-badge')).to_be_visible()
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','auto')
  assert not page.locator('.demo-workspace').evaluate('(e)=>e.inert')
  page.wait_for_timeout(1300)
  iframe.locator('#nav button[data-go="book"]').focus();iframe.locator('#nav button[data-go="book"]').press('Enter')
  expect(iframe.locator('.page.on')).to_have_attribute('id',re.compile('book',re.I))
  active=frame.locator('.page.on').get_attribute('id')
  if not SMOKE: page.screenshot(path=str(OUT/f'demo-{width}.png'),animations='disabled',timeout=90000)
  page.locator('.demo-exit').click()
  expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','false')
  expect(page.locator('#try-preview')).to_be_focused()
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','none')
  assert page.locator('.demo-workspace').evaluate('(e)=>e.inert')
  page.wait_for_timeout(1000);page.locator('#try-preview').click()
  expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','true')
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','auto')
  print('Pointer exit/reentry verified',width,flush=True)
  assert frame.evaluate('performance.timeOrigin')==frame_id
  assert frame.locator('.page.on').get_attribute('id')==active
  page.locator('#try-preview').click();expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','false')
  page.locator('#try-preview').click();expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','true')
  page.emulate_media(reduced_motion='reduce');expect(page.locator('#tablet-outline rect')).to_have_css('animation-name','none')
  # Keyboard toggles avoid forced coordinate clicks while camera alignment moves the control.
  page.locator('#try-preview').focus();page.locator('#try-preview').press('Enter')
  expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','false')
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','none')
  page.locator('#try-preview').press('Enter')
  expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','true')
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','auto')
  page.locator('#reset-view').click();expect(page.locator('#try-preview')).to_be_hidden()
  page.wait_for_timeout(900)
  # Same-site links retain the GitHub Pages repository prefix.
  for href in ['index.html','about.html','contact.html']:
   # urllib honors the managed environment proxy, including hosts without direct IPv6 egress.
   with urllib.request.urlopen(BASE+href,timeout=30) as response: assert response.status==200
  assert page.locator('.navbar__links a').nth(0).get_attribute('href')=='index.html'
  assert not errors,errors
  assert not failed,failed
  assert not external,external
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  results.append({'width':width,'status':'PASS','checks':['3D and artwork load','five projects and category filters','project inspectors','JBL retained','MeeTab booking','same iframe and state after exit/reentry','repeated toggles','reduced motion','gallery cleanup','navigation prefix','no JS errors, failed responses or external requests']})
  if SMOKE and 'project inspectors' in results[-1]['checks']: results[-1]['checks'].remove('project inspectors')
  print(json.dumps(results[-1]),flush=True);context.close()
 from mobile_showroom import check_phones
 if not args.desktop_only:results.extend(check_phones(browser,BASE,OUT,smoke=SMOKE))
 # WebGL unavailable: project details remain usable on desktop.
 context=browser.new_context(viewport={'width':1280,'height':900})
 context.add_init_script("const getContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^webgl/.test(type)?null:getContext.call(this,type,...args)}")
 page=context.new_page();page.goto(BASE+'projects.html',wait_until='networkidle')
 expect(page.locator('#stage-fallback')).to_be_visible();page.locator('[data-explore="tsero"]').click();expect(page.locator('dialog.mobile-project-dialog')).to_be_visible()
 results.append({'mode':'no-webgl','status':'PASS','checks':['visible fallback','working project details']});context.close()
 # The collection remains reachable without scripting.
 context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page=context.new_page();page.goto(BASE+'projects.html');expect(page.locator('noscript a[href="assets/project-jbl.png"]')).to_be_visible()
 expect(page.locator('#stage-enter')).not_to_be_visible()
 expect(page.locator('#stage-fallback')).to_be_visible()
 results.append({'mode':'no-javascript','status':'PASS','checks':['artwork links available','loading overlay removed']});context.close()
 browser.close()
(OUT/('desktop-results.json' if args.desktop_only else 'production-results.json' if SMOKE else 'results.json')).write_text(json.dumps({'base_url':BASE,'browser':'Chromium with software WebGL','physical_device_testing':False,'scenarios':results},indent=2)+'\n')
print('ALL SCENARIOS PASSED',flush=True)
