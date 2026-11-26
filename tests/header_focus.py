from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright,expect
server=ThreadingHTTPServer(('127.0.0.1',0),SimpleHTTPRequestHandler)
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
with sync_playwright() as p:
 for engine,path in [(p.chromium,'/usr/bin/chromium'),(p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'] if engine.name=='chromium' else [])
  page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
  baseline=None
  for name in ['index','projects','about','contact','lab']:
   page.goto(base+name+'.html'+('?view=grid' if name=='projects' else ''),wait_until='domcontentloaded')
   page.evaluate('document.fonts.ready')
   value=page.locator('#navbar').evaluate('el=>{const r=el.getBoundingClientRect();const a=el.querySelector(".nav-link");const s=getComputedStyle(a);return [r.height,s.fontFamily,s.fontSize,s.letterSpacing,getComputedStyle(el.querySelector(".navbar__inner")).maxWidth]}')
   if baseline is None:baseline=value
   assert value==baseline,(name,value,baseline)
   page.set_viewport_size({'width':390,'height':844})
   page.locator('#hamburger').click();expect(page.locator('#mobile-menu')).to_have_attribute('aria-hidden','false')
   page.keyboard.press('Escape');expect(page.locator('#mobile-menu')).to_have_attribute('aria-hidden','true')
   page.set_viewport_size({'width':1440,'height':900})
  print(engine.name,'five headers and mobile menus PASS',flush=True)
  if engine.name=='chromium':
   page.route('**/meetab-demo.html*', lambda route: route.fulfill(status=200,body='<html><body>Demo load isolated for focus test</body></html>'))
   page.emulate_media(reduced_motion='no-preference')
   page.goto(base+'projects.html?view=3d',wait_until='domcontentloaded')
   target=page.locator('.device-label[data-id="jbl"]');expect(target).to_be_visible(timeout=60000)
   page.locator('#museum-frame').scroll_into_view_if_needed();target.click(force=True)
   y=page.evaluate('scrollY')
   for _ in range(5):page.mouse.wheel(0,160)
   page.wait_for_timeout(1300)
   assert abs(page.evaluate('scrollY')-y)<2,(y,page.evaluate('scrollY'))
   expect(page.locator('#inspector-title')).to_have_text('MeeTab')
   print('Chromium immediate wheel during tablet opening, no page jump PASS',flush=True)
  b.close()
server.shutdown()
