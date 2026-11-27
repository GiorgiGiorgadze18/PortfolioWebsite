# Phase 0 test evidence

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Current source and backup refs | Preserve current production and backup | Recorded refs; clean initial tree; isolated branch | PASS | branches.txt, source-commits.txt |
| Live HTTPS reachability | HTTP 200 | Both site/repository responded 200 | PASS | capabilities.json |
| Live Chromium Grid | Page loads | HTTP 200; pageerror list empty | PASS | live-browser.json, live-projects-grid.png |
| Four Chromium showroom viewports | Initialize without page exception/overflow | Four initializations; no pageerror; overflow 0 | PASS | baseline.json, showroom-*.png |
| 10-second baseline capture | Record cadence and conditions | All four samples recorded, severe software-rendering slowness | PASS | baseline.json |
| Hardware 60 FPS | Measure on actual GPU | No hardware GPU; software cadence is non-representative | BLOCKED | capabilities.json |
| Mobile initial live-demo requests | None | Empty request lists for sampled gallery visits only | PASS | baseline.json |
| WebKit launch | Browser available | Launched successfully, no functional assertions | PASS | webkit-probe.json |
| Firefox launch | Browser available | Executable absent | BLOCKED | firefox-probe.json |
| Artwork inventory/hash | Source sizes and SHA recorded | Three flattened PNG originals, previews, ZIP checked | PASS | inventory.json |
| Layer assets/recomposition | Valid alpha/reconstruction and fidelity | No extracted assets yet | NOT RUN | ASSET_MANIFEST.json |
| Full console messages, keyboard/AT, demo scenarios, cleanup | Complete coverage | Not executed in Phase 0 | NOT RUN | Existing limitations in docs/OPEN_VERIFICATION.md |

Evidence paths above are relative to evidence/. Python HTTPS used normal certificate validation; live browser used ignore_https_errors. No real app operations or form submissions performed. Phase 1 tests are NOT RUN. Full source inventory is not a proof of product/backend capabilities.

## Phase 1 foundation — 2026-11-26

`node tests/case-study/timeline.test.mjs`: PASS — reverse/direct seek, clone isolation, invalid timeline rejection and spring refresh-rate equivalence. This is math-unit coverage only. Lifecycle, UI, a11y, artwork and showroom integration tests NOT RUN.

## JBL input and engine progress

- PASS: archive path traversal check before temporary extraction; notes read; canvas/alpha/bbox/SHA measured for all32 layers. Source RGBA does not alone prove edge quality.
- FAIL: normal-alpha recomposition vs original: MAD3.891722/255, max175/255. Evidence: evidence/jbl/validation.json and recomposition.png (visually inspected). No asset animation/publishing. SSIM/edge halo validation NOT RUN.
- PASS: node tests/case-study/engine.test.mjs — mock surface restoration across10 cycles, interrupted loads, rejection of unvalidated assets, idempotent disposal. This is NOT GPU/resource/browser leak validation.
- PASS: existing timeline tests. Browser progress integration, real GPU disposal, a11y shell, preview and showroom integration NOT RUN.

## PSD investigation

PASS: PSD downloaded via Drive connector, size and SHA recorded; visibility/blend/effects read. PASS: corrected stack mean difference below1/255 (rounded values in evidence/jbl/corrected-metrics.json). FAIL: exact recomposition; local residuals in glow/reflection. NOT RUN: SSIM, halo validation, final7-group rendering and browser integration. Comparison manually viewed: evidence/jbl/blend-comparison.png. No final asset approval inferred.

## Working reference preview

PASS: six-plane reference recomposition mean0.235782/255, target≤1/255; exact identity remains FAIL (max87/255). Endpoint uses original image. Source blend appearance baked; not a new3D model. Full SSIM/halo metrics NOT RUN.
PASS: Chromium and WebKit1440×900/390×844 chapter seek, replay, recomposition chapter, reduced-motion/static mode, horizontal overflow0, pageerror list empty. Evidence/reference/tests.json and screenshots, manually viewed. Full console/network/security test not implied.
Entry/exit/no-JS results: see evidence/reference/entry-tests.json if present; otherwise NOT RUN/completion pending. Hardware FPS, GPU texture cleanup, full AT, all previous portfolio regressions NOT RUN.

PASS: actual selected JBL preview open/close three cycles in Chromium SwiftShader; title, focus and scroll restored; no-JS6 chapters. Evidence/reference/entry-tests.json. No actual GPU memory/10-cycle leak claim. Leader positions use DOM anchors on transformed planes; desktop/phone visual evidence recorded.

## Full-resolution quality checkpoint
Executed quality_reference.py with isolated scikit-image tooling: RGB SSIM0.9971875017 vs original, target≥0.995 PASS. All six alpha sanity checks PASS (background correctly opaque). Evidence: evidence/jbl/quality-reference.json. Previous SSIM NOT RUN references are historical; halo certification remains NOT RUN. Camera/surface transition work still pending; no owner input needed.

