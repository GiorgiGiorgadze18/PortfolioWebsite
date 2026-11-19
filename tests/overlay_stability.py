"""Screen-bound neon and mobile resize/compositing regression."""
from pathlib import Path
import argparse,json,os,re
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('base_url',nargs='?',default='http://127.0.0.1:8014/PortfolioWebsite/');parser.add_argument('--engine',choices=['chromium','webkit'],default='chromium');parser.add_argument('--phone-only',action='store_true');parser.add_argument('--desktop-only',action='store_true');args=parser.parse_args()
base=args.base_url.rstrip('/')+'/';out=Path(__file__).parent/'artifacts';out.mkdir(exist_ok=True)
expect.set_options(timeout=60000);results=[]

def aligned(page):
 value=page.evaluate('''()=>{
  const portal=document.querySelector('#screen-portal'),svg=document.querySelector('#demo-signal'),rect=svg.querySelector('rect');
  const box=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}};
  return {inside:portal.contains(svg),svg:box(svg),portal:box(portal),localOutline:rect?{x:rect.x.baseVal.value,y:rect.y.baseVal.value,w:rect.width.baseVal.value,h:rect.height.baseVal.value}:null};
 }''')
 assert value['inside'] and value['localOutline'],value
 for key in ['x','y','width','height']:assert abs(value['svg'][key]-value['portal'][key])<1,value
 assert value['localOutline']['x']>=0 and value['localOutline']['y']>=0
 assert value['localOutline']['x']+value['localOutline']['w']<=1280
 assert value['localOutline']['y']+value['localOutline']['h']<=800
 return value

def settle(page):
 page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')

