# Verification — 2026-11-16

The local integration was served under `/PortfolioWebsite/` to match GitHub Pages URL resolution. All seven browser scenarios passed in Chromium:

- 1440×1000 and 820×1000: WebGL artwork, four device inspectors, five collection cards and filters, original JBL artwork, MeeTab booking navigation, iframe identity/state across exit and reentry, repeated toggles, reduced motion, cleanup, and navigation. No JavaScript errors, failed responses, or external resource requests.
- Touch/mobile emulation at 360, 390, and 600 px: all five project dialogs, mobile navigation, no horizontal overflow, and no download of the 3D engine or embedded demo.
- Desktop without WebGL: fallback and project details remained available.
- JavaScript disabled: original artwork links remained available and the loading overlay was removed.

The initial regression found that opening a project from the collection could leave its inspector offscreen. The integration now scrolls the showroom into view; the regression checks the close control is in the viewport.

A production check also exposed a continuously moving Try now control after exiting the camera animation. The control now stays anchored in the showroom, interaction state updates synchronously, and the regression uses normal hit-tested pointer activation plus explicit pointer and keyboard state assertions.

The 38 original tracked files outside `projects.html` were compared byte-for-byte with original commit `9f9d437`; all are unchanged. The source ZIP matches upload commit `ad239da`. The externalized MeeTab document matches the original embedded v0.14 document exactly.

[Machine-readable results](../tests/artifacts/results.json) · [Deployed-source checksums](../tests/artifacts/source-sha256.json)

[Desktop gallery](../tests/artifacts/gallery-1440.png) · [Desktop demo](../tests/artifacts/demo-1440.png) · [Tablet demo](../tests/artifacts/demo-820.png) · [Mobile collection](../tests/artifacts/mobile-390.png)

This is browser emulation using software WebGL, not physical-device or hardware performance certification. A shorter production check is available with `--smoke`; see [SHOWROOM.md](SHOWROOM.md).
