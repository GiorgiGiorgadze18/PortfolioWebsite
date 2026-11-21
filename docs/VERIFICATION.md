# v0.14.5 — static phone preview

The phone regression checks the actual desktop home screenshot request, the existing HUD, the 55% black overlay with white text, the one-pass neon, exit and reopening, and alignment through portrait and landscape sizes. It verifies that a fresh touch visit never downloads or mounts the live MeeTab app. The desktop check exercises the live booking navigation, outer neon and reduced motion.

[Mobile preview screenshot](../tests/artifacts/v0.14.5/mobile-notice.png) · [WebKit phone report](../tests/artifacts/v0.14.5/webkit-phone.json) · [Rules for future apps](../AGENTS.md)

## Historical v0.14.4 measurements

The regression verifies that the tablet outline appears on Try Now, completes one lap and fades out. It checks the in-tablet iframe through orientation changes, native touch booking and state retention after reopening. The desktop run checks projection through zoom and reduced motion. The phone runs use browser emulation. [Chromium phone results](../tests/artifacts/v0.14.4/chromium-phone.json) · [WebKit phone results](../tests/artifacts/v0.14.4/webkit-phone.json) · [Booking confirmation inside the tablet](../tests/artifacts/v0.14.4/embedded-booking.png).

## Historical v0.14.3 measurements

The earlier checks missed the reported bugs: they asserted an outline inside the screen and mapped a tap coordinate manually, while the user needed an outer-body halo and an app that stayed usable during touch interaction. Those historical reports remain below and do not establish that the visual defects were solved.

Current regression: `python3 tests/tablet_mobile.py [base URL] --phone-only` or `--desktop-only`; add `--engine webkit` for the WebKit phone profile. It uses normal locator touch input in the untransformed app, completes and confirms a local booking, checks all four outline corners outside the display, exercises responsive widths/orientation and preserves the same iframe/time origin and form state. It also counts real WebGL draw calls while the phone demo covers the scene and canvas-buffer writes for unchanged resize notifications.

Screenshots are inspected for cover distortion, the halo's external gap, header/form overlap and usable scrolling. Browser emulation and software rendering do not establish physical-phone frame rate, heat, battery use or actual iOS Safari/Android Chrome behavior. Physical-device validation remains outstanding.

Current local reports: [Chromium phone](../tests/artifacts/tablet-chromium-local.json), [WebKit phone](../tests/artifacts/tablet-webkit-local.json), [Chromium desktop](../tests/artifacts/tablet-chromium-desktop-local.json), [fallbacks](../tests/artifacts/fallback-v0143-local.json). The final confirmation-layout adjustment was also tested independently in [Chromium](../tests/artifacts/demo-touch-chromium-local.json) and [WebKit](../tests/artifacts/demo-touch-webkit-local.json), requiring the acknowledgement button to fit inside its panel.

Visual evidence: [external tablet halo](../tests/artifacts/tablet-chromium-focus.png), [responsive booking form](../tests/artifacts/tablet-webkit-mobile-booking.png), [visible confirmation controls](../tests/artifacts/demo-confirmation-webkit-local.png). Full integration phone profiles use 390 px / DPR 2 and exercise 360×800, 430×932, 844×390, then 390×844. Ten unchanged resize events produce 0 buffer dimension writes; covered 3D draw calls stop. The Chromium integration additionally forces focus-context loss and checks the collection fallback.

Public runtime `4e11b89ffaf7e3298068ec80dc978546bda651a3` is built by GitHub Pages and all 22 runtime files match the tested hashes. The public entry URL without a cache-busting query also serves v0.14.3. Both [public Chromium](../tests/artifacts/tablet-chromium-production.json) and [public WebKit](../tests/artifacts/tablet-webkit-production.json) passed the full native touch flow, four responsive sizes, saved state, paused draws/deferred buffer resizing, visible confirmation controls and clean return. [Public fallback checks](../tests/artifacts/fallback-v0143-production.json) also passed.

[Deployment checksums](../tests/artifacts/production-deployment.json) · [Public Chromium confirmation](../tests/artifacts/tablet-chromium-booking-confirmed.png) · [Public WebKit confirmation](../tests/artifacts/tablet-webkit-booking-confirmed.png). Follow-up evidence commits preserve the same runtime hashes. [Design research](MOBILE_UX_RESEARCH.md) · [Patch notes](../CHANGELOG.md)

---

## Historical v0.14.2 measurements (superseded interaction tests)

# Overlay and phone stability — 2026-11-19

The pre-fix phone build positioned the signal SVG across the entire showroom and wrote WebGL canvas width/height 80 times for ten unchanged resize events. The patch places the signal inside the screen portal, uses one projection per frame, and preserves drawing buffers unless their actual size or pixel ratio changes.

Targeted checks are recorded in [Chromium phone results](../tests/artifacts/overlay-chromium-local.json), [WebKit phone results](../tests/artifacts/overlay-webkit-local.json), [desktop results](../tests/artifacts/overlay-chromium-desktop-local.json), and [the baseline measurement](../tests/artifacts/overlay-baseline-20261119.json). The checks cover alignment after dragging, zooming and phone orientation changes; resize allocation; app booking/state retention; reduced motion; and gallery cleanup. Current phone runs show zero redundant buffer writes and zero settled transform writes. Physical iPhone/Android testing is not claimed.

Public v0.14.2 runtime `fa438125597a822019394fdbfb367caa771dd2ca` passed the same phone stability checks in both engines at DPR 2. Both recorded zero redundant drawing-buffer writes and zero settled transform writes. All 22 deployed runtime files matched their tested hashes. Evidence-only updates preserve those runtime hashes.

[Public Chromium](../tests/artifacts/overlay-chromium-production.json) · [Public WebKit](../tests/artifacts/overlay-webkit-production.json) · [Current deployment](../tests/artifacts/production-deployment.json)

[Phone overlay screenshot](../tests/artifacts/overlay-chromium-390.png) · [Patch notes](../CHANGELOG.md)

---

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

At the time of these historical runs, the supplied ZIP and embedded MeeTab document were unchanged. v0.14.3 preserves the ZIP and adds a phone adapter to the portfolio copy of the demo. The pre-fix published version is preserved on `backup/pre-mobile-showroom-2026-11-17`; the original full old-site backup remains on `backup/archive-pre-showroom-2026-11-16`.

The November 16 baseline used a collection-only phone fallback. Its reports and phone screenshot are retained under [dated history](../tests/artifacts/history/2026-11-16/).

[Source checksums](../tests/artifacts/source-sha256.json) · [Run, deploy and restore instructions](SHOWROOM.md)

## Public-site verification

The published runtime at `454911623ee7ccf35643cd8518524eac786dd831` passed the 390 px phone smoke check in both Chromium and WebKit: actual 3D, touch booking navigation, exit/reentry state, portrait/landscape resizing, mobile navigation and clean JavaScript/network checks. Chromium also passed native two-finger zoom. All 22 deployed showroom source files matched the tested SHA-256 manifest. Later evidence-only commits retain the same runtime checksums.

[Public Chrome phone results](../tests/artifacts/mobile-chromium-production.json) · [Public WebKit phone results](../tests/artifacts/mobile-webkit-production.json) · [Deployment report](../tests/artifacts/history/2026-11-17/production-deployment.json)
