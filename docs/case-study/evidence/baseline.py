"""Phase 0 read-only baseline; no demo interactions or external submissions."""
import json,hashlib,importlib.util,os,platform,subprocess,time,urllib.request,zipfile
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from PIL import Image
from playwright.sync_api import sync_playwright
root=Path.cwd(); out=root/'docs/case-study/evidence'
def write(name,data): (out/name).write_text(json.dumps(data,indent=2)+'\n')
assets=[]
for f in sorted((root/'assets').iterdir()):
 if f.is_file() and any(s in f.name for s in ['jbl','tomford','earthhour','desktop-home','meetab-preview']):
  with Image.open(f) as im: size=im.size;mode=im.mode
  assets.append(dict(path=str(f.relative_to(root)),bytes=f.stat().st_size,width=size[0],height=size[1],mode=mode,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),kind='flattened-source' if f.suffix=='.png' else 'preview'))
archives=[]
for f in root.glob('*.zip'):
 with zipfile.ZipFile(f) as z:
  archives.append(dict(path=f.name,bytes=f.stat().st_size,layered_candidates=[n for n in z.namelist() if n.lower().endswith(('.psd','.ai','.svg','.xcf','.ora'))]))
write('inventory.json',dict(assets=assets,archives=archives,layered_sources=[str(f.relative_to(root)) for f in root.rglob('*') if f.is_file() and f.suffix.lower() in ['.psd','.ai','.xcf','.ora']],explainers=[str(f.relative_to(root)) for f in root.rglob('*explain*')]))
network={}
for url in ['https://giorgigiorgadze18.github.io/PortfolioWebsite/projects.html','https://github.com/GiorgiGiorgadze18/PortfolioWebsite']:
 try:
  with urllib.request.urlopen(url,timeout=20) as r: network[url]=dict(status=r.status,bytes=len(r.read()))
 except Exception as e:network[url]=dict(error=str(e))
write('capabilities.json',dict(python=platform.python_version(),packages={p:bool(importlib.util.find_spec(p)) for p in ['PIL','numpy','cv2','skimage','onnxruntime','torch','rembg','playwright']},node=subprocess.check_output(['node','--version'],text=True).strip(),npm=subprocess.check_output(['npm','--version'],text=True).strip(),gpu_device_present=Path('/dev/dri').exists(),api_env_presence={k:bool(os.environ.get(k)) for k in ['OPENAI_API_KEY','HF_TOKEN','REPLICATE_API_TOKEN']},network=network,image_tool='image_gen__imagegen available; no invocation, no spend authorized',physical_devices='unavailable'))
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet);Thread(target=server.serve_forever,daemon=True).start()
rows=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for w,h in [(1440,900),(1280,720),(820,1180),(390,844)]:
  page=b.new_page(viewport=dict(width=w,height=h),device_scale_factor=1,has_touch=w<=820,is_mobile=w<=820)
  errors=[]; page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script("window.csLCP=0;window.csCLS=0;new PerformanceObserver(l=>{for(const e of l.getEntries())csLCP=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)csCLS+=e.value}).observe({type:'layout-shift',buffered:true});")
  response=page.goto(f'http://127.0.0.1:{server.server_port}/projects.html?view=3d',wait_until='load',timeout=90000)
  page.locator('.device-label[data-id="jbl"]').wait_for(state='visible',timeout=90000)
  page.locator('#museum-frame').scroll_into_view_if_needed();page.wait_for_timeout(1500)
  page.screenshot(path=str(out/f'showroom-{w}.png'))
  sample=page.evaluate("""() => new Promise(resolve=>{let a=[],start=performance.now(),last=start;function tick(t){a.push(t-last);last=t;if(t-start<10000)requestAnimationFrame(tick);else{a.sort((x,y)=>x-y);let c=document.querySelector('#showroom-canvas canvas');let gl=c?.getContext('webgl2');let ext=gl?.getExtension('WEBGL_debug_renderer_info');resolve({samples:a.length,mean_ms:a.reduce((x,y)=>x+y,0)/a.length,p50_ms:a[Math.floor(a.length*.5)],p95_ms:a[Math.floor(a.length*.95)],gpu:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null,heap:performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize}:null})}}requestAnimationFrame(tick)})""")
  data=page.evaluate("""()=>({lcp_ms:window.csLCP,cls:window.csCLS,load_ms:performance.getEntriesByType('navigation')[0].loadEventEnd,transfer_bytes:performance.getEntriesByType('resource').reduce((a,e)=>a+e.transferSize,0),demo_requests:performance.getEntriesByType('resource').filter(e=>/meetab-demo|tsero\\/index/.test(e.name)).map(e=>e.name),overflow:document.documentElement.scrollWidth-innerWidth})""")
  rows.append(dict(viewport=[w,h],http=response.status,errors=errors,frame_sample=sample,**data));write('baseline.json',dict(conditions='Local HTTP; Chromium headless; SwiftShader software GL; DPR1; no network/CPU throttling; rAF cadence is NOT renderer draw-call timing or real GPU FPS; 10 seconds gallery sampling',rows=rows));print(w,'recorded',flush=True)
  if w==1440:
   page.locator('[data-shelf-side="graphics"]').first.click() if page.locator('[data-shelf-side="graphics"]').count() else page.locator('#shelf-switch button').last.click()
   page.wait_for_timeout(1500);page.screenshot(path=str(out/'graphics-1440.png'))
  page.close()
 b.close()
 for name,engine,path in [('webkit',p.webkit,'/workspace/portfolio-work/webkit-launch.sh'),('firefox',p.firefox,None)]:
  try:
   b=engine.launch(**({'executable_path':path} if path else {}));b.close();result='PASS'
  except Exception as e:result=str(e).splitlines()[0]
  write(name+'-probe.json',dict(launch=result))
server.shutdown()