with sync_playwright() as p:
 launch={'executable_path':'/usr/bin/chromium','args':['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']} if args.engine=='chromium' else {}
 if args.engine=='webkit' and os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE'):launch['executable_path']=os.environ['SHOWROOM_WEBKIT_EXECUTABLE']
 browser=getattr(p,args.engine).launch(**launch)
 for width in ([1280] if args.desktop_only else [390] if args.phone_only or args.engine=='webkit' else [390,1280]):
  phone=width<=600
  context=browser.new_context(viewport={'width':width,'height':844 if phone else 900},is_mobile=phone,has_touch=phone,device_scale_factor=2 if phone else 1)
  context.set_default_timeout(60000);page=context.new_page();errors=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 else None)
  page.goto(base+'projects.html',wait_until='networkidle');page.locator('#museum-frame').scroll_into_view_if_needed()
  expect(page.locator('#showroom-canvas canvas')).to_be_visible()
  label=page.locator('.device-label[data-id="jbl"]')
  if phone:label.tap()
  else:page.locator('[data-explore="jbl"]').click()
  button=page.locator('#try-preview');expect(button).to_be_enabled();button.tap() if phone else button.click()
  expect(button).to_have_attribute('aria-pressed','true');page.wait_for_timeout(1000);settle(page)
  first=aligned(page);iframe=page.frame_locator('#screen-portal iframe');expect(iframe.locator('#nav')).to_be_attached()
  child=next(f for f in page.frames if f!=page.main_frame);identity=child.evaluate('performance.timeOrigin')
  # Record actual drawing-buffer writes and transform mutations, not app counters.
  page.evaluate('''()=>{
   window.overlayMetrics={bufferWrites:0,transformWrites:0,descriptors:{}};
   for(const name of ['width','height']){const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,name);overlayMetrics.descriptors[name]=d;Object.defineProperty(HTMLCanvasElement.prototype,name,{...d,set(v){if(this.closest('#showroom-canvas,#focus-canvas'))overlayMetrics.bufferWrites++;d.set.call(this,v)}})}
   overlayMetrics.observer=new MutationObserver(list=>{for(const m of list){const before=m.oldValue||'',after=m.target.getAttribute('style')||'';const part=s=>(s.match(/(?:^|;)\\s*transform\\s*:[^;]*/)||[])[0]||'';if(part(before)!==part(after))overlayMetrics.transformWrites++;}});
   overlayMetrics.observer.observe(document.querySelector('#screen-portal'),{attributes:true,attributeFilter:['style'],attributeOldValue:true});
  }''')
  if phone:
   page.wait_for_timeout(350)
   stable_transforms=page.evaluate('overlayMetrics.transformWrites');assert stable_transforms==0,stable_transforms
  else:stable_transforms=None
  before=page.evaluate('overlayMetrics.bufferWrites')
  page.evaluate("()=>{for(let i=0;i<10;i++)dispatchEvent(new Event('resize'))}")
  settle(page);page.wait_for_timeout(150)
  unchanged=page.evaluate('overlayMetrics.bufferWrites')-before;assert unchanged==0,unchanged
  assert child.evaluate('performance.timeOrigin')==identity
  aligned(page)
  # The real app remains usable after the resize storm.
  target=iframe.locator('#nav button[data-go="book"]')
  if phone:
   rect=target.evaluate('(e)=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}');screen=page.locator('#screen-portal').bounding_box()
   page.touchscreen.tap(screen['x']+(rect['x']+rect['w']/2)*screen['width']/1280,screen['y']+(rect['y']+rect['h']/2)*screen['height']/800)
  else:target.focus();target.press('Enter')
  expect(iframe.locator('.page.on')).to_have_attribute('id',re.compile('book',re.I));active=child.locator('.page.on').get_attribute('id')
  if phone:
   before=page.evaluate('overlayMetrics.bufferWrites');page.set_viewport_size({'width':414,'height':896});settle(page);page.wait_for_timeout(200)
   resized=page.evaluate('overlayMetrics.bufferWrites')-before;assert 0<resized<=8,resized
   aligned(page)
   page.set_viewport_size({'width':844,'height':390});settle(page);page.wait_for_timeout(200);aligned(page)
   page.set_viewport_size({'width':390,'height':844});settle(page);page.wait_for_timeout(200);aligned(page)
  else:
   resized=None
   screen=page.locator('#screen-portal').bounding_box();page.mouse.move(screen['x']+screen['width']/2,screen['y']+screen['height']/2);page.mouse.wheel(0,-90);page.wait_for_timeout(700);aligned(page)
  button.tap() if phone else button.click();expect(button).to_have_attribute('aria-pressed','false')
  # Bring the device back on screen after orientation changes, then drag its face.
  # The inactive iframe is inert, so the foreground canvas receives this gesture.
  page.locator('#museum-frame').scroll_into_view_if_needed();settle(page)
  screen=page.locator('#screen-portal').bounding_box();x=screen['x']+screen['width']/2;y=screen['y']+screen['height']/2
  assert 0<x<page.viewport_size['width'] and 80<y<page.viewport_size['height']
  assert page.evaluate('([x,y])=>Boolean(document.elementFromPoint(x,y)?.closest("#focus-canvas"))',[x,y])
  page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+16,y+9,steps=3);page.mouse.up();page.wait_for_timeout(500)
  button.tap() if phone else button.click();expect(button).to_have_attribute('aria-pressed','true');settle(page);aligned(page)
  assert child.evaluate('performance.timeOrigin')==identity
  assert child.locator('.page.on').get_attribute('id')==active
  page.locator('#demo-signal rect').evaluate('(e)=>{for(const a of e.getAnimations()){a.pause();a.currentTime=350}}')
  page.screenshot(path=str(out/f'overlay-{args.engine}-{width}.png'),timeout=90000)
  page.emulate_media(reduced_motion='reduce');expect(page.locator('#demo-signal')).to_have_css('display','none')
  page.locator('#reset-view').tap() if phone else page.locator('#reset-view').click();expect(button).to_be_hidden()
  page.evaluate("()=>{overlayMetrics.observer.disconnect();for(const name of ['width','height'])Object.defineProperty(HTMLCanvasElement.prototype,name,overlayMetrics.descriptors[name]);}")
  assert not errors,errors;assert not failed,failed
  result={'engine':args.engine,'width':width,'deviceScaleFactor':2 if phone else 1,'status':'PASS','unchangedResizeEvents':10,'unchangedResizeBufferWrites':unchanged,'settledPhoneTransformWrites':stable_transforms,'realResizeBufferWrites':resized,'checks':['neon shares the actual screen transform','alignment after zoom/drag/orientation changes','no redundant buffer clears','ready app and booking survive viewport notifications','same iframe and state across preview toggles','reduced motion and gallery cleanup','no JS errors or failed requests']}
  results.append(result);print(json.dumps(result),flush=True);context.close()
 browser.close()
(out/(f'overlay-{args.engine}-'+('desktop-' if args.desktop_only else '')+('production' if base.startswith('https:') else 'local')+'.json')).write_text(json.dumps({'base_url':base,'physical_device_testing':False,'scenarios':results},indent=2)+'\n')