## Gate1 checkpoint
Actual exact board/camera pose restoration PASS in Chromium3 cycles (entry-tests.json);10 unit cycles/interruption/reduced motion PASS (surface-transition.txt); existing5-page header/mobile menu Chromium/WebKit and MeeTab wheel/focus PASS (header-regression.log). New reference tests after project-JSON/no-JS changes PASS (tests.json). Full hardware/AT/context-loss/memory suite remains NOT RUN.

Standalone preview validation: HTTP Chromium load/chapter seek PASS; file:// opening BLOCKED by managed-browser administrator policy, not tested on owner device. Save the supplied HTML locally to try it; if local file opening fails, serve it with a simple local HTTP server. Evidence/reference/standalone-test.json.

## Reclined reference revision
reference_browser.py now checks the poster has reclined before the hero layer has any Z lift, records actual plane depths, and checks chapter seek/replay/return/reduced-motion/overflow/page errors. Current run results in evidence/reference/tests.json; screenshots include reclined and exploded states. This does not rerun unchanged showroom entry transitions or constitute physical device testing.

## Owner-requested recline revision
Poster reclines70° before any separation; layer offsets yield45° upward rise before the slight yaw. CSS3D pose is applied to each plane directly with perspective on the board, avoiding nested image composition. Layers paint as individually decoded alpha backgrounds. Original start/end image and static/reduced-motion chapters preserved. Updated browser screenshots require visual review in addition to matrix checks; matrix checks alone do not certify actual compositing.

Reclined revision final check: Chromium/WebKit1440×900 and390×844 PASS for recline-before-lift sequencing, measured plane separation, chapter seek/replay/reduced-motion and overflow. Final WebKit desktop/mobile screenshots manually inspected and now visibly separated; earlier flattened screenshots were replaced after direct-per-plane projection correction. No physical Safari/iPhone claim.

## Softer diagonal revision
PASS: Chromium/WebKit desktop1440×900 and phone390×844 for48° recline-before-lift, measured layer separation, chapter seek/replay/reduced-motion, overflow0 and no pageerror. WebKit desktop exploded and phone reclined screenshots manually reviewed. Evidence/reference/tests.json and screenshots reflect this latest revision. No physical-device claim.

## Rigid left-lean revision
Chromium/WebKit1440×900 and390×844 PASS: recline before lift, actual projected plane separation, seek/replay/reduced-motion, overflow0, pageerror0. Latest screenshots manually reviewed at the reclined pose; no claim of physical-device validation. Source artwork unchanged. Evidence/reference/tests.json.

## Annotation/step polish
PASS: Chromium/WebKit desktop1440×900 and phone390×844, source dot count4, fully cyan active step, paired leader fade weights≈.5/.5 at handoff, navigation/replay/reduced motion, overflow0 and pageerror0 (reference/tests.json). PASS: fixed description endpoint across3 chapters and cancellation of text animation on reduced motion in both browsers (annotation-tests.json). WebKit desktop screenshot visually reviewed for anchored dot, glow and subtle layer shadows. Physical hardware/FPS not measured.

