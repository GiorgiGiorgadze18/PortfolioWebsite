> Update 2026-11-26: Gate 0 approved; Phase 1 started, Gate 1 pending. See PROGRESS.md for current attachment blocker. Earlier pending-Gate-0 wording below is historical.

# Case Study plan — Gate 0
Baseline: `7cd45c57d3177f015efccf42c9c1933b613dd46c`. Branch: `feat/case-study-phase0-audit`.
Only Phase 0 is authorized. Phase 1 awaits explicit Gate 0 approval.

## Capability discovery
See evidence/capabilities.json, inventory.json and browser probe artifacts. Python/Pillow/NumPy/Playwright and Node/npm available. OpenCV, scikit-image, ONNX, torch and rembg absent. No /dev/dri hardware GPU. Chromium uses SwiftShader. Image-editing tool exists but has not been invoked; no paid spend authorized. No API key values inspected or printed. Network probes have 20-second timeouts. Git fetch/branch creation works; backup already exists remotely. No new dependency installation in this phase.

## Checkpoints and acceptance criteria (estimates are review units, not delivery dates)
| Phase | Checkpoint estimate | Acceptance |
|---|---|---|
| 0 | 1 audit/review checkpoint | Inventories, screenshots, measured baseline, capability evidence, risks and plan; Gate 0 |
| 1 | 2 implementation checkpoints after approval | Small data-driven engine, deterministic stateAt(p), lifecycle and state restoration, native scroll, keyboard, Stepper, flag off |
| 2–3 | 2–3 checkpoints; source-dependent | JBL validated alpha layers/reconstruction, outside-mask fidelity and recomposition metrics; reference animation, regression tests; Gate 1 |
| 4 | 1–2 checkpoints per artwork | Tom Ford/Earth Hour individual extraction and choreography, readable annotations, reversible recomposition; Gate 2 |
| 5 | 2 checkpoints | Isolated Tsero adapter, seeded screens, no network writes, sync/reset/fallback; retain standalone demo |
| 6 | 2–3 checkpoints | MeeTab adapter and evidence-backed architecture; no real booking/calendar/support calls; Gate 3 |
| 7–8 | 2 checkpoints | Integration, direct links, accessibility, reduced motion, context failure, 10-cycle cleanup and baseline comparisons; Gate 4 before merge request |

## Regression risks
- `jbl` is MeeTab's legacy ID; JBL graphic uses `jbl-artwork`. Never repurpose `jbl` or break #project/meetab.
- Dual renderers and focus layer: preserve both render paths, shelf side and original selection/camera/focus on exit.
- Current global wheel/drag handlers must yield while a future case-study shell is active.
- MeeTab opaque-origin sandbox and existing wildcard bridge require a dedicated reviewed protocol; no blind origin relaxation.
- Flat artwork lacks hidden pixels and true 360° geometry. Use faithful 2.5D, restricted rotations, validated reconstruction only.
- Tom Ford source is 627×1115; no honest upscaling can recover absent detail.
- New mobile case studies need semantic/static alternatives while existing Try Now retains screenshot + 55% notice policy.
- Hardware GPU, physical devices, assistive technology and field CWV remain unmeasured.

## Current scope — 2026-11-27
Owner approved completion of Tom Ford like JBL without intermediate stops. Tom Ford Phase 4 implementation is complete for review; Earth Hour deferred. Earlier missing-source and Gate1 blockers above are historical. New PSD canvas1524×2784 supersedes the old627×1115 thumbnail as case-study fidelity target. No production publication authorized.
