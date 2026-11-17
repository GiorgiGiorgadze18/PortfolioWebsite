# Phone 3D verification — 2026-11-17

The original v0.14 integration deliberately stopped 3D initialization at 600 px, hid the phone inspector, and forced the collection fallback to display. The phone regression now requires a real WebGL canvas, a hidden fallback, touch project selection, and interactive MeeTab navigation.

## Phone results

Chromium and WebKit passed at 360, 390, 412, and 600 px. The checks cover:

- Real 3D startup and four touch controls, each at least 44 px high.
- A bottom project inspector that fits the viewport width and the showroom frame.
- MeeTab loading on selection, readiness before interaction, and a native touch on its booking navigation.
- Retained app/iframe state after preview exit and reentry at 390 px.
- Portrait/landscape resizing at 390 px in both engines, and two-finger scene zoom in Chromium.
- Original JBL artwork access, mobile navigation, no horizontal overflow, no JavaScript errors or failed resource requests.

Chromium's child-frame locator coordinates omit the parent scale in some transformed-frame cases. The test sends native touch input at the app button's actual rendered position, calculated from the observed frame and element rectangles. It does not invoke the app's click handler programmatically.

[Chromium results](../tests/artifacts/mobile-chromium-local.json) · [WebKit results](../tests/artifacts/mobile-webkit-local.json)

[Chrome phone gallery](../tests/artifacts/phone-chromium-gallery.png) · [Chrome phone demo](../tests/artifacts/phone-chromium-demo.png) · [WebKit phone gallery](../tests/artifacts/phone-webkit-gallery.png) · [WebKit phone demo](../tests/artifacts/phone-webkit-demo.png)

A phone with JavaScript disabled still displays the collection fallback and original artwork links. Viewport width does not trigger the fallback when graphics are available.

These runs use touch/viewport emulation and software graphics in Chromium and WebKit. They are not physical iPhone/Android tests or measured hardware performance results.

## Desktop and fallback regression

The desktop 1440 px smoke check passed 3D startup, filters, preview exit/reentry, retained app state, keyboard toggles, reduced motion, gallery cleanup, navigation and resource checks. The same run also passed unavailable-WebGL project details and the JavaScript-disabled phone fallback.

[Desktop/fallback results](../tests/artifacts/desktop-results.json)

## Source and backup

The supplied ZIP remains unchanged, and the exact embedded MeeTab document is retained. Phone behavior is implemented in the portfolio wrapper. The pre-fix published version is preserved on `backup/pre-mobile-showroom-2026-11-17`; the original full old-site backup remains on `backup/archive-pre-showroom-2026-11-16`.

The November 16 baseline used a collection-only phone fallback. Its reports and phone screenshot are retained under [dated history](../tests/artifacts/history/2026-11-16/).

[Source checksums](../tests/artifacts/source-sha256.json) · [Run, deploy and restore instructions](SHOWROOM.md)

## Public-site verification

The published runtime at `454911623ee7ccf35643cd8518524eac786dd831` passed the 390 px phone smoke check in both Chromium and WebKit: actual 3D, touch booking navigation, exit/reentry state, portrait/landscape resizing, mobile navigation and clean JavaScript/network checks. Chromium also passed native two-finger zoom. All 22 deployed showroom source files matched the tested SHA-256 manifest. Later evidence-only commits retain the same runtime checksums.

[Public Chrome phone results](../tests/artifacts/mobile-chromium-production.json) · [Public WebKit phone results](../tests/artifacts/mobile-webkit-production.json) · [Deployment report](../tests/artifacts/production-deployment.json)
