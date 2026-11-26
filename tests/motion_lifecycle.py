"""Local motion regressions; hidden-state events are simulated, not OS tab switching."""
from pathlib import Path
import json, os, sys
from playwright.sync_api import sync_playwright

base = sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8043/'
out = Path(__file__).resolve().parents[1]/'docs/phase03'
rows=[]
with sync_playwright() as pw:
    for engine,path in [(pw.chromium,'/usr/bin/chromium'), (pw.webkit,'/workspace/portfolio-work/webkit-launch.sh')]:
        browser=engine.launch(executable_path=path)
        for width,height in [(1440,900),(390,844),(844,390)]:
            page=browser.new_page(viewport={'width':width,'height':height},has_touch=width<900,is_mobile=width<900,ignore_https_errors=True)
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.add_init_script("""window.motionFrames=0;
              const raf=window.requestAnimationFrame;
              window.requestAnimationFrame=function(cb){
                return raf.call(window,t=>{if(cb.name==='frame')window.motionFrames++;cb(t)});
              };""")
            page.goto(base+'index.html',wait_until='domcontentloaded')
            page.evaluate('document.fonts.ready')
            # Last card at viewport center must finish, then stop scheduling.
            page.locator('.timeline-entry:last-child .timeline-entry__content').evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})")
            page.evaluate("scrollBy({top:25,behavior:'instant'})")
            page.wait_for_function("document.querySelector('.timeline').style.getPropertyValue('--timeline-progress')==='1.0000'")
            page.wait_for_timeout(1400)
            before=page.evaluate('motionFrames')
            page.wait_for_timeout(500)
            after=page.evaluate('motionFrames')
            assert after-before <= 1,(before,after)
            page.evaluate("scrollTo({top:0,behavior:'instant'})")
            page.wait_for_function("document.querySelector('.timeline').style.getPropertyValue('--timeline-progress')==='0.0000'")
            card=page.locator('.discipline-card').first
            card.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})")
            page.wait_for_function("document.querySelector('.discipline-card').classList.contains('is-in-view')")
            page.wait_for_function("getComputedStyle(document.querySelector('.discipline-card')).opacity==='1'")
            bb=card.bounding_box()
            x=bb['x']+bb['width']*.75;y=max(80,min(height-10,bb['y']+bb['height']*.4))
            page.mouse.move(x,y)
            page.wait_for_function("parseFloat(document.querySelector('.discipline-card').style.getPropertyValue('--holo-ry'))>2")
            if width==390 and engine.name=='chromium':
                page.mouse.move(1,1)
                session=page.context.new_cdp_session(page)
                tx=bb['x']+bb['width']*.3
                ty=max(90,min(height-30,bb['y']+bb['height']*.4))
                for kind,dx in [('touchStart',0),('touchMove',25),('touchMove',60),('touchEnd',0)]:
                    session.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if kind=='touchEnd' else [{'x':tx+dx,'y':ty}]})
                page.wait_for_function("!document.querySelector('.discipline-card').classList.contains('is-tilting')")
            # Pointer leave smoothly settles.
            page.mouse.move(1,1)
            page.wait_for_function("document.querySelector('.discipline-card').style.getPropertyValue('--holo-ry')==='0deg'")
            page.evaluate("""Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
                document.dispatchEvent(new Event('visibilitychange'))""")
            assert card.locator('.discipline-card__surface').evaluate("e=>getComputedStyle(e).animationPlayState")=='paused'
            frozen=page.evaluate('motionFrames');page.wait_for_timeout(180)
            assert page.evaluate('motionFrames')==frozen
            page.evaluate("""Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
                document.dispatchEvent(new Event('visibilitychange'))""")
            assert card.locator('.discipline-card__surface').evaluate("e=>getComputedStyle(e).animationPlayState")=='running'
            page.emulate_media(reduced_motion='reduce')
            page.wait_for_function("getComputedStyle(document.querySelector('.discipline-card__surface')).animationName==='none'")
            page.wait_for_function("!document.querySelector('#experience').classList.contains('experience-scroll-enabled')")
            page.emulate_media(reduced_motion='no-preference')
            page.wait_for_function("document.querySelector('#experience').classList.contains('experience-scroll-enabled')")
            page.evaluate("scrollTo({top:0,behavior:'instant'})")
            page.wait_for_function("getComputedStyle(document.querySelector('.discipline-card__surface')).animationPlayState==='paused'")
            page.goto(base+'contact.html',wait_until='domcontentloaded')
            page.wait_for_timeout(200)
            page.locator('[name=name]').fill('Local check')
            assert not page.locator('#terminal-form').evaluate('e=>e.inert')
            assert not errors,errors
            rows.append({'engine':engine.name,'viewport':[width,height],'settled_timeline_frames_in_500ms':after-before,'reverse':'PASS','pointer_return':'PASS','hidden_simulation':'PASS','offscreen':'PASS','reduced_toggle':'PASS','contact_unblocked':'PASS'})
            print(rows[-1],flush=True)
            page.close()
        browser.close()
out.mkdir(exist_ok=True)
(out/'tests.json').write_text(json.dumps(rows,indent=2)+'\n')
