"""Fast isolated touch-flow check; full showroom integration is in tablet_mobile.py."""
import argparse,json,os
from pathlib import Path
from playwright.sync_api import sync_playwright,expect
parser=argparse.ArgumentParser();parser.add_argument('base_url',nargs='?',default='http://127.0.0.1:8014/PortfolioWebsite/');parser.add_argument('--engine',choices=['chromium','webkit'],default='chromium');args=parser.parse_args();base=args.base_url.rstrip('/')+'/'
out=Path(__file__).parent/'artifacts';expect.set_options(timeout=30000)
with sync_playwright() as p:
 launch={'executable_path':'/usr/bin/chromium','args':['--no-sandbox']} if args.engine=='chromium' else {'executable_path':os.environ['SHOWROOM_WEBKIT_EXECUTABLE']} if os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE') else {}
 browser=getattr(p,args.engine).launch(**launch);page=browser.new_page(viewport={'width':390,'height':780},has_touch=True,is_mobile=True);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(base+'showroom/meetab-demo.html',wait_until='networkidle')
 # Standalone fixture supplies only the same mode handshake as the showroom parent.
 page.evaluate("postMessage({showroom:true,kind:'interactive',enabled:true,mobile:true},'*')")
 expect(page.locator('html')).to_have_class('phone-demo');page.locator('#nav [data-go="book"]').tap();expect(page.locator('#p-book')).to_have_class('page on');page.wait_for_timeout(400)
 page.locator('#fTitle').fill('Touch confirmation test');page.locator('#gPlus').tap();expect(page.locator('#gNum')).to_have_text('2')
 page.locator('#fDur [data-v="15"]').tap()
 if page.locator('#fSlots button').count():page.locator('#fSlots button').first.tap()
 expect(page.locator('#bOk')).to_be_enabled();page.locator('#bOk').tap();expect(page.locator('#md')).to_contain_text('დაიჯავშნა');expect(page.locator('#md')).to_have_css('opacity','1');page.wait_for_timeout(450)
 panel=page.locator('#md').bounding_box();button=page.locator('#md .mb').first.bounding_box();assert button['y']>=panel['y'] and button['y']+button['height']<=panel['y']+panel['height']+1
 location='production' if base.startswith('https:') else 'local';page.screenshot(path=str(out/f'demo-confirmation-{args.engine}-{location}.png'))
 page.locator('#md .mb').first.tap();expect(page.locator('#ov')).not_to_have_class('on');assert not errors,errors
 browser.close()
report={'base_url':base,'engine':args.engine,'status':'PASS','physical_device_testing':False,'checks':['unscaled responsive core app','native touch booking submitted','confirmation and acknowledgement both fully visible','native dismissal','no JS errors']}
(out/f'demo-touch-{args.engine}-{location}.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report),flush=True)
