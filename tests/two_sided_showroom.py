"""Exercise both showroom faces in desktop and phone browser emulation."""
import argparse
import os

from playwright.sync_api import expect, sync_playwright


def expect_face(stage, side, projects):
    expect(stage).to_have_attribute('data-shelf', side)
    expect(stage.locator(f'[data-shelf-side="{side}"]')).to_have_attribute('aria-pressed', 'true')
    labels = stage.locator('.device-label:visible')
    expect(labels).to_have_count(len(projects))
    assert set(labels.evaluate_all('(labels) => labels.map(label => label.dataset.id)')) == set(projects)


def desktop(browser, url):
    page = browser.new_page(viewport={'width': 1280, 'height': 1000})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(url)
    stage = page.locator('#museum-frame')
    graphics = stage.get_by_role('button', name='Graphic Design', exact=True)
    titles = {
        'tomford': 'Tom Ford Tobacco Vanille',
        'earthhour': 'Earth Hour Campaign Poster',
        'jbl-artwork': 'JBL Premium Audio Campaign',
    }
    expect_face(stage, 'apps', ('tsero', 'jbl'))
    # Read the live DOM in the same task as the click to catch the animation state.
    assert graphics.evaluate("""button => {
        button.click();
        return button.getAttribute('aria-disabled') === 'true' &&
            button.closest('#museum-frame').dataset.shelf === 'apps' &&
            document.querySelector('#device-labels').inert;
    }""")
    expect_face(stage, 'graphics', titles)
    page.emulate_media(reduced_motion='reduce')
    for project, title in titles.items():
        stage.locator(f'.device-label[data-id="{project}"]').click()
        expect(page.locator('#inspector-title')).to_have_text(title)
        expect(page.locator('#project-inspector')).to_have_attribute('aria-hidden', 'false')
        expect(page.locator('#try-preview')).to_be_hidden()
        page.locator('#reset-view').click()
        expect_face(stage, 'graphics', titles)

    page.locator('[data-explore="tsero"]').click()
    expect(stage).to_have_attribute('data-shelf', 'apps')
    button = page.locator('#try-preview')
    expect(button).to_be_visible()
    button.click()
    expect(page.frame_locator('iframe[title="Tsero App interactive demo"]').locator('#screen')).to_have_class('screen page-home')
    graphics.click()
    expect_face(stage, 'graphics', titles)
    expect(page.locator('#screen-portal')).to_be_hidden()

    page.locator('[data-explore="jbl"]').click()
    expect(stage).to_have_attribute('data-shelf', 'apps')
    expect(button).to_be_visible()
    expect(button).to_be_enabled()
    button.click()
    meetab = page.locator('iframe[title="MeeTab interactive demo"]')
    expect(meetab).to_be_visible()
    expect(meetab.content_frame.locator('#nav')).to_be_attached()
    assert not errors, errors
    page.close()


def phone(browser, url):
    page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True,
                            has_touch=True, reduced_motion='reduce')
    requests, errors = [], []
    page.on('request', lambda request: requests.append(request.url))
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(url)
    stage = page.locator('#museum-frame')
    apps = stage.get_by_role('button', name='UI / UX', exact=True)
    graphics = stage.get_by_role('button', name='Graphic Design', exact=True)
    expect_face(stage, 'apps', ('tsero', 'jbl'))
    assert graphics.bounding_box()['height'] >= 44
    graphics.tap()
    expect_face(stage, 'graphics', ('tomford', 'earthhour', 'jbl-artwork'))
    stage.locator('.device-label[data-id="earthhour"]').tap()
    expect(page.locator('#project-inspector')).to_have_attribute('aria-hidden', 'false')
    expect(page.locator('#try-preview')).to_be_hidden()
    page.locator('#reset-view').tap()
    page.set_viewport_size({'width': 844, 'height': 390})
    apps.tap()
    expect_face(stage, 'apps', ('tsero', 'jbl'))
    for project in ('tsero', 'jbl'):
        stage.locator(f'.device-label[data-id="{project}"]').tap()
        page.locator('#try-preview').tap()
        notice = page.locator('#desktop-demo-notice')
        expect(notice).to_be_visible()
        expect(notice).to_have_css('background-color', 'rgba(0, 0, 0, 0.55)')
        page.locator('#reset-view').tap()
    assert not any('/showroom/tsero/' in url or 'meetab-demo.html' in url for url in requests), requests
    assert not errors, errors
    page.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('base', nargs='?', default='http://127.0.0.1:8014/PortfolioWebsite/')
    parser.add_argument('--engine', choices=('chromium', 'webkit'), default='chromium')
    args = parser.parse_args()
    url = args.base.rstrip('/') + '/projects.html'
    expect.set_options(timeout=60000)
    with sync_playwright() as playwright:
        if args.engine == 'chromium':
            browser = playwright.chromium.launch(
                executable_path='/usr/bin/chromium',
                args=['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
            )
        else:
            executable = os.environ.get('SHOWROOM_WEBKIT_EXECUTABLE')
            browser = playwright.webkit.launch(**({'executable_path': executable} if executable else {}))
        desktop(browser, url)
        print(args.engine, 'desktop showroom and embedded apps passed', flush=True)
        phone(browser, url)
        print(args.engine, 'phone showroom and on-device notices passed', flush=True)
        browser.close()


if __name__ == '__main__':
    main()
