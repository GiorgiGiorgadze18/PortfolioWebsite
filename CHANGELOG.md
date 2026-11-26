# Changelog

## 0.18.3 — Earlier Contact terminal typing, 2026-11-26

- Start the terminal log while its section enters the lower viewport and complete typing over a shorter scroll distance. Keep the form immediately available.

## 0.18.2 — Lab selection, 2026-11-26

- Remove the Shader Playground and Lighting Studio from the Lab, including their modules and preview styles. Keep the hologram, Motion Physics, Particle Field and Spatial UI.
- Ship together with the shared-header and device-focus fixes in PR #26.

## 0.18.1 — Header and device-focus fixes, 2026-11-26

[PR #26](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/26)

- Share the Home header markup, styling and mobile navigation behavior across all five pages.
- Consume wheel input over the showroom while a device opens, remove the second page realignment, shorten focus animation to 550ms and preload MeeTab after focus completes.
- Targeted browser results are recorded in docs/header-focus.

## 0.18.0 — Portfolio refinement draft, 2026-11-26

[PR #25](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/25)

- Open the 3D showroom by default on supported browsers, remember explicit presentation choices, and provide a static Grid archive with native project details when graphics or scripts fail.
- Refine the Projects switcher, control spacing and focus states across the site.
- Expand Creative Lab with five on-demand studies in GLSL, Three.js lighting, spring motion, Canvas particles and CSS 3D. Preserve the original holographic interface.
- Check the refinement report for browser results, local preview and remaining verification.

## 0.17.7 — Phase 08 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Prevent the Grid view's initial showroom layout shift; locally host existing licensed fonts, bundle Home styles in source order, and prioritize the correctly sized portrait.
- Correct certificate preview backgrounds and source-backed certificate labels/dates; align brand accessible names with visible text.
- Record 110 Chromium/WebKit geometry checks, intercepted form states, local app demo flows and repeated Lighthouse measurements. Home performance varies 76/97/99; open limits remain in docs/OPEN_VERIFICATION.md. No production deployment.

## 0.17.6 — Phase 07 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Add a Creative Lab using the existing holographic engine with tilt strength, reflection, pause/resume and reset controls. Support native keyboard ranges, reduced motion and static fallback.
- Add consistent Lab navigation and a fifth sitemap entry. Browser, shared-engine and accessibility checks are recorded in docs/phase07.

## 0.17.5 — Phase 06 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Add canonical/social metadata, catalogue-backed structured data and semantic project descriptions, a four-page sitemap, and a custom 404 with base-path-safe recovery links.
- Create a 1200×630 social preview using the existing portrait and theme. Local browser verification and hosting limits are recorded in docs/phase06 and the open-check registry.

## 0.17.4 — Phase 05 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Add dedicated WebP previews, defer the desktop MeeTab preload, fix mobile-menu focus and filter count contrast, and validate wheel bridge payloads.
- Record comparable local transfer/LCP measurements and scoped accessibility results in docs/phase05. Track every open verification item in docs/OPEN_VERIFICATION.md.

## 0.17.3 — Phase 04 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Share identical active-page design tokens and move the project catalogue to a dedicated ES module. Add static Home metadata synchronization and direct project links.
- Remove the unused legacy project overlay initializer after checking its markup consumers.
- Computed-style comparisons, catalogue equivalence and browser checks are recorded in docs/phase04.

## 0.17.2 — Phase 03 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Suspend holographic motion when hidden and reset pointer tilt on focus loss. Respect live reduced-motion changes in parallax, cursor glow and shared anchor navigation.
- Cancel pending shared scroll frames when hidden. Preserve the existing Experience interpolation after measurements confirmed its settled behavior.
- Lifecycle tests and limits are recorded in docs/phase03.

## 0.17.1 — Phase 02 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Add Grid/3D selection, multi-category filtering, direct project links and an archive entry for the portfolio.
- Make the Contact form immediately available, revise terminal wording and provide sending, success and failure states with duplicate-submit protection.
- Verification and limits are recorded in docs/phase02. Real contact messages were intercepted locally.

## 0.17.0 — Phase 01 draft, 2026-11-26

[PR #24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24)

- Update professional identity and About copy, prioritize featured work, and consolidate disciplines into four holographic cards. Add a source-backed technology summary and contact CTA.
- CV alignment remains pending factual review. Browser verification and limits are recorded in docs/phase01/README.md.

## 0.16.10 — 2026-11-23

[PR #23](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/23)

- Apply translucent cyan glass, layered content and moving reflections to all ten existing Core Disciplines cards. Preserve each heading, description, list, tool tag and icon.
- Add damped pointer and touch tilt, staggered floating motion, and a static reduced-motion view. Pause floating offscreen, and synchronize cards in multi-column rows so they stay aligned. Keep the backdrop blur with a lighter tint.

Verified all ten original card bodies against the published baseline, and checked desktop, 320px and 390px portrait, and landscape in Chromium and WebKit. Verified the existing Experience fill and nodes on forward and reverse scroll in both engines. Checked mouse return in both, touch drag in Chromium phone emulation, and the static no-JavaScript fallback. The original Projects and shared spotlight sources are unchanged. Rollback baseline is `1154cc6`, saved at `backup/before-home-hologram`.

## 0.16.9 — 2026-11-23

[PR #22](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/22)

- Version the Contact terminal stylesheet and script URLs so a refreshed Contact page requests the full-height layout even if the earlier nested-scroll assets are cached.

Verified in Chromium phone emulation with the old asset URLs serving cached copies. The revised page had zero internal overflow and Transmit was reachable via page scrolling.

## 0.16.8 — 2026-11-23
[PR #21](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/21)

- Keep the completed Contact boot log above the form and let the entire terminal scroll with the page after the sequence. Remove the nested scroll and the automatic jump inside the terminal.
- Tighten the Contact terminal spacing and headings on narrow phones while keeping form text at 16px.

Verified boot progress, the completed log, document scrolling to Transmit, Skip, Tab, reduced motion, and horizontal fit in Chromium and WebKit at 1366×900, 390×844, 320×568, and 844×390. Phone profiles were emulated.

## 0.16.7 — 2026-11-23

[PR #20](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/20)

- Turn the Contact form pane into a pinned terminal boot sequence with scroll-scrubbed typing, a progress bar, form reveal, and an armed Transmit state. Keep the original fields, native validation, and Formspree POST.
- Add reusable desktop and touch scroll hints, a keyboard-accessible Skip link, and a static form for reduced motion and no JavaScript. On short screens the first hint follows the contact cards and the unlocked terminal body can scroll to Transmit.

Verified forward and reverse scrolling, the unlock and armed thresholds, Skip, Tab and focus, portrait and landscape layouts, reduced motion, and the no-JavaScript fallback in Chromium and WebKit desktop and phone emulation. Verified required and email validation and intercepted the original Formspree POST locally. Browser checks reported zero console errors with the local test server. Live inbox delivery and physical devices were outside those checks.

## 0.16.6 — 2026-11-23

[PR #19](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/19)

- Restore the original Home hero by removing its sticky scroll and curtain effects.
- Keep the Experience timeline animation and complete the fill when the last card reaches the center of the viewport.

Verified midpoint completion, reverse scrolling, and initial reduced motion in Chromium and WebKit desktop, portrait-phone, and landscape-phone emulation.

## 0.16.5 — 2026-11-23

[PR #18](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/18)

- Keep the Home hero sticky as Core Disciplines covers it. Scroll scales and fades the existing intro, with gentle blur and different offsets for the photo and copy.
- Fill the existing Experience rail as the page scrolls. Each node lights up and its card moves into place when the fill reaches it. The sequence runs in reverse on scroll-up.
- Respect reduced motion and let tall layouts scroll through the Hero content before it pins.

Verified the original geometry, sticky overlap, forward/reverse timeline activation and reduced motion in Chromium and WebKit at 1366×900, 390×844, 320×568 and 844×390. Phone profiles were emulated.

Rollback baseline: published v0.16.4 at `15885ae`. Revert `75442b9` for the Hero or `6297d9d` for Experience. The shared scheduler `b7e5e6e` can be reverted after both effects are removed. Refresh the deployment manifest for the resulting Home files before publishing a rollback.

## 0.16.4 — 2026-11-22

[PR #17](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/17)

- Upload the high-resolution preview on each display to a new GPU texture after the image loads. This restores the two app screenshots and three original posters in the gallery and focused view.
- Project each exhibit’s rounded silhouette from its overhead light onto the wood shelf and onto the room floor when the exhibit is brought forward. Feather the shadow edges and clip them to the receiving surface.

Verified the restored gallery images in rendered browser captures. Pixel comparisons found a separate shelf shadow for all five exhibits and a floor shadow in focus in WebKit desktop and phone emulation. Both shelves and Try Now flows passed in WebKit.

## 0.16.3 — 2026-11-22

[PR #16](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/16)

- Keep the constellation moving above and below the Projects showroom. Reduce its update rate while the 3D scene shares the viewport and pause it when the scene fills the visible area.
- Remove the two decorative postscript labels and the vertical “Thoughtfully crafted” caption.
- Render the original poster art and higher-density screenshots directly on all five exhibits, before and after selection. Remove the softening overlays and cap texture and canvas sizes. Try Now remains available on both app exhibits.

Verified top-of-page animation and all five loaded texture sizes in Chromium desktop and phone emulation. WebKit passed both shelves and Try Now on desktop and phone emulation.

## 0.16.2 — 2026-11-22

[PR #15](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/15)

- Draw the project-colored body outline directly in the stage SVG. Play one sweep on selection and replay it when entering Try Now, above both the live desktop app and the phone screenshot.
- Move the animated UI / UX and Graphic Design switch above the 3D stage. On phones, keep the project year and artwork action visible while the description scrolls.
- Restore directional shelf shadows. Touch devices use projected silhouettes and contact shadows with a lower render resolution, and reuse the room frame while the focused device rotates.
- Use the default arrow over Home text and add the MeeTab card to Best Projects.

Verified the animated switch and desktop sweep in WebKit, and phone preview and panel bounds in Chromium and WebKit across portrait and touch landscape. A mobile emulation sample recorded zero room draw calls after focus settled while foreground rendering continued.

## 0.16.1 — 2026-11-22

[PR #14](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/14)

- Fade the Home hero backdrop into the next section to remove the hard gradient edge.
- Open the phone, tablet and posters directly into the final centered view. Use the same screen alignment throughout the opening and interactive view.
- Apply MeeTab coral, Tsero red, and colors sampled from each poster to the corresponding project controls and body outline. Posters now get one outline sweep when selected.
- Shorten the actual cast shadows and add compact contact shadows below each exhibit stand. Remove the broad screen glow that made the edges look detached.

Verified the Home transition and matching opening and interactive positions for all five exhibits in desktop and phone emulation using Chromium and WebKit. Also verified MeeTab’s phone preview, one-time outline and screen alignment after resizing in WebKit.

## 0.16.0 — 2026-11-22

[PR #13](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/13)

- Rotate the 3D shelves 180° with the UI / UX and Graphic Design controls. Tsero and MeeTab face forward. Tobacco Vanille, Earth Hour and JBL artwork are displayed on the reverse.
- Open the exhibit inspector from either face. On phones, Try Now shows the existing screenshot and desktop prompt for both apps. Reduced motion switches sides immediately.

Verified both faces, all three artworks, desktop demos and the phone portrait and landscape flows in Chromium and WebKit browser emulation. Phone emulation made zero live demo requests. The WebKit MeeTab regression also passed the single outline sweep and unchanged canvas resize checks.

### Constellation and home hero

- Add a shared constellation background to Home, Projects, Contact and About. It uses the existing accents and honors reduced motion. Near the 3D showroom, the background holds a still frame and clips the area covered by the stage.
- Reveal the original Home heading by letter and its paragraph by word, then enable cursor repulsion on hover-capable devices. Preserve the original text flow and styling.
- Remove a broken decorative image request on About. The certificate preview and link still use the original file.

Verified all four pages, original wrapping, the hero reveal and pointer behavior in Chromium and WebKit desktop and phone emulation. The browser checks reported zero console errors. The constellation drew zero frames during the active WebGL samples.

## 0.15.3 — 2026-11-22

[PR #12](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/12)

- Click outside a device during Preview to close it and return to the gallery. Device surfaces and inspector controls remain interactive. Verified on Tsero and MeeTab in desktop WebKit.

## 0.15.2 — 2026-11-22
[PR #11](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/11)


- Prevent page text from highlighting during mouse drags in the Tsero demo. Search and form fields retain normal text selection.

## 0.15.1 — 2026-11-22

[PR #10](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/10)

- Center Tsero, MeeTab and Try Now between the left edge and the desktop inspector. Reduce the tablet’s initial tilt and leave room below the phone for the button.

Verified horizontal centering and clearance in desktop WebKit at 1024 and 1280 px.

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
