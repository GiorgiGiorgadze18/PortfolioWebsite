"""Final static/responsive checks. Views use Grid to isolate DOM from GPU work."""
from playwright.sync_api import sync_playwright
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json
root=Path(__file__).resolve().parents[1]
out=root/'docs/phase08'
results=[]
with sync_playwright() as p:
 for engine,path in [(p.chromium,'/usr/bin/chromium'),(p.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
  b=engine.launch(executable_path=path)
  for name in ['index','projects','lab','about','contact']:
   page=b.new_page(ignore_https_errors=True,reduced_motion='reduce')
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto('http://127.0.0.1:8054/'+name+'.html'+('?view=grid' if name=='projects' else ''),wait_until='domcontentloaded',timeout=90000)
   page.evaluate('document.fonts.ready')
   for width,height in [(320,568),(360,780),(390,844),(430,932),(768,1024),(1024,768),(1280,800),(1440,900),(1920,1080),(2560,1080),(844,390)]:
    page.set_viewport_size({'width':width,'height':height})
    page.wait_for_timeout(100)
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(engine.name,name,width)
   assert page.locator('h1').count()==1
   if name=='about':
    assert page.locator('.card-info__bg').evaluate_all("es=>es.every(e=>!getComputedStyle(e).backgroundImage.includes('.pdf'))")
    assert page.locator('a[href$=".pdf"]').count()==2
   page.set_viewport_size({'width':390,'height':844})
   page.evaluate("scrollTo({top:0,behavior:'instant'})")
   page.screenshot(path=str(out/f'{name}-{engine.name}-390.png'))
   assert not errors,errors
   results.append([engine.name,name,'11 viewport/height combinations, H1 and page exceptions','PASS'])
   print(results[-1],flush=True);page.close()
  # A catalogue request failure must still leave semantic descriptions usable.
  page=b.new_page(ignore_https_errors=True)
  page.route('**/data/projects.mjs*',lambda r:r.abort())
  page.goto('http://127.0.0.1:8054/projects.html?view=grid',wait_until='domcontentloaded')
  page.locator('#project-tsero summary').click()
  assert page.locator('#project-tsero p').last.is_visible()
  results.append([engine.name,'catalogue network failure: semantic project descriptions','PASS'])
  page.close();b.close()
class Links(HTMLParser):
 def handle_starttag(self,tag,attrs):
  self.urls.extend(v for k,v in attrs if k in ('src','href') and v)
missing=[]
for name in ['index','projects','lab','about','contact','404']:
 parser=Links();parser.urls=[];parser.feed((root/(name+'.html')).read_text())
 for url in parser.urls:
  part=urlsplit(url)
  if part.scheme or not part.path:continue
  path=unquote(part.path).removeprefix('/PortfolioWebsite/')
  if not (root/path).exists():missing.append([name,url])
assert not missing,missing
results.append(['source','local href/src references across six HTML pages','PASS'])
(out/'tests.json').write_text(json.dumps(results,indent=2)+'\n')
