from playwright.sync_api import sync_playwright,expect
import json,sys
base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8014/PortfolioWebsite/'
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 c=b.new_context(viewport={'width':1280,'height':900});c.add_init_script("const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(t,...args){return /^webgl/.test(t)?null:get.call(this,t,...args)}")
 page=c.new_page();page.goto(base+'projects.html');expect(page.locator('#project-view-status')).to_contain_text('3D is unavailable');page.locator('[data-explore="tsero"]').click();expect(page.locator('.mobile-project-dialog')).to_be_visible();c.close()
 c=b.new_context(java_script_enabled=False,viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 page=c.new_page();page.goto(base+'projects.html');page.locator('#project-jbl-artwork summary').click();expect(page.locator('#project-jbl-artwork a[href="assets/project-jbl.png"]')).to_be_visible();expect(page.locator('#stage-enter')).not_to_be_visible();expect(page.locator('.museum-section')).to_be_hidden();page.locator('#project-tsero summary').click();expect(page.locator('#project-tsero p')).to_be_visible();c.close();b.close()
 print(json.dumps({'base_url':base,'noWebGLDetails':'PASS','noJSArtwork':'PASS','physical_device_testing':False}),flush=True)
