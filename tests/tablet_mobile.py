"""Static phone preview and interactive desktop tablet.
Run with --phone-only, --desktop-only, or --engine webkit --phone-only.
"""
from pathlib import Path
import argparse,json,os,re
from playwright.sync_api import sync_playwright,expect
OUT=Path(os.environ.get('SHOWROOM_TEST_OUTPUT', Path(__file__).parent/'artifacts'))

def capture(page, out, name):
 if os.environ.get('SHOWROOM_TEST_SCREENSHOTS'):
  page.screenshot(path=str(out/name))

def outer_outline(page):
 data=page.evaluate('''()=>{
  const outline=document.querySelector('#tablet-outline'),screen=document.querySelector('#screen-portal');
  function quad(el){const m=new DOMMatrix(el.style.transform==='none'?'':el.style.transform),w=parseFloat(el.style.width),h=parseFloat(el.style.height);return [[0,0],[w,0],[w,h],[0,h]].map(([x,y])=>{const p=m.transformPoint(new DOMPoint(x,y));return [p.x/p.w+(parseFloat(el.style.left)||0),p.y/p.w+(parseFloat(el.style.top)||0)]});}
  const stroke=outline.querySelector('.outline-stroke'),box=stroke.getBBox(),inner=quad(screen);
  const outer=[[box.x,box.y],[box.x+box.width,box.y],[box.x+box.width,box.y+box.height],[box.x,box.y+box.height]];
  const center=q=>q.reduce((a,p)=>[a[0]+p[0]/4,a[1]+p[1]/4],[0,0]);
  const [xs,ys]=[inner.map(p=>p[0]),inner.map(p=>p[1])];
  const gaps=[Math.min(...xs)-box.x,Math.min(...ys)-box.y,box.x+box.width-Math.max(...xs),box.y+box.height-Math.max(...ys)];
  const frameBox=outline.closest('#museum-frame').getBoundingClientRect(),portalBox=screen.getBoundingClientRect();
  const portalOffset=[portalBox.left-frameBox.left,portalBox.top-frameBox.top];
  return {portalOffset,outsidePortal:!screen.contains(outline),visible:!outline.hasAttribute('hidden'),outer,inner,gaps,centerDistance:Math.hypot(...center(outer).map((x,i)=>x-center(inner)[i])),fill:getComputedStyle(stroke).fill,stroke:getComputedStyle(stroke).stroke};
 }''')
 assert data['outsidePortal'] and data['visible'] and data['fill']=='none',data
 assert data['centerDistance']<6,data
 assert all(2<gap<85 for gap in data['gaps']),data
 return data

def watch_sweep(page):
 page.add_init_script("""window.sweeps=[];
 for(const event of ['animationstart','animationiteration','animationend']){
  document.addEventListener(event,e=>{
   if(e.animationName==='tabletSignal'&&e.target.matches('.outline-stroke')&&e.target.closest('.is-demo'))window.sweeps.push(event);
  });
 }""")

def check_sweep(page, runs=1):
 runner=page.locator('#tablet-outline .outline-stroke')
 expect(runner).to_have_css('animation-name','tabletSignal')
 expect(runner).to_have_css('animation-iteration-count','1')
 page.wait_for_function("n=>sweeps.filter(event=>event==='animationend').length===n",arg=runs,timeout=60000)
 assert page.evaluate('sweeps')==['animationstart','animationend']*runs
 expect(runner).to_have_css('opacity','0')

def check_phone_panel(page):
    page.wait_for_function("""() => {
        const r = selector => document.querySelector(selector).getBoundingClientRect();
        const toolbar = r('#shelf-switch');
        const stage = r('#museum-frame');
        const panel = r('#project-inspector');
        const year = r('#inspector-year');
        const artwork = r('#inspector-open');
        const description = r('.inspector-scroll');
        return toolbar.bottom < stage.top &&
            year.top >= panel.top && year.bottom <= panel.bottom &&
            artwork.top >= panel.top && artwork.bottom <= panel.bottom &&
            artwork.height >= 44 && description.top >= year.bottom &&
            description.bottom <= artwork.top && artwork.bottom <= innerHeight + 2;
    }""", timeout=60000)
    expect(page.locator('#inspector-year')).to_have_text('2026')
    expect(page.locator('#inspector-open')).to_be_visible()
    expect(page.locator('.inspector-scroll')).to_have_css('overflow-y','auto')

