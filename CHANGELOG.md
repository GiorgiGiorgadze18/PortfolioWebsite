# Changelog

## Next-driven tablet tilt — 2026-11-27

- Keep the selected tablet upright when About opens on all3graphic projects. Begin the smooth tilt only after Next, following the existing timeline. Keep the paired controls, Quit and refresh.


## Case-study control and entry refinement — 2026-11-27

- Pair About beside View Artwork with matching shape and project-colored outlined overlay styling. Keep the trigger label stable and reveal the completed HUD directly.
- Smoothly interpolate the selected tablet into its case-study size, position and tilt on entry over650ms using the existing showroom render loop. Respect reduced motion and preserve layer progression.
- Replace the text Replay action with Quit and add an accessible44px refresh-icon action beside Next. Refine mobile type, spacing and chapter targets.


## Graphic About integration — 2026-11-27

- Enable JBL, Tom Ford and Earth Hour composition studies through public About actions. Place About above View Original Artwork in the selected showroom inspector. Hold the selected device pose until Next starts the shared tilt/layer animation.
- Open Grid About directly in a responsive modal with a dark blurred backdrop, shared chapter dots and Previous/Next controls. Restore keyboard focus after closing and keep Escape available.
- Preserve the shared final shadow tone for inactive sheets. Validate public Grid paths across Chromium/WebKit and real software-WebGL selected-device entry/exit. See docs/case-study/ABOUT_REPORT.md for evidence and limitations. Owner authorized publication in the integration request.


## Unreleased — Consistent visible shadow from first Next, 2026-11-27

- Dim every inactive sheet, including future sheets still overlapping the base, to the final20% brightness. Previously their undimmed artwork/grid repainted the dark base, making early stages appear lighter. Only the current rising sheet stays bright; all3projects share DOM/WebGL logic. Preserve reassembly, spacing and original assets. No publication.


## Unreleased — Constant passed-layer shade, 2026-11-27

- Apply the final20% brightness as soon as the next layer starts rising, rather than interpolating darkening during that rise. All JBL/Tom Ford/Earth artwork and grids share the same shade; later Next actions do not deepen it. Reassembly still restores brightness. Shared Node checks cover onset and later chapters. No publication.


## Unreleased — Audio-first JBL and compact deep shadows, 2026-11-27

- Correct JBL grouping: lift the original Audio panel first, then only the two headphone parts as one lossless composite, then clouds/title. Keep the floor shadow/reflection on the background; preserve all original source assets.
- Halve shared stack gaps to75desktop/48mobile normalized units and matching framing offsets. Darken all passed sheets, artwork and grid together, to20% brightness; keep the active sheet unchanged and restore on reverse/recompose.
- Add exact source-group pixel checks, rerun staged Chromium/WebKit emulation and actual JBL software-WebGL restore/resource checks. See docs/case-study/STACK_REPORT.md; no merge/deployment.

## Unreleased — Bottom-to-top chapter stacks, 2026-11-27

- Make the first three Next actions raise semantic components bottom-to-top: JBL stand→headphones→cloud/title; Tom Ford leaf→smoke→bottle; Earth panel→shadow→character. Preserve original layer files and add lossless presentation composites for split headphones/smoke.
- Sort transparent artwork/frame pairs by their current depth so not-yet-raised layers stay behind raised ones.
- Use shared equal normalized depth gaps150desktop/96mobile and larger desktop spacing. Dim every passed sheet, artwork and grid together, to52% brightness; reverse/recompose restores brightness.
- Reframe the taller live stack, synchronize chapter/static descriptions, preserve ice-white styling and source endpoints. Browser/order/restore evidence: docs/case-study/STACK_REPORT.md. No publication.

## Unreleased — Quieter grid and deeper base shadow, 2026-11-27

- Reduce frame grid density28→20 (phones≈14), thin lines1→.65/.7px and soften minor/major alpha. Keep the ice-white border/glow. Darken only the lowest-sheet contact shadow.

## Unreleased — Neutral ice-white sheets, 2026-11-27

- Use#DCEEF2 on every project frame, reduce inner glow from.52 to.28 and desktop outer bloom from.25 to.08. Add a restrained bottom-sheet contact shadow; preserve assets, grid density, choreography, annotations and navigation.

## Unreleased — Project-colored holographic sheets, 2026-11-27

- Refine only decorative layer frames: square procedural grid, alpha-aware attenuation, inner edge glow and crisp borders. Use manifest frame colors (JBL blue, Tom Ford gold, Earth purple per owner correction) with saturated-hue fallback for future projects.
- Share a WebGL shader/geometry per presentation; use resize-only Canvas2D decorations for DOM planes. Reduce phone grid density30%, disable phone outer bloom, preserve DPR caps and all choreography/assets/copy/navigation.
- Capture36 before/after screenshots at progress0/.5/.75, identical pose checks, comparable DOM CPU measurements and isolated software-GL timing/resource checks. Known intermittent desktop Tom Ford focus-return failure remains outside this frame-only scope. See docs/case-study/HOLOGRAPHIC_REPORT.md. No merge/publication.

