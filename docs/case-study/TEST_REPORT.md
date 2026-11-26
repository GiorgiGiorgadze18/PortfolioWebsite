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
