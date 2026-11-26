"""Render the local 1200x630 sharing asset from tools/social-preview.html."""
from pathlib import Path
import sys
from playwright.sync_api import sync_playwright

base = sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8050/'
output = Path(__file__).resolve().parents[1]/'assets/social-preview.png'
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium')
    page = browser.new_page(viewport={'width':1200,'height':630}, device_scale_factor=1)
    page.goto(base.rstrip('/')+'/tools/social-preview.html',wait_until='load')
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(output))
    browser.close()
print(output)
