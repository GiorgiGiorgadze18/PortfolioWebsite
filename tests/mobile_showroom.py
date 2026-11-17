"""Phone 3D regression; run directly with --engine chromium or --engine webkit."""
from pathlib import Path
import argparse,json,re,os
from playwright.sync_api import sync_playwright,expect

def check_phones(browser,base,out,engine='chromium',smoke=False):
 results=[]
 for width in ([390] if smoke else [360,390,412,600]):
  context=browser.new_context(viewport={'width':width,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
  page=context.new_page();errors=[];failed=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 else None)
  page.on('request',lambda r:requests.append(r.url))
  page.goto(base+'projects.html',wait_until='networkidle')
  page.locator('#museum-frame').scroll_into_view_if_needed()
  expect(page.locator('#showroom-canvas canvas')).to_be_visible(timeout=30000)
  expect(page.locator('#stage-fallback')).not_to_be_visible()
  expect(page.locator('.device-label')).to_have_count(4)
  expect(page.locator('.archive-card')).to_have_count(5)
  assert any('three.js' in u for u in requests)
  assert not any('meetab-demo.html' in u for u in requests),'Phone demo should load on demand'
  for label in page.locator('.device-label').all():
   assert label.bounding_box()['height']>=44
  canvas=page.locator('#showroom-canvas canvas')
  assert canvas.evaluate('(c)=>c.width/c.clientWidth')<=1.26
  page.wait_for_timeout(1500)
  if width==390 and not smoke:page.screenshot(path=str(out/f'phone-{engine}-gallery.png'),animations='disabled')
  print('Phone 3D ready',engine,width,flush=True)
  page.locator('.device-label[data-id="tsero"]').tap()
  expect(page.locator('#project-inspector')).to_have_attribute('aria-hidden','false')
  expect(page.locator('#inspector-title')).to_have_text('Tsero App')
  expect(page.locator('#focus-canvas canvas')).to_be_visible()
  expect(page.locator('#project-inspector')).to_have_css('transform','matrix(1, 0, 0, 1, 0, 0)')
  rect=page.locator('#project-inspector').bounding_box();frame_rect=page.locator('#museum-frame').bounding_box()
  assert abs(rect['width']-width)<2
  assert abs(rect['y']+rect['height']-frame_rect['y']-frame_rect['height'])<2
  page.locator('#inspector-close').tap()
  expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
  page.locator('.device-label[data-id="jbl"]').tap()
  expect(page.locator('#try-preview')).to_be_visible()
  iframe=page.frame_locator('#screen-portal iframe')
  expect(iframe.locator('#nav')).to_be_attached(timeout=30000)
  child=next(f for f in page.frames if f!=page.main_frame);identity=child.evaluate('performance.timeOrigin')
  page.locator('#try-preview').tap()
  expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','true')
  expect(page.locator('#screen-portal')).to_have_css('pointer-events','auto')
  expect(iframe.locator('body')).not_to_have_css('cursor','grab')
  page.wait_for_timeout(1200)
  # Chromium's locator quads omit the scale of some transformed child frames.
  # Send a native touch at the app button's rendered position instead.
  target=iframe.locator('#nav button[data-go="book"]').evaluate('(e)=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}}')
  screen=page.locator('#screen-portal').bounding_box()
  touch_x=screen['x']+(target['x']+target['width']/2)*screen['width']/1280
  touch_y=screen['y']+(target['y']+target['height']/2)*screen['height']/800
  assert 0<touch_x<width and 0<touch_y<844
  page.touchscreen.tap(touch_x,touch_y)
  expect(iframe.locator('.page.on')).to_have_attribute('id',re.compile('book',re.I))
  active=child.locator('.page.on').get_attribute('id')
  if width==390 and not smoke:page.screenshot(path=str(out/f'phone-{engine}-demo.png'),animations='disabled')
  if width==390:
   page.locator('#try-preview').tap();expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','false')
   page.locator('#try-preview').tap();expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','true')
   assert child.evaluate('performance.timeOrigin')==identity
   assert child.locator('.page.on').get_attribute('id')==active
   page.locator('#try-preview').tap()
  else:
   page.locator('#try-preview').tap();expect(page.locator('#try-preview')).to_have_attribute('aria-pressed','false')
  # Real multi-touch input through Chromium's input protocol, over the device surface.
  if engine=='chromium' and width==390:
   page.wait_for_timeout(1000)
   box=page.locator('#screen-portal').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
   cdp=context.new_cdp_session(page)
   cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'id':1,'x':x-25,'y':y},{'id':2,'x':x+25,'y':y}]})
   cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'id':1,'x':x-55,'y':y},{'id':2,'x':x+55,'y':y}]})
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
   page.wait_for_timeout(1400)
   assert page.locator('#screen-portal').bounding_box()['width']>box['width']*1.08,'Pinch did not zoom the device'
   cdp.detach()
  if width==390:
   page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(800)
   expect(page.locator('#stage-fallback')).not_to_be_visible()
   page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(800)
   expect(page.locator('#inspector-close')).to_be_visible()
  page.locator('#inspector-close').tap()
  expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
  assert not page.locator('#device-labels').evaluate('(e)=>e.inert')
  page.locator('[data-explore="jbl-artwork"]').tap();expect(page.locator('dialog')).to_be_visible()
  page.locator('.mobile-dialog-close').tap()
  page.locator('#menu-toggle').tap();expect(page.locator('#mobile-menu')).to_be_visible()
  page.locator('#menu-toggle').tap();expect(page.locator('#mobile-menu')).to_be_hidden()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert not errors,errors
  assert not failed,failed
  assert not [u for u in requests if not u.startswith((base,'data:','blob:'))]
  checks=['real WebGL showroom instead of width fallback','44px touch targets','bottom project inspector','touch activation and booking navigation','JBL artwork and mobile menu','no JS errors, failed requests or horizontal overflow']
  if width==390:checks.extend(['portrait/landscape resizing','same MeeTab iframe/state after exit and reentry'])
  if engine=='chromium' and width==390:checks.append('two-finger scene zoom')
  result={'engine':engine,'width':width,'status':'PASS','checks':checks};results.append(result)
  print(json.dumps(result),flush=True);context.close()
 return results

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('base_url',nargs='?',default='http://127.0.0.1:8014/PortfolioWebsite/');parser.add_argument('--engine',choices=['chromium','webkit'],default='chromium');parser.add_argument('--smoke',action='store_true');args=parser.parse_args()
 out=Path(__file__).resolve().parent/'artifacts';out.mkdir(exist_ok=True);expect.set_options(timeout=30000)
 with sync_playwright() as p:
  launch={'executable_path':'/usr/bin/chromium','args':['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']} if args.engine=='chromium' else {}
  if args.engine=='webkit' and os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE'):launch['executable_path']=os.environ['SHOWROOM_WEBKIT_EXECUTABLE']
  browser=getattr(p,args.engine).launch(**launch)
  results=check_phones(browser,args.base_url.rstrip('/')+'/',out,args.engine,args.smoke)
  browser.close()
 (out/(f'mobile-{args.engine}-'+('production' if args.base_url.startswith('https:') else 'local')+'.json')).write_text(json.dumps({'engine':args.engine,'base_url':args.base_url,'physical_device_testing':False,'scenarios':results},indent=2)+'\n')
