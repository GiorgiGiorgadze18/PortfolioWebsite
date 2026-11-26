"""Browser checks for view selection and lazy, interactive Lab stages."""
import json
import os
import sys
import time
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:8060/'
evidence = Path(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] != '-' else None
engines = sys.argv[3:] or ['chromium', 'webkit']


def screenshot(page, name):
    if evidence:
        page.screenshot(path=str(evidence / (name + '.png')))


def result(*values):
    print(json.dumps(values), flush=True)


with sync_playwright() as playwright:
    for engine in engines:
        options = {'executable_path': '/workspace/portfolio-work/webkit-launch.sh'}
        if engine == 'chromium':
            options = {'executable_path': '/usr/bin/chromium', 'args': ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']}
        browser = getattr(playwright, engine).launch(**options)
        if not os.environ.get("LAB_ONLY"):
            context = browser.new_context(viewport={'width': 1100, 'height': 660})
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.goto(base + 'projects.html')
            three = page.locator('[data-project-view="3d"]')
            grid = page.locator('[data-project-view="grid"]')
            expect(three).to_be_enabled()
            expect(three).to_have_attribute('aria-pressed', 'true')
            expect(page.locator('#showroom-canvas canvas')).to_have_count(1, timeout=45000)
            for _ in range(2):
                grid.press('Enter')
                expect(page.locator('.museum-section')).to_be_hidden()
                three.press('Enter')
                expect(page.locator('#showroom-canvas canvas')).to_be_visible()
            grid.press('Enter')
            page.goto(base + 'projects.html')
            expect(grid).to_have_attribute('aria-pressed', 'true')
            page.locator('[data-filter="uiux"]').click()
            expect(page.locator('.archive-card:visible')).to_have_count(2)
            page.locator('[data-explore="tsero"]').press('Enter')
            expect(page.locator('.mobile-project-dialog')).to_be_visible()
            page.keyboard.press('Escape')
            page.goto(base + 'projects.html#project/meetab')
            expect(page.locator('.mobile-project-dialog h2')).to_have_text('MeeTab')
            assert not errors, errors
            result(engine, '3D default, repeated toggles, stored preference, filters, keyboard About, deep link', 'PASS')
            context.close()

        context = browser.new_context(reduced_motion='reduce', java_script_enabled=True)
        page = context.new_page()
        page.goto(base + 'projects.html')
        expect(page.locator('[data-project-view="grid"]')).to_have_attribute('aria-pressed', 'true')
        assert page.evaluate("localStorage.getItem('portfolio-project-view')") is None
        page.add_init_script("""const original = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(type, ...args) {
              return type.startsWith('webgl') ? null : original.call(this, type, ...args);
            };""")
        page.goto(base + 'projects.html?view=3d')
        expect(page.locator('#project-view-status')).to_contain_text('3D is unavailable')
        expect(page.locator('[data-project-view="grid"]')).to_have_attribute('aria-pressed', 'true')
        assert page.evaluate("localStorage.getItem('portfolio-project-view')") is None
        page.route('**/data/projects.mjs*', lambda route: route.abort())
        page.goto(base + 'projects.html?view=grid#project/tsero')
        expect(page.locator('#project-tsero p')).to_be_visible()
        result(engine, 'reduced motion, WebGL failure, no automatic preference, module failure details', 'PASS')
        context.close()

        if os.environ.get('PROJECT_ONLY'):
            browser.close()
            continue
        context = browser.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
        page = context.new_page()
        console_errors, requests = [], []
        page.on('pageerror', lambda error: console_errors.append(str(error)))
        page.on('console', lambda message: console_errors.append(message.text) if message.type == 'error' else None)
        page.on('request', lambda request: requests.append(request.url))
        page.add_init_script("""window.labFrames = 0;
          const next = requestAnimationFrame.bind(window);
          window.requestAnimationFrame = callback => next(time => {
            if (callback.name === 'draw') window.labFrames++;
            callback(time);
          });""")
        page.goto(base + 'lab.html')
        expect(page.locator('.experiment-card')).to_have_count(5)
        assert not any('/three.js' in url or '/shader.js' in url for url in requests)
        expect(page.locator('#lab-strength')).to_be_visible()
        page.locator('#lab-strength').press('ArrowRight')
        expect(page.locator('#strength-value')).to_have_text('1.1×')
        dialog = page.locator('#experiment-dialog')
        for index, (name, field) in enumerate([
            ('Shader', 'frequency'), ('Lighting', 'angle'), ('Motion', 'stiffness'),
            ('Particle', 'shape'), ('Spatial', 'layout')
        ]):
            button = page.locator('.experiment-card button').nth(index)
            started = time.perf_counter()
            button.tap()
            expect(dialog.locator('form')).to_be_visible(timeout=25000)
            ready_ms = round((time.perf_counter() - started) * 1000)
            if index in [0, 2, 3]:
                dialog.locator('[data-pause]').click()
            visual = dialog.locator('.experiment-stage')
            before = visual.screenshot()
            control = dialog.locator(f'[name="{field}"]')
            if index < 3:
                control.press('ArrowRight')
                assert control.input_value() != control.get_attribute('value')
            else:
                control.select_option(index=1)
                assert control.input_value() != control.locator('option').first.get_attribute('value')
            page.wait_for_timeout(350)
            assert visual.screenshot() != before, name
            dialog.locator('[type="reset"]').click()
            if index < 3:
                assert control.input_value() == control.get_attribute('value')
            else:
                assert control.input_value() == control.locator('option').first.get_attribute('value')
            if index in [0, 3]:
                page.wait_for_timeout(100)
                initial = visual.screenshot()
                visual.tap(position={'x': 40, 'y': 70})
                assert visual.screenshot() != initial, (name, 'touch')
            if index == 2:
                dialog.locator('[data-replay]').click()
                expect(dialog.locator('[data-pause]')).to_have_attribute('aria-pressed', 'false')
            page.set_viewport_size({'width': 430, 'height': 780})
            assert dialog.evaluate('el => el.scrollWidth <= el.clientWidth')
            screenshot(page, f'after-{engine}-{name.lower()}-430')
            page.keyboard.press('Escape')
            expect(dialog).to_be_hidden()
            expect(dialog.locator('canvas, .spatial-viewport')).to_have_count(0)
            expect(button).to_be_focused()
            page.emulate_media(reduced_motion='reduce')
            button.click()
            expect(dialog.locator('form')).to_be_visible(timeout=25000)
            if index in [0, 2, 3]:
                expect(dialog.locator('[data-pause]')).to_be_hidden()
                stationary = visual.screenshot()
                page.wait_for_timeout(170)
                assert visual.screenshot() == stationary
            dialog.locator('[data-close]').click()
            expect(dialog.locator('canvas, .spatial-viewport')).to_have_count(0)
            page.emulate_media(reduced_motion='no-preference')
            page.set_viewport_size({'width': 390, 'height': 844})
            result(engine, name, 'render, control changes visual, reset, resize, re-open, disposal, reduced motion', 'PASS', ready_ms)
        frames = page.evaluate('labFrames')
        page.wait_for_timeout(180)
        assert page.evaluate('labFrames') == frames
        page.add_init_script("""const context = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function(type, ...args) {
            return type.startsWith('webgl') ? null : context.call(this, type, ...args);
          };""")
        page.reload()
        page.locator('.experiment-card button').first.click()
        expect(dialog.locator('[role="status"]')).to_contain_text('requires WebGL 2')
        expect(dialog.locator('canvas')).to_have_count(0)
        dialog.locator('[data-close]').click()
        result(engine, 'closed stages stop frames, unavailable WebGL presents preview', 'PASS')
        assert not console_errors, console_errors
        context.close()

        page = browser.new_page(reduced_motion='reduce')
        for name in ('index', 'projects', 'lab', 'about', 'contact'):
            page.goto(base + name + '.html' + ('?view=grid' if name == 'projects' else ''))
            for width in (320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560):
                page.set_viewport_size({'width': width, 'height': 900})
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (name, width)
                if width in (390, 1440):
                    screenshot(page, f'after-{engine}-{name}-{width}')
        result(engine, 'five pages × ten viewport widths, no horizontal page overflow', 'PASS')
        browser.close()
