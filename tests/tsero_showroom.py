"""Verify Tsero through the showroom. Run with --engine webkit or --engine chromium."""
import argparse
import json
import os
import re
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


def open_tsero(page, base, touch=False):
    page.goto(base + 'projects.html', wait_until='networkidle', timeout=90000)
    exhibit = page.locator('[data-explore="tsero"]')
    exhibit.tap() if touch else exhibit.click()
    action = page.locator('[data-open-demo]')
    action.tap() if touch else action.click()
    expect(page.locator('#inspector-title')).to_have_text('Tsero App')
    button = page.locator('#try-preview')
    expect(button).to_be_visible()
    expect(button).to_be_enabled()
    return button


def mobile(browser, base, output):
    page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True,
                            has_touch=True, device_scale_factor=2, reduced_motion='reduce')
    page.set_default_timeout(60000)
    requests = []
    errors = []
    page.on('request', lambda request: requests.append(request.url))
    page.on('pageerror', lambda error: errors.append(str(error)))
    button = open_tsero(page, base, touch=True)
    notice = page.locator('#desktop-demo-notice')
    expect(notice).to_be_hidden()
    assert any(url.endswith('/assets/tsero-desktop-home.webp') for url in requests)
    assert page.locator('.archive-card').filter(has=page.locator('[data-explore="tsero"]')).locator('img').evaluate('img => img.src').endswith('/assets/project-tsero-preview.webp')
    button.tap()
    expect(notice).to_be_visible()
    expect(notice).to_have_text('Try the interactive demo on a computer.')
    expect(notice).to_have_css('background-color', 'rgba(0, 0, 0, 0.55)')
    expect(notice).to_have_css('color', 'rgb(255, 255, 255)')
    expect(page.locator('.demo-workspace')).to_be_visible()
    expect(page.locator('#demo-status')).to_have_text('PREVIEW ACTIVE')
    expect(page.locator('#tablet-outline')).to_have_attribute('data-project', 'tsero')
    expect(page.locator('#screen-portal')).to_have_css('transform', 'none')
    page.wait_for_function("""() => {
        const stage = document.querySelector('#museum-frame').getBoundingClientRect();
        const portal = document.querySelector('#screen-portal').getBoundingClientRect();
        return Math.abs(stage.x + stage.width / 2 - portal.x - portal.width / 2) < 4 &&
            portal.y > stage.y + 10;
    }""")
    if os.environ.get('SHOWROOM_TEST_SCREENSHOTS'):
        page.wait_for_timeout(400)
        page.screenshot(path=output / 'tsero-mobile-notice.png')
    page.set_viewport_size({'width': 844, 'height': 390})
    expect(notice).to_be_visible()
    expect(page.locator('#screen-portal')).to_have_css('pointer-events', 'none')
    assert not any('/showroom/tsero/' in url or 'meetab-demo.html' in url for url in requests)
    assert len(page.frames) == 1
    assert not errors, errors
    page.close()
    return 'static desktop screenshot, original poster, HUD and 55% notice, portrait and landscape, zero live demo requests'