## Live scene / Grid integration
Live scene results and exact conditions are in JBL_SCENE_REPORT.md and reference/*tests.json. Earlier tests failed because exact class expected did not include scene-mode (test corrected), then screenshot exposed an opaque iframe root (runtime corrected). Current visual gate includes actual blue artwork pixels, layer depths, restoration and renderer counts. Three-cycle logical test predates the visual check; do not treat it as visual certification.

Final live-scene visual checks: entry-visual-tests.json1280×720 and entry-phone-tests.json390×844 PASS,6 actual meshes, source support hidden during story, visible blue artwork pixel gate, pose/focus/scroll restored, renderer texture/geometry counts unchanged after disposal. Context-loss full scenario NOT RUN; no physical GPU/FPS claim.

## Tom Ford — 2026-11-27
Current authoritative report: TOMFORD_REPORT.md. PSD effect-aware master fidelity PASS (MAD .1503806277/255, SSIM .9992640880). CSS3D both browsers/desktop+phone, Grid entry, software-GL showroom entry/restoration, JBL regression and shared Node checks passed in recorded artifacts. Early raw-export fidelity failed and was corrected. One early desktop focus assertion failed; repeat passed, render-gating safeguard added, final two-cycle desktop rerun PASS in tomford-desktop.json. Standalone local HTTP passed both browsers; file:// blocked by managed-browser policy. Physical devices/AT/hardware FPS/full context-loss/10-cycle actual GPU trend/full app matrix remain NOT RUN. Earlier baseline failures and NOT RUN statuses above are historical, not erased.

## Button navigation2026-11-27
See NAVIGATION_REPORT.md.16 browser-size cases,4 touch cases,4 JBL reference cases,4 Node test files and one real software-GL Tom Ford cycle passed. New source is button-progress.mjs; scrolling no longer selects chapters. Screenshots/JSON retain conditions. Physical hardware/AT/full context-loss/10-cycle GPU trends remain NOT RUN.

Dot refinement2026-11-27: active dot1.65×, project color and soft glow; no outer button frame or dot border. Keyboard-only focus stays on the dot. Browser evidence: evidence/navigation/dot-refinement.json. Artwork and timeline unchanged.

Mobile balance2026-11-27: artwork width budget60vw/34svh/80% stage-height instead of40vw/22svh/50%; compact one-row actions retain44px targets, dot targets32px, long description scrolls within12svh. Desktop unaffected. Final browser matrix: evidence/navigation/tests.json; physical devices remain untested.

## Earth2026-11-27
Earth: eight browser/size cases,2touch,2Grid,2standalone,1actual software-GL scene and4Node test files PASS in recorded evidence. An early Grid assertion failed because it expected the whole class string motion-ready; corrected to a class-token regex, then passed. Full-image fidelity target NOT achieved; masked untouched target PASS; original endpoints retained. Physical hardware/AT/full context-loss/10cycle GPU trend remain NOT RUN.

## Frames / new ZIP2026-11-27
24 Chromium/WebKit viewport cases PASS (navigation/frames-tests.json), actual Earth WebGL scene restore/resource counts PASS (reference/earth-frames-scene.json),4Node test files PASS. Fingertip outside-mask exact RGBA identity PASS (earth/finger-mask-validation.json); initial transparent RGB mismatch corrected using direct paste. Full old-original fidelity not claimed for new supplied reconstruction. Hardware/physical/AT/full context-loss/10cycle GPU trend remain NOT RUN.

## Holographic frames2026-11-27
Current artifacts in evidence/holographic.36 screenshots, pose equality,24navigation cases,6frame checks,6alpha/fallback/resize/reduced-motion checks PASS; grid opaque/transparent ratio≈.2976. Isolated software-GL all3projects before/after console errors0 and resources0 after disposal. Actual phone scene checks PASS. Actual desktop Tom exit focus assertion FAIL; source entry untouched, previously observed intermittent issue. Full device/AT/hardware/context-loss/10cycle tests NOT RUN.

## Neutral correction2026-11-27
Owner replaced per-project frame colors with shared ice white#DCEEF2. Current glow.28; desktop bloom.08. Lowest sheet receives a soft contact shadow, not a physically simulated floor-shadow claim. Assets/poses/navigation unchanged. Previous color tables/screenshots are historical. Current frame/quality/software-GL checks in holographic-specific.json, quality.json and webgl-lab.json. No publication.

Grid correction2026-11-27: current gridCells20 (~14mobile); line width.65DOM/.7shader, minor alpha.075/major.16, darker bottom contact shadow.48. Border/glow/ice-white color and choreography unchanged. Frame quality checks remain in quality.json/webgl-lab.json; not hardware validation.

## Stack ordering2026-11-27
Current math-order/equal-gap/cumulative-dim tests PASS; Chromium/WebKit three-stage screenshots and assertions PASS; real Earth phone software-GL selection/restore/resources PASS. Initial obsolete absolute-depth and unsettled-transform checks failed and were updated to new sequencing semantics; not hidden product passes. Current responsive matrix in stack-navigation.json. Physical device/hardware/AT/full context-loss/10cycle checks remain NOT RUN.

## Audio-first compact refinement2026-11-27
Current correction: original Audio source first; rear+hero-only headphone composite; stationary contact/reflection. Exact source grouping PASS,6Node files PASS;12Chromium/WebKit emulated desktop/phone cases PASS (36stage snapshots), reduced/static PASS, page errors0. Actual phone JBL software-WebGL1cycle PASS with4planes, exact camera/focus/scroll restore and resources22textures/108geometries before=after. Source referenced assets unchanged. Fixed1800ms test initially measured unfinished interpolation; replaced with actual settled-state wait. Initial desktop scene check timed out before entry at scroll_into_view_if_needed; this is recorded as an unsuccessful attempt, not a product-layer failure or pass. See STACK_REPORT.md latest section and current artifacts. Physical device/hardwareGPU/AT/full context-loss/10cycle trend NOT RUN.

Desktop JBL retry: actual softwareGL entry,4planes, headphone-stage ordering and visible artwork succeeded; exit focus restoration **FAIL** (BODY active, preview trigger not focused), reproducing the previously documented desktop limitation. No page errors observed before failure. Assertions after focus (pose/resource equality/no-JS) were NOT RUN in this desktop attempt. Phone full cycle passed those checks. Evidence: reference/compact-jbl-desktop-scene.json/png. This refinement does not claim to fix focus management; no further unrelated source change made.

2026-11-27 constant shade correction: passed sheets now take final brightness.20 immediately when the next rise begins; no progressive dim ramp. Same shared implementation for all3projects and DOM/WebGL. Subsequent chapters retain exactly.20; reassembly restoration unchanged. Regression assertions cover onset and later chapters. No merge/deploy.
