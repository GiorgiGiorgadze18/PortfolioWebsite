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