def desktop(browser, base, output):
    page = browser.new_page(viewport={'width': 1280, 'height': 1000}, reduced_motion='reduce')
    page.set_default_timeout(90000)
    responses, errors = {}, []
    page.on('response', lambda response: responses.update({response.url: response.status}))
    page.on('pageerror', lambda error: errors.append(str(error)))
    button = open_tsero(page, base)
    expect(page.locator('iframe[title="Tsero App interactive demo"]')).to_have_count(0)
    button.click()
    iframe = page.locator('iframe[title="Tsero App interactive demo"]')
    expect(iframe).to_be_visible()
    expect(page.locator('#desktop-demo-notice')).to_be_hidden()
    app = iframe.content_frame
    screen = app.locator('#screen')
    expect(screen).to_have_class('screen page-home')
    assert screen.evaluate('() => [innerWidth, innerHeight]') == [375, 811]
    expect(app.locator('#app')).to_have_css('width', '375px')
    assert abs(app.locator('#app').evaluate('el=>el.getBoundingClientRect().height') - 811) < 0.1
    button_box = button.bounding_box()
    screen_box = iframe.bounding_box()
    assert abs(button_box['x'] + button_box['width']/2 - screen_box['x'] - screen_box['width']/2) < 8
    assert button_box['y'] >= screen_box['y'] + screen_box['height'] - 2
    expect(page.locator('#tablet-outline')).to_have_attribute('data-project', 'tsero')
    print('Tsero home visible at 375×811', flush=True)
    if os.environ.get('SHOWROOM_TEST_SCREENSHOTS'):
        page.wait_for_timeout(500)
        page.screenshot(path=output / 'tsero-desktop-demo.png')
    app.get_by_role('button', name='Food menu offer').click()
    expect(screen).to_have_class('screen page-restaurant')
    screen.locator('.product [data-action="quantity"]').first.click()
    app.get_by_role('button', name='Save', exact=True).click()
    app.get_by_role('button', name='Open cart').click()
    expect(app.locator('.cart-line')).to_have_count(1)
    print('Menu and cart ready', flush=True)
    origin = screen.evaluate('performance.timeOrigin')
    button.click()
    expect(iframe).to_be_hidden()
    button.click()
    expect(iframe).to_be_visible()
    assert screen.evaluate('performance.timeOrigin') == origin
    expect(app.locator('.cart-line')).to_have_count(1)
    thumb = app.locator('.slider-thumb')
    thumb.scroll_into_view_if_needed()
    # Project the app's local slider track through the same perspective as the phone.
    points = page.locator('#screen-portal').evaluate("""portal => {
        const matrix = new DOMMatrix(getComputedStyle(portal).transform);
        const stage = portal.offsetParent.getBoundingClientRect();
        const thumb = portal.querySelector('iframe:not([hidden])').contentDocument.querySelector('.slider-thumb');
        const box = thumb.getBoundingClientRect();
        const track = thumb.parentNode;
        const travel = track.clientWidth - thumb.offsetWidth - thumb.offsetLeft * 2;
        return [0, travel].map(dx => {
            const point = matrix.transformPoint(new DOMPoint(box.x + box.width / 2 + dx, box.y + box.height / 2));
            return [stage.x + portal.offsetParent.clientLeft + point.x / point.w,
                stage.y + portal.offsetParent.clientTop + point.y / point.w];
        });
    }""")
    page.mouse.move(*points[0])
    page.mouse.down()
    page.mouse.move(*points[1], steps=8)
    page.mouse.up()
    expect(screen).to_have_class('screen page-payment')
    app.get_by_label('Delivery address').fill('Portfolio test address')
    app.get_by_role('button', name='Pay', exact=True).click()
    dialog = app.get_by_role('dialog', name='Confirm demo payment')
    expect(dialog).to_contain_text('No money will be charged.')
    dialog.locator('.confirm-action').click()
    expect(screen).to_have_class('screen page-success')
    app.get_by_role('button', name='Continue', exact=True).click()
    expect(app.locator('canvas[aria-label="Offline Tbilisi map"]')).to_be_visible()
    page.wait_for_function("""() => document.querySelector('iframe[title="Tsero App interactive demo"]')
        .contentWindow.performance.getEntriesByType('resource')
        .some(entry => entry.name.endsWith('/assets/maps/tbilisi.tsv'))""")
    assert any(url.endswith('/assets/maps/tbilisi.tsv') and status == 200 for url, status in responses.items())
    print('Simulated payment and map loaded', flush=True)
    button.click()
    page.locator('#reset-view').click()
    page.locator('[data-explore="jbl"]').click()
    page.locator('[data-open-demo]').click()
    expect(page.locator('#inspector-title')).to_have_text('MeeTab')
    expect(button).to_be_visible()
    expect(button).to_be_enabled()
    button.click()
    meetab = page.locator('iframe[title="MeeTab interactive demo"]')
    expect(meetab).to_be_visible()
    expect(iframe).to_be_hidden()
    expect(page.locator('#tablet-outline')).to_have_attribute('data-project', 'jbl')
    meetab.content_frame.locator('#nav button[data-go="book"]').press('Enter')
    expect(meetab.content_frame.locator('.page.on')).to_have_attribute('id', re.compile('book', re.I))
    assert not errors, errors
    assert not [(url, status) for url, status in responses.items() if status >= 400]
    page.close()
    return '375×811 live home, mouse ordering flow and checkout drag, cart retention, demo payment, bundled map, MeeTab session isolation'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('base', nargs='?', default='http://127.0.0.1:8014/PortfolioWebsite/')
    parser.add_argument('--engine', choices=['webkit', 'chromium'], default='chromium')
    parser.add_argument('--mode', choices=['phone', 'desktop', 'both'], default='both')
    args = parser.parse_args()
    base = args.base.rstrip('/') + '/'
    output = Path(os.environ.get('SHOWROOM_TEST_OUTPUT', 'tests/artifacts/v0.15.0'))
    output.mkdir(parents=True, exist_ok=True)
    expect.set_options(timeout=60000)
    with sync_playwright() as pw:
        if args.engine == 'chromium':
            browser = pw.chromium.launch(executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'])
        else:
            webkit_path = os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE')
            browser = pw.webkit.launch(**({'executable_path': webkit_path} if webkit_path else {}))
        passed = {}
        for name, check in [('phone', mobile), ('desktop', desktop)]:
            if args.mode in {name, 'both'}:
                passed[name] = check(browser, base, output)
                print(args.engine, name, 'PASS', flush=True)
        browser.close()
    report = {'base_url': base, 'engine': args.engine, 'physical_device_testing': False, 'passed': passed}
    (output / f'tsero-{args.engine}-{args.mode}.json').write_text(json.dumps(report, indent=2) + '\n')


if __name__ == '__main__':
    main()