def observe(page):
 page.evaluate('''()=>{
  window.metrics={bufferWrites:0};window.canvasDescriptors={};
  for(const key of ['width','height']){const d=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,key);canvasDescriptors[key]=d;Object.defineProperty(HTMLCanvasElement.prototype,key,{...d,set(v){metrics.bufferWrites++;d.set.call(this,v)}})}
 }''')

def check_phone(browser,base,out,engine):
 c=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
 c.set_default_timeout(90000);page=c.new_page();errors=[];failed=[];requests=[]
 page.on('pageerror',lambda e:errors.append(str(e)));page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 else None);page.on('request',lambda r:requests.append(r.url))
 watch_sweep(page)
 page.goto(base+'projects.html',wait_until='networkidle');page.locator('#museum-frame').scroll_into_view_if_needed()
 expect(page.locator('#showroom-canvas canvas')).to_be_visible();expect(page.locator('#stage-fallback')).not_to_be_visible()
 assert not any('meetab-demo.html' in u for u in requests)
 expect(page.locator('.archive-card')).to_have_count(5)
 for target in page.locator('.device-label:visible').all():assert target.bounding_box()['height']>=44
 page.wait_for_timeout(900);capture(page,out,f'tablet-{engine}-gallery.png')
 print('Gallery ready',engine,flush=True)
 page.locator('.device-label[data-id="jbl"]').tap()
 button=page.locator('#try-preview')
 portal=page.locator('#screen-portal')
 notice=page.locator('#desktop-demo-notice')
 workspace=page.locator('.demo-workspace')
 expect(button).to_be_enabled()
 expect(button).to_be_visible()
 expect(notice).to_be_hidden()
 expect(portal).to_be_hidden()
 assert any(u.endswith('/meetab-desktop-home.webp') for u in requests)
 capture(page,out,f'tablet-{engine}-focus.png')
 observe(page)
 page.evaluate("()=>{for(let i=0;i<10;i++)dispatchEvent(new Event('resize'))}")
 page.wait_for_timeout(400)
 unchanged=page.evaluate('metrics.bufferWrites')
 assert unchanged==0,unchanged
 button.tap()
 expect(notice).to_be_visible()
 expect(workspace).to_be_visible()
 expect(workspace).to_contain_text('Try the interactive demo on a computer.')
 expect(workspace).to_contain_text('PREVIEW ACTIVE')
 expect(notice).to_have_css('background-color','rgba(0, 0, 0, 0.55)')
 expect(notice).to_have_css('color','rgb(255, 255, 255)')
 expect(portal).to_have_css('transform','none')
 expect(portal).to_have_css('pointer-events','none')
 expect(button).to_have_attribute('aria-pressed','true')
 assert page.locator('dialog[open]').count()==0
 alignment=outer_outline(page)
 check_sweep(page)
 capture(page,out,f'tablet-{engine}-desktop-notice.png')
 sizes=[]
 for width,height in [(320,568),(360,800),(430,932),(844,390),(390,844)]:
  page.set_viewport_size({'width':width,'height':height})
  page.wait_for_timeout(300)
  expect(notice).to_be_visible()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
  outer_outline(page)
  page.locator('#inspector-open').scroll_into_view_if_needed()
  check_phone_panel(page)
  screen=portal.bounding_box()
  text=notice.locator('strong').bounding_box()
  assert text['width']<=screen['width'] and text['height']<screen['height'],(screen,text)
  sizes.append([width,height])
 button.tap()
 expect(notice).to_be_hidden()
 expect(portal).to_be_hidden()
 expect(button).to_have_attribute('aria-pressed','false')
 button.tap()
 expect(notice).to_be_visible()
 check_sweep(page, runs=2)
 assert len(page.frames)==1
 assert not any('meetab-demo.html' in u for u in requests)
 button.tap()
 page.locator('#inspector-close').tap()
 expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
 page.locator('[data-explore="jbl-artwork"]').tap();expect(page.locator('dialog.mobile-project-dialog')).to_be_visible();page.locator('.mobile-dialog-close').tap()
 if engine=='chromium':
  page.locator('#focus-canvas canvas').evaluate("c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()")
  expect(page.locator('#stage-fallback')).to_be_visible()
  page.locator('[data-explore="tsero"]').tap();expect(page.locator('.mobile-project-dialog')).to_be_visible()
 assert not errors,errors;assert not failed,failed
 assert not [u for u in requests if not u.startswith((base,'data:','blob:'))]
 result={'engine':engine,'status':'PASS','profile':'phone DPR 2','responsive_sizes':sizes,'unchangedResizeBufferWrites':unchanged,'outline':alignment,'checks':['desktop home screenshot loaded','Try Now opens the HUD and desktop notice','white text at 55% black opacity','notice and tablet stay aligned after resizing and rotation','no live app document requested or mounted','one neon sweep per entry','close and reopen','no errors or failed/external requests']}
 c.close();return result

