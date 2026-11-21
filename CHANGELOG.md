# Changelog

## 0.15.0 — 2026-11-22

[PR #9](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/9)

- Add the Tsero web demo to the 3D phone. On desktop, Try Now opens the original web app at its 375×811 reference size, with the menu, cart, simulated payment and bundled delivery map. Each app keeps its own demo session while browsing Projects.
- On mobile, show the real Tsero home screen on the phone. Try Now opens the project HUD and darkens the screen by 55% with the desktop prompt. The phone never downloads the live demo.
- Keep the original Tsero artwork at `assets/project-tsero.jpg` and continue using it in the collection. The 3D phone uses a separate home screenshot.

Verified the complete simulated order, delivery map, preserved cart and MeeTab switching in desktop browsers. Phone emulation verified the home screenshot, HUD, 55% overlay and zero live app requests in portrait and landscape. See [verification](docs/VERIFICATION.md).

## 0.14.6 — 2026-11-21

[PR #8](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/8)

- Use the same curved return icon for Back to Gallery across platforms. The line icon follows the button color. Checked the icon and gallery return in WebKit phone and desktop emulation.

## 0.14.5 — 2026-11-21

[PR #7](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/7)

- The 3D tablet shows a capture of MeeTab's desktop home screen. On mobile, Try Now opens the existing HUD and puts a 55% black overlay with a white message over the tablet display: “Try the interactive demo on a computer.”
- Phones use the still image throughout the visit and skip the live app download. Desktop visitors use the interactive demo in the tablet.
- Make the screenshot, dimmed notice and desktop-only app the standard for future showroom integrations. See the [repository instructions](AGENTS.md).

Chromium and WebKit phone emulation passed portrait and landscape checks, the two preview cycles and the absence of app requests. Desktop WebKit passed live booking navigation and the one-pass neon check. See [verification](docs/VERIFICATION.md).

## 0.14.4 — 2026-11-20

[PR #6](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/6)

- Try Now sends one neon sweep around the outside of the entire tablet. The light disappears after one lap and replays on the next entry.
- Touch devices keep the live MeeTab demo inside the tablet in Projects. The tablet faces the viewer while the responsive app is active, so scrolling and typing work in the screen. The stationary scene redraws on resize. Exit preview restores 3D gestures and preserves the demo state.

Chromium and WebKit phone emulation passed the embedded booking flow, a single sweep per activation, resize and orientation checks, and form state retention. See [verification](docs/VERIFICATION.md).

## 0.14.3 — 2026-11-19

[PR #5](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/5)

The phone demo no longer floats over a moving tablet. Try now on touch devices opens a full-screen responsive MeeTab demo with a clear return control; desktop keeps the in-tablet demo.

- Normalize screen geometry UVs and preserve image-overlay aspect ratios to stop gallery covers stretching/clamping. Use a sharper MeeTab cover on phone selection and show live iframes only in demo mode.
- Replace the clipped inner-screen neon with a body-sized outline outside the tablet bezel, following rotation and zoom. Keep a visible static halo, with a looping highlight during desktop Try now; reduced motion keeps the static halo.
- Reflow the existing app's home/calendar/booking screens for phone width, with scroll, readable form fields and 44px core controls. Native touch input no longer rotates the hidden 3D scene.
- Preserve the same iframe/form state across return/reentry and pause 3D draw calls during the full-screen demo.
- Add [mobile UX research](docs/MOBILE_UX_RESEARCH.md), correct provenance for the modified portfolio demo, and preserve the previous release at `backup/pre-mobile-demo-redesign-2026-11-19`.
- Replace the previous screen-local alignment check with outer-body checks and native touch booking completion. The earlier coordinate-mapped tap test did not detect the detached mobile layer and is superseded.

Validation: Chromium and WebKit phone integration passed at DPR 2, exercising 360×800, 430×932, 844×390 and 390×844; native touch booking, retained iframe/form state, paused 3D draws and 0 redundant buffer writes passed. The final confirmation-panel adjustment passed isolated native touch tests in both engines, including fully visible acknowledgement controls. Chromium desktop at 1280 px passed outer-body alignment after drag/zoom, reduced motion, booking navigation and all four inspectors. WebGL-unavailable and JavaScript-disabled fallbacks passed. [Verification reports](docs/VERIFICATION.md). These are emulated/software-rendered checks; physical iPhone/Android validation remains outstanding. Public Chromium and WebKit also passed the full touch flow and fallback checks after deployment; all 22 deployed runtime files matched the tested source.

## 0.14.2 — 2026-11-19

### Fixed

- Bind the Try now neon trace to the tablet's actual screen overlay so it follows the same transform during entry, dragging, zoom and phone layout changes.
- Keep the phone preview transform on one projection path per frame and avoid clearing WebGL buffers for unchanged viewport notifications.

[PR #4](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/4)

### Verification

Chromium phone (390 px, DPR 2), WebKit phone (390 px), and Chromium desktop (1280 px) passed the targeted regression. Ten unchanged resize events produced 0 drawing-buffer dimension writes, versus 80 in the baseline. A real phone width change produced the 4 required writes; a settled phone preview produced 0 transform changes. Drag/zoom/orientation alignment, booking navigation, retained iframe state, reduced motion and gallery cleanup passed. The public-site phone checks also passed in both engines at DPR 2, with 0 redundant buffer writes and 0 settled transform changes. [Verification reports](docs/VERIFICATION.md). These are emulated browser checks, not physical-device measurements.

## 2026-11-17 — Phone 3D showroom

- Enabled actual 3D on phones instead of the width-based collection fallback.
- Added touch targets, a bottom inspector, fitted camera, pinch zoom, app readiness and phone rendering limits.
- Checked Chromium and WebKit at 360, 390, 412 and 600 px, with representative public-site touch checks.
- [PR #3](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/3)

## 2026-11-16 — v0.14 showroom integration

- Integrated the supplied showroom and state-preserving MeeTab preview into Projects.
- Preserved the original source ZIP, original JBL artwork, old-site source/history backup, and restore instructions.
- Stabilized the Try now control during camera transitions and recorded browser/deployment evidence.
- [PR #1](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/1) · [PR #2](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/2)