## Unreleased — Layer frames and supplied Earth assets, 2026-11-27

- Add thin purple per-layer borders in CSS3D and real WebGL, fading away during assembly. Move the shared vertical chapter rail left of the artwork for every project.
- Replace Earth extraction with the owner-supplied ZIP planes; retain that panel/gradient. Use one generated fingertip repair only inside a78×40px mask, with exact RGBA preservation elsewhere. Preserve source ZIP, generation and original endpoints.
- Validate24 browser/viewport cases, real software-GL resource restoration and masked edit identity. See docs/case-study/FRAMES_REPORT.md; no publication.

## Unreleased — Earth composition study, 2026-11-27

- Reject the supplied generated AI as a fidelity source; separate the unchanged original into background, character, oval shadow and green text panel, explicitly documenting reconstructed upper-panel/shadow areas. Preserve original image endpoints.
- Add owner-backed chapters and character-first choreography: character above shadow, shadow above the text panel, with existing Previous/Next, project-colored dots and compact mobile layout.
- Register Earth in Grid and actual showroom review paths; retain all public flags disabled. Browser, touch, software-GL restore/resource and fidelity evidence is recorded in docs/case-study/EARTH_REPORT.md.

## Unreleased — Mobile artwork balance, 2026-11-27

- Give graphic artwork more mobile stage space, compact Previous/Next/Replay into one44px-high action row, and reduce chapter-dot hit rows to32px. Keep longer descriptions independently scrollable so actions remain visible. Desktop layout unchanged.

## Unreleased — Chapter dot refinement, 2026-11-27

- Enlarge the active dot to1.65× with its project color and soft glow. Remove dot borders and surrounding button focus frames; keyboard-only focus is drawn around the dot itself.

## Unreleased — Case-study chapter buttons, 2026-11-27

- Replace scroll-controlled graphic case studies with Previous/Next and a vertical dot navigator; retain smooth reversible layer/camera/annotation motion. Wheel input no longer changes chapters.
- Use each artwork’s accent for Next and the active dot; use the navy site surface with a restrained artwork-color overlay for Previous. Keep the component reusable for a later site-wide pass.
- Remove long pinned scroll space, fit mobile artwork above accessible controls, keep a compact mobile header, and preserve reduced-motion/no-JS/static reading.
- Validate both artworks in Chromium/WebKit, real Tom Ford showroom navigation in software GL, and progress-source lifecycle tests. See docs/case-study/NAVIGATION_REPORT.md for evidence and limits. No merge/deployment.

## Unreleased — Tom Ford composition study, 2026-11-27

- Add five true-alpha planes exported from the owner’s 1524×2784 PSD, preserving layer opacity and the bottle shadow. Keep source artwork and existing public previews unchanged.
- Add six evidence-backed chapters, bottle-first separation, the approved isometric pose, warm annotation accents, smooth anchored leaders and original-artwork recomposition.
- Register Tom Ford in the shared review-only Grid and actual showroom paths; fit its source aspect ratio and restore camera, device, focus, scroll and rendering resources on exit. Preserve JBL choreography.
- Add reproducible export, self-contained preview packaging and browser evidence. See docs/case-study/TOMFORD_REPORT.md for executed checks and remaining hardware/accessibility verification. No production publication or paid generation.

## 0.18.3 — Earlier Contact terminal typing, 2026-11-26