def check_desktop(browser,base,out,engine):
 c=browser.new_context(viewport={'width':1280,'height':1000});c.set_default_timeout(90000);page=c.new_page();errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)));watch_sweep(page);page.goto(base+'projects.html',wait_until='networkidle')
 page.locator('[data-explore="jbl"]').click();expect(page.locator('#try-preview')).to_be_visible();expect(page.locator('#tablet-outline')).to_have_attribute('data-project','jbl');expect(page.locator('#try-preview')).to_be_enabled()
 print('Desktop focus ready',engine,flush=True)
 page.locator('#try-preview').click();expect(page.locator('#screen-portal')).to_be_visible()
 expect(page.locator('#desktop-demo-notice')).to_be_hidden()
 expect(page.locator('#screen-portal iframe')).to_be_visible()
 check_sweep(page)
 active=outer_outline(page)
 xs,ys=zip(*active['inner']);x,y=active['portalOffset']
 assert abs(x-min(xs))<2 and abs(y-min(ys))<2,active
 box=page.locator('#screen-portal').bounding_box();page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.wheel(0,-100);page.wait_for_timeout(800);zoomed=outer_outline(page);assert active['outer']!=zoomed['outer']
 observe(page);page.evaluate("()=>{for(let i=0;i<10;i++)dispatchEvent(new Event('resize'))}");page.wait_for_timeout(400);assert page.evaluate('metrics.bufferWrites')==0
 app=page.frame_locator('#screen-portal iframe');app.locator('#nav [data-go="book"]').focus();app.locator('#nav [data-go="book"]').press('Enter');expect(app.locator('#p-book')).to_have_class('page on')
 page.wait_for_timeout(850);capture(page,out,f'tablet-{engine}-desktop-neon.png')
 page.emulate_media(reduced_motion='reduce');expect(page.locator('#tablet-outline .outline-stroke')).to_have_css('animation-name','none')
 page.locator('#try-preview').click();page.locator('#reset-view').click();expect(page.locator('#tablet-outline')).not_to_be_visible()
 for project,name in [('tsero','Tsero App'),('tomford','Tom Ford Tobacco Vanille'),('earthhour','Earth Hour')]:
  page.locator(f'[data-explore="{project}"]').click();expect(page.locator('#inspector-title')).to_contain_text(name)
  page.locator('#inspector-close').click();expect(page.locator('#device-labels')).not_to_have_class(re.compile('is-hidden'))
 assert not errors,errors
 c.close();return {'engine':engine,'profile':'desktop 1280','status':'PASS','outline':active,'checks':['one sweep per entry with no lingering light','projection follows rotation and zoom','app remains inside tablet on desktop','booking navigation','zero redundant buffer resizes','reduced motion suppresses the sweep','clean gallery return']}

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
