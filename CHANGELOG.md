# Changelog

## 0.14.2 — 2026-11-19

### Fixed

- Bind the Try now neon trace to the tablet's actual screen overlay so it follows the same transform during entry, dragging, zoom and phone layout changes.
- Keep the phone preview transform on one projection path per frame and avoid clearing WebGL buffers for unchanged viewport notifications.

### Verification

Chromium phone (390 px, DPR 2), WebKit phone (390 px), and Chromium desktop (1280 px) passed the targeted regression. Ten unchanged resize events produced 0 drawing-buffer dimension writes, versus 80 in the baseline. A real phone width change produced the 4 required writes; a settled phone preview produced 0 transform changes. Drag/zoom/orientation alignment, booking navigation, retained iframe state, reduced motion and gallery cleanup passed. These are emulated browser checks, not physical-device measurements.

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