[PR #27](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/27)

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

## Case Study Phase 0 audit — 2026-11-26

- Added planning/state documents, original-asset hashes, capability probes and four-viewport software-WebGL baseline evidence under `docs/case-study/`.
- Recorded live Grid inspection, source-ID compatibility risks, missing layered assets and test limitations. No site behavior changed. Gate 0 pending; no implementation, PR, merge or deployment.
- Validation: `node tools/sync-projects.mjs --check`, `git diff --check`; browser coverage and actual measurements are in `docs/case-study/TEST_REPORT.md`.

## Case Study engine foundation — 2026-11-26

- Gate 0 approved; added isolated pure timeline and exact critically damped spring, not yet connected to production UI.
- Node tests cover reverse seeks, immutable sampling, invalid data and refresh-rate equivalence. Uploaded JBL archive inspection blocked by attachment downloader read-only filesystem. Phase 1 partial, Gate 1 not reached; no merge/deployment.

## Case Study JBL source inspection — 2026-11-26

- Read owner notes and measured32 supplied PNGs. Preserve original archive; added candidate grouped assets, hashes, recomposition preview and explicit FAIL metrics; all unpublished and not animated.
- Added isolated lifecycle/DisplaySurface and native-scroll observer. Node lifecycle and timeline tests pass; browser integration not yet run. No showroom changes, merge or deployment.

## JBL PSD investigation — 2026-11-26

- Inspected original PSD visibility, blending and effects. Corrected stacking/blending reduces recomposition mean difference below1/255; exact identity still fails locally. Comparison and measured metrics recorded.
- Source PSD preserved outside Git; no final asset validation, animation, merge or deployment. Gate1 remains pending.

## JBL review preview — 2026-11-26

- Added six-plane CSS3D reference with native-scroll chapters, replay, original-image endpoints and static/no-JS text. Six planes use PSD-confirmed blend appearance baked at assembly; originals preserved.
- Added review-only showroom iframe dialog behind caseStudyPreview=1; pauses scene drawing while open. Default entry remains absent, published:false.
- Chromium/WebKit desktop/phone navigation/reduced-motion tests passed; engine math/lifecycle unit checks passed. Anchored annotations, final camera integration, complete edge/SSIM certification and broad regressions remain unfinished. No merge or deployment.

## JBL image quality checkpoint — 2026-11-26

- Added reproducible full-resolution RGB SSIM and alpha measurements: SSIM0.9971875 (target0.995), six alpha checks PASS. Does not certify halos or final camera integration. No runtime/deployment changes.

## JBL Gate1 reference — 2026-11-26

- Added real showroom board/camera entry and exact reversible exit on the existing animation loop; interruptible and reduced-motion aware. Added project JSON choreography and explicit default-disabled registry.
- Fixed no-JS/failed-init blank pin space. Tests: actual Chromium3-cycle exact camera/board/focus/scroll restoration;10 unit transition cycles; Chromium/WebKit reference desktop/phone; existing header/menu and MeeTab wheel regression. Hardware/AT/full memory QA not claimed.
- Gate1 review only; no PR, merge or production deployment. See docs/case-study/GATE_1_REPORT.md.

## JBL reclined composition revision — 2026-11-26

- Updated the review choreography per owner direction: intact poster reclines70° before any layer separation, then layers rise along a45° upward trajectory. On reverse, layers assemble before the poster stands upright.
- Added independent tilt/lower keyframes, surface-relative zero-offset background and width-scaled layer travel; headphone pieces stay aligned. Originals, copy and showroom entry/exit unchanged.
- Browser validation recorded in docs/case-study/evidence/reference/tests.json; working preview revised separately. Public feature remains unpublished.

- Cross-browser follow-up in the same revision: avoid nested3D image composition, apply complete pose per plane with perspective on their common board; keep native-scroll and original endpoints.

## JBL softer diagonal recline — 2026-11-26

- Reduced review-poster recline70°→48° and added a subtle-6° diagonal roll on laying down. Reverse motion returns to upright without roll; staged layer lift remains.
- Updated project choreography and renderer pose, with a separately named downloadable preview. Browser checks/evidence: docs/case-study/evidence/reference/tests.json. Production remains unpublished.

## JBL rigid left lean — 2026-11-26

- Replaced independent rotation axes with a single fixed left-lean axis, retaining48° recline and staged lift. Reduced perspective exaggeration1100→2400px and added a subtle leftward translation.
- Every plane and the original image use the same rigid pose; original artwork unchanged. Updated downloadable preview and Chromium/WebKit desktop/phone evidence. No merge/deployment.

## JBL annotation and step polish — 2026-11-26

- Added glowing source dots/rings and faint glowing leader lines. Layer handoffs crossfade at their real anchors; description endpoint stays stable between headings.
- Added cancellable text reveals, filled cyan current-step circles and subtle per-layer alpha shadows only during separation. Preserved native scroll, rigid left lean and original artwork.
- Chromium/WebKit desktop/phone checks cover line crossfade weights, active fill, layer separation, replay, reduced motion and overflow; endpoint/reduced-motion follow-up in annotation-tests.json. Production remains unpublished.

## JBL real-screen layers and Grid variant — 2026-11-26

- Added six lazy-loaded Three.js planes attached to the selected JBL display, shared scroll/timeline state and real projected annotation anchors. Device and poster use owner-reference isometric orientation.
- Grid About opens the independent CSS3D case; live scene preserves/returns camera projection, FOV/aspect/device pose and disposes new GPU resources. Poster support is hidden/restored only for presentation. HUD transparency, mobile actions and short-height static fallback handled.
- Tests/evidence/limits: docs/case-study/JBL_SCENE_REPORT.md. Chromium software-GL scene checks and Chromium/WebKit Grid/reference checks executed; physical GPU/Safari/context-loss matrix not claimed. No production merge/deployment.
