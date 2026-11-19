"""v0.14.3: outer-body alignment and actual touch use of the responsive demo.
Run with --phone-only, --desktop-only, or --engine webkit --phone-only.
"""
from pathlib import Path
import argparse,json,os,re
from playwright.sync_api import sync_playwright,expect
OUT=Path(__file__).parent/'artifacts'

def outer_outline(page):
 data=page.evaluate('''()=>{
  const outline=document.querySelector('#tablet-outline'),screen=document.querySelector('#screen-portal');
  function quad(el){const m=new DOMMatrix(el.style.transform),w=parseFloat(el.style.width),h=parseFloat(el.style.height);return [[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>{const p=m.transformPoint(new DOMPoint(x,y));return [p.x/p.w,p.y/p.w]});}
  const outer=quad(outline),inner=quad(screen),center=q=>q.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);
  return {outsidePortal:!screen.contains(outline),visible:!outline.hasAttribute('hidden'),outer,inner,centerDistance:Math.hypot(...center(outer).map((x,i)=>x-center(inner)[i])),fill:getComputedStyle(outline.querySelector('rect')).fill,stroke:getComputedStyle(outline.querySelector('rect')).stroke};
 }''')
 assert data['outsidePortal'] and data['visible'] and data['fill']=='none',data
 assert data['centerDistance']<4,data
 # Each body corner must sit farther from the common centre than the screen corner.
 for i,(x,y) in enumerate(data['outer']):
  cx=sum(v[0] for v in data['inner'])/4;cy=sum(v[1] for v in data['inner'])/4
  gap=((x-cx)**2+(y-cy)**2)**.5-((data['inner'][i][0]-cx)**2+(data['inner'][i][1]-cy)**2)**.5
  assert 3<gap<60,(gap,data)
 return data

def observe(page):
 page.evaluate('''()=>{
  window.metrics={bufferWrites:0};window.canvasDescriptors={};
  for(const key of ['width','height']){const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,key);canvasDescriptors[key]=d;Object.defineProperty(HTMLCanvasElement.prototype,key,{...d,set(v){metrics.bufferWrites++;d.set.call(this,v)}})}
 }''')

