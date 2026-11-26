"""Validate production-path metadata locally; custom 404 delivery emulates Pages."""
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
from urllib.parse import urlsplit
from urllib.request import urlopen
import json, xml.etree.ElementTree as ET
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root/'docs/phase07'
production='https://giorgigiorgadze18.github.io/PortfolioWebsite/'
class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):super().__init__(*args,directory=str(root),**kwargs)
    def translate_path(self,path):
        if path.startswith('/PortfolioWebsite/'):path=path[len('/PortfolioWebsite'):]
        return super().translate_path(path)
    def send_error(self,code,message=None,explain=None):
        if code==404:
            data=(root/'404.html').read_bytes()
            self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        else:super().send_error(code,message,explain)
    def copyfile(self,source,output):
        try:super().copyfile(source,output)
        except (BrokenPipeError,ConnectionResetError):pass
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler)
Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/PortfolioWebsite/'
rows=[]
try:
    with sync_playwright() as pw:
        for engine,path in [(pw.chromium,'/usr/bin/chromium'),(pw.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
            browser=engine.launch(executable_path=path)
            page=browser.new_page(viewport={'width':390,'height':844},ignore_https_errors=True)
            titles=[]
            for name in ['index','projects','about','contact','lab']:
                response=page.goto(base+name+'.html'+('?view=grid' if name=='projects' else ''),wait_until='domcontentloaded')
                assert response.status==200
                expected=production+('' if name=='index' else name+'.html')
                assert page.locator('link[rel=canonical]').get_attribute('href')==expected
                assert page.locator('meta[property="og:url"]').get_attribute('content')==expected
                assert page.locator('meta[name="twitter:card"]').get_attribute('content')=='summary_large_image'
                titles.append(page.title())
                assert page.locator('meta[property="og:title"]').get_attribute('content')==page.title()
                assert page.locator('meta[property="og:description"]').get_attribute('content')==page.locator('meta[name=description]').get_attribute('content')
                for url in page.locator('meta[property="og:image"],meta[name="twitter:image"]').evaluate_all("es=>es.map(e=>e.content)"):
                    assert url==production+'assets/social-preview.png'
                    assert urlopen(base+url[len(production):]).status==200
                icon=page.locator('link[rel=icon]').get_attribute('href')
                assert urlopen(base+icon[len(production):]).status==200
                for source in page.locator('script[type="application/ld+json"]').all_text_contents():
                    data=json.loads(source)
                    assert data['@context']=='https://schema.org'
                    if data.get('@type')=='ItemList':
                        assert len(data['itemListElement'])==6
                        assert all(item['item']['@type']=='CreativeWork' for item in data['itemListElement'])
                        assert len({item['item']['url'] for item in data['itemListElement']})==6
                    elif data.get('@type')=='WebPage':
                        assert data['mainEntity']['@type']=='CreativeWork'
                        assert data['name']=='Creative Lab | Giorgi Giorgadze'
                    else:
                        person=next(n for n in data['@graph'] if n['@type']=='Person')
                        assert person['name']=='Giorgi Giorgadze'
                rows.append([engine.name,name,'metadata/schema JSON/local production-path asset resolution','PASS'])
            assert len(set(titles))==5
            for slug in ['meetab','jbl']:
                page.goto(base+'projects.html?view=grid#project/'+slug,wait_until='domcontentloaded')
                page.wait_for_selector('dialog[open]')
                assert page.locator('dialog h2').inner_text()=='MeeTab'
            rows.append([engine.name,'MeeTab public slug and legacy ID alias','PASS'])
            response=page.goto(base+'missing/deeper/page.html',wait_until='domcontentloaded')
            assert response.status==404
            assert page.locator('meta[name=robots]').get_attribute('content')=='noindex'
            for href in page.locator('main nav a').evaluate_all('es=>es.map(e=>e.getAttribute("href"))'):
                assert href.startswith('/PortfolioWebsite/')
                assert urlopen(base.split('/PortfolioWebsite/')[0]+href).status==200
            page.screenshot(path=str(out/f'404-{engine.name}.png'))
            rows.append([engine.name,'nested 404, noindex and recovery links','PASS'])
            browser.close()
        browser=pw.chromium.launch(executable_path='/usr/bin/chromium')
        page=browser.new_page(java_script_enabled=False,viewport={'width':390,'height':844},ignore_https_errors=True)
        page.goto(base+'projects.html',wait_until='domcontentloaded')
        assert page.locator('.project-summary').count()==6
        summary=page.locator('#project-tsero')
        summary.locator('summary').click()
        assert summary.locator('p').last.is_visible()
        page.screenshot(path=str(out/'projects-no-js.png'))
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        browser.close()
        rows.append(['Chromium','six semantic project records without JS','PASS'])
    tree=ET.fromstring((root/'sitemap.xml').read_text())
    urls=[e.text for e in tree.findall('{*}url/{*}loc')]
    assert len(urls)==5 and len(set(urls))==5
    assert all(url.startswith(production) and '#' not in url for url in urls)
    for url in urls:assert urlopen(base+url[len(production):]).status==200
    rows.append(['XML/local server','five sitemap URLs','PASS'])
    (out/'seo-tests.json').write_text(json.dumps(rows,indent=2)+'\n')
    print(rows)
finally:server.shutdown()
