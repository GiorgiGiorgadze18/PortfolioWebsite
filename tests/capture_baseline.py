"""Capture the live portfolio with fresh Chromium contexts, two viewport presets."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(__file__).resolve().parents[1] / 'docs/audit-00'
url = 'https://giorgigiorgadze18.github.io/PortfolioWebsite/'
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    rows = []
    for width, height in [(1440, 900), (390, 844)]:
        for name in ['index', 'projects', 'about', 'contact']:
            page = browser.new_page(viewport=dict(width=width, height=height), device_scale_factor=1,
                                    is_mobile=width<500, has_touch=width<500, ignore_https_errors=True)
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.add_init_script("""window.lcp=0;window.cls=0;
              new PerformanceObserver(l=>{for(const e of l.getEntries())window.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
              new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.cls+=e.value}).observe({type:'layout-shift',buffered:true});""")
            response = page.goto(url+name+'.html', wait_until='load',timeout=90000)
            page.wait_for_timeout(3000)
            data = page.evaluate(r"""() => {
              const resources=performance.getEntriesByType('resource');
              const same=resources.filter(e=>new URL(e.name).origin===location.origin);
              return {title:document.title,lcp_ms:Math.round(window.lcp),cls:window.cls,
                load_ms:Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd),
                same_origin_resource_transfer_bytes:same.reduce((n,e)=>n+e.transferSize,0),
                resources:resources.length,overflow:document.documentElement.scrollWidth-innerWidth,
                zip_or_demo_requests:resources.filter(e=>/\.zip|meetab-demo|\/tsero\/index/.test(e.name)).map(e=>e.name),
                project_cards:document.querySelector('#project-grid')?.children.length,
                form_inert:document.querySelector('#terminal-form')?.inert}
            }""")
            rows.append(dict(page=name,width=width,height=height,http=response.status,errors=errors,**data))
            page.screenshot(path=out/f'{name}-{width}.png')
            (out/'measurements.json').write_text(json.dumps(rows,indent=2)+'\n')
            print(name,width,data,flush=True)
            page.close()
    browser.close()