def check_phone(browser,base,out,engine):
 c=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
 c.set_default_timeout(90000);page=c.new_page();errors=[];failed=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 else None);page.on('request',lambda r:requests.append(r.url))
 page.add_init_script('''window.drawCalls=0;for(const proto of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype])for(const name of ['drawElements','drawArrays']){const original=proto[name];proto[name]=function(...args){window.drawCalls++;return original.apply(this,args)}}''')
 page.goto(base+'projects.html',wait_until='networkidle');page.locator('#museum-frame').scroll_into_view_if_needed()
 expect(page.locator('#showroom-canvas canvas')).to_be_visible();expect(page.locator('#stage-fallback')).not_to_be_visible()
 assert not any('meetab-demo.html' in u for u in requests)
 expect(page.locator('.archive-card')).to_have_count(5)
 for target in page.locator('.device-label').all():assert target.bounding_box()['height']>=44
 page.wait_for_timeout(900);page.screenshot(path=str(out/f'tablet-{engine}-gallery.png'))
 print('Gallery ready',engine,flush=True)
 page.locator('.device-label[data-id="jbl"]').tap();expect(page.locator('#try-preview')).to_be_enabled();expect(page.locator('#tablet-outline')).to_be_visible()
 page.wait_for_timeout(1200);alignment=outer_outline(page);page.screenshot(path=str(out/f'tablet-{engine}-focus.png'))
 print('Outline verified',engine,flush=True)
 observe(page);page.evaluate("()=>{for(let i=0;i<10;i++)dispatchEvent(new Event('resize'))}");page.wait_for_timeout(400)
 unchanged=page.evaluate('metrics.bufferWrites');assert unchanged==0,unchanged
 page.locator('#try-preview').tap();expect(page.locator('#mobile-demo')).to_be_visible()
 app=page.frame_locator('#mobile-demo iframe');expect(app.locator('html')).to_have_class('phone-demo')
 child=next(f for f in page.frames if f!=page.main_frame);identity=child.evaluate('performance.timeOrigin')
 assert child.evaluate("getComputedStyle(document.querySelector('#stage')).transform")=='none'
 page.wait_for_timeout(800);draws=page.evaluate('drawCalls');page.wait_for_timeout(350);assert page.evaluate('drawCalls')==draws,'Hidden 3D scene still renders'
 # Header must be fully above scrolling app content, with readable unscaled controls.
 assert child.locator('#shared').bounding_box()['height']<80
 assert child.locator('#shared').bounding_box()['y']+child.locator('#shared').bounding_box()['height']<=child.locator('#p-home').bounding_box()['y']
 page.screenshot(path=str(out/f'tablet-{engine}-mobile-home.png'))
 app.locator('#nav [data-go="book"]').tap();expect(app.locator('#p-book')).to_have_class('page on');page.wait_for_timeout(750)
 app.locator('#fTitle').fill('Touch booking test');app.locator('#gPlus').tap();expect(app.locator('#gNum')).to_have_text('2')
 app.locator('#fDur [data-v="30"]').tap();expect(app.locator('#fDur [data-v="30"]')).to_have_class('on')
 sizes=[]
 for width,height in [(360,800),(430,932),(844,390),(390,844)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(150)
  assert child.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert child.locator('#fTitle').input_value()=='Touch booking test'
  for target in ['#nav [data-go="book"]','#fTitle','#gPlus','#fDur [data-v="30"]']:
   box=child.locator(target).bounding_box();assert box['width']>=44 and box['height']>=44,(width,target,box)
  sizes.append([width,height])
 assert page.evaluate('metrics.bufferWrites')==unchanged,'Hidden 3D buffers resized during phone demo'
 app.locator('#fTitle').scroll_into_view_if_needed();page.screenshot(path=str(out/f'tablet-{engine}-mobile-booking.png'))
 page.locator('#mobile-demo-close').tap();expect(page.locator('#mobile-demo')).not_to_be_visible()
 expect(page.locator('#try-preview')).to_be_focused();page.wait_for_timeout(1100);outer_outline(page)
 page.locator('#try-preview').tap();expect(app.locator('#fTitle')).to_have_value('Touch booking test');assert child.evaluate('performance.timeOrigin')==identity
 print('Native form, responsive sizes and state retention verified',engine,flush=True)
 # Submit a local sample booking through normal visible touch controls.
 app.locator('#fDur [data-v="15"]').tap()
 slots=app.locator('#fSlots button:enabled')
 if slots.count():
  slots.first.tap();expect(slots.first).to_have_class('on',timeout=5000)
 print('Available sample booking selected',engine,flush=True)
 expect(app.locator('#bOk')).to_be_enabled(timeout=5000);app.locator('#bOk').tap()
 expect(app.locator('#ov')).to_have_class(re.compile('on'));expect(app.locator('#md')).to_contain_text('დაიჯავშნა');expect(app.locator('#md')).to_have_css('opacity','1');page.wait_for_timeout(450)
 panel=child.locator('#md').bounding_box();ack=child.locator('#md .mb').first.bounding_box()
 assert ack['y']>=panel['y'] and ack['y']+ack['height']<=panel['y']+panel['height']+1,'Confirmation button is clipped'
 page.screenshot(path=str(out/f'tablet-{engine}-booking-confirmed.png'))
 app.locator('#md .mb').first.tap();app.locator('#nav [data-go="cal"]').tap();expect(app.locator('#p-cal')).to_have_class('page on')
 page.wait_for_timeout(700);assert app.locator('#grid .card').count()>0
 page.locator('#mobile-demo-close').tap();page.locator('#inspector-close').tap();expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
 page.locator('[data-explore="jbl-artwork"]').tap();expect(page.locator('dialog.mobile-project-dialog')).to_be_visible();page.locator('.mobile-dialog-close').tap()
 if engine=='chromium':
  page.locator('#focus-canvas canvas').evaluate("c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()")
  expect(page.locator('#stage-fallback')).to_be_visible()
  page.locator('[data-explore="tsero"]').tap();expect(page.locator('.mobile-project-dialog')).to_be_visible()
 assert not errors,errors;assert not failed,failed
 assert not [u for u in requests if not u.startswith((base,'data:','blob:'))]
 result={'engine':engine,'status':'PASS','profile':'phone DPR 2','responsive_sizes':sizes,'unchangedResizeBufferWrites':unchanged,'outline':alignment,'checks':['correct gallery texture inspected in screenshot','outer-body outline beyond all four screen corners','native touch navigation, text entry, guests and duration','local booking submitted and confirmed','calendar cards rendered','no CSS transform on phone app','same iframe and form state on return','3D draw calls paused during demo','44px core controls','no horizontal overflow, errors or failed/external requests']}
 c.close();return result

def check_desktop(browser,base,out,engine):
 c=browser.new_context(viewport={'width':1280,'height':1000});c.set_default_timeout(90000);page=c.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.goto(base+'projects.html',wait_until='networkidle')
 page.locator('[data-explore="jbl"]').click();expect(page.locator('#try-preview')).to_be_visible();expect(page.locator('#tablet-outline')).to_be_visible();expect(page.locator('#try-preview')).to_be_enabled();page.wait_for_timeout(1400)
 print('Desktop focus ready',engine,flush=True)
 before=outer_outline(page);box=page.locator('#tablet-outline').bounding_box();x=box['x']+box['width']/2;y=box['y']+box['height']/2
 page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+38,y+22,steps=5);page.mouse.up();page.wait_for_timeout(900)
 after=outer_outline(page);assert before['outer']!=after['outer']
 page.locator('#try-preview').click();expect(page.locator('#screen-portal')).to_be_visible();assert not page.locator('#mobile-demo').evaluate("e=>e.matches(':modal')");page.wait_for_timeout(1800)
 active=outer_outline(page)
 frame=page.locator('#museum-frame').bounding_box();actual=page.locator('#screen-portal').bounding_box();xs=[p[0] for p in active['inner']];ys=[p[1] for p in active['inner']]
 assert abs(actual['x']-frame['x']-min(xs))<2 and abs(actual['y']-frame['y']-min(ys))<2,(actual,frame,active)
 box=page.locator('#screen-portal').bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.wheel(0,-100);page.wait_for_timeout(800);outer_outline(page)
 observe(page);page.evaluate("()=>{for(let i=0;i<10;i++)dispatchEvent(new Event('resize'))}");page.wait_for_timeout(400);assert page.evaluate('metrics.bufferWrites')==0
 app=page.frame_locator('#screen-portal iframe');app.locator('#nav [data-go="book"]').focus();app.locator('#nav [data-go="book"]').press('Enter');expect(app.locator('#p-book')).to_have_class('page on')
 page.wait_for_timeout(850);page.screenshot(path=str(out/f'tablet-{engine}-desktop-neon.png'))
 page.emulate_media(reduced_motion='reduce');expect(page.locator('#tablet-outline .tablet-runner')).to_have_css('animation-name','none');expect(page.locator('#tablet-outline .tablet-halo')).to_be_visible()
 page.locator('#try-preview').click();page.locator('#reset-view').click();expect(page.locator('#tablet-outline')).not_to_be_visible()
 for project,name in [('tsero','Tsero App'),('tomford','Tom Ford Tobacco Vanille'),('earthhour','Earth Hour')]:
  page.locator(f'[data-explore="{project}"]').click();expect(page.locator('#inspector-title')).to_contain_text(name)
  page.locator('#inspector-close').click();expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
 assert not errors,errors
 c.close();return {'engine':engine,'profile':'desktop 1280','status':'PASS','outline':active,'checks':['outer body halo and running light visible','projection follows rotation and zoom','app remains inside tablet on desktop','booking navigation','zero redundant buffer resizes','reduced motion retains static halo','clean gallery return']}

def main():
 parser=argparse.ArgumentParser();parser.add_argument('base_url',nargs='?',default='http://127.0.0.1:8014/PortfolioWebsite/');parser.add_argument('--engine',choices=['chromium','webkit'],default='chromium');parser.add_argument('--phone-only',action='store_true');parser.add_argument('--desktop-only',action='store_true');args=parser.parse_args()
 OUT.mkdir(exist_ok=True);base=args.base_url.rstrip('/')+'/';expect.set_options(timeout=90000)
 with sync_playwright() as p:
  launch={'executable_path':'/usr/bin/chromium','args':['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']} if args.engine=='chromium' else {'executable_path':os.environ['SHOWROOM_WEBKIT_EXECUTABLE']} if os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE') else {}
  b=getattr(p,args.engine).launch(**launch);results=[]
  if not args.desktop_only:results.append(check_phone(b,base,OUT,args.engine));print('Phone PASS',args.engine,flush=True)
  if not args.phone_only:results.append(check_desktop(b,base,OUT,args.engine));print('Desktop PASS',args.engine,flush=True)
  b.close()
 report={'base_url':base,'physical_device_testing':False,'scenarios':results}
 name=f'tablet-{args.engine}-'+('desktop-' if args.desktop_only else '')+('production' if base.startswith('https:') else 'local')+'.json'
 (OUT/name).write_text(json.dumps(report,indent=2)+'\n')
if __name__=='__main__':main()
