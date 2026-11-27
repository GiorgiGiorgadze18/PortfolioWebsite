# Current state — Holographic frame refinement
2026-11-27 Asia/Tbilisi. Same branch feat/case-study-phase4-earth; base0a6c888. Latest report HOLOGRAPHIC_REPORT.md; implementation SHA: git log -1 --format=%H -- docs/case-study/HOLOGRAPHIC_REPORT.md.

Scope strictly frames. No assets/choreography/camera/annotations/copy/navigation edits. Each project manifest gains only frame:{color,gridCells,glow}; optional color2 supported. JBL#0078d8, Tom Ford#b98a46, Earth#AD94D9 (owner explicitly corrected initial green). Missing config derives saturated hue from background+hero with neutral fallback and contrast adjustment.

DOM frame canvas paints only on resize, masks grid over opaque artwork; WebGL uses shared procedural ShaderMaterial and padded overlay geometry. Opacity .18+.82*spread, phone density70%, no phone bloom; no idle breathing or new rAF. Reduced-motion/static fallback preserved. Source assets and project presentation/chapters JSON unchanged.

Evidence: holographic/{before,after,comparison,colors,quality,webgl-lab}.json and index.html.36 matched screenshots, exact pose equality; navigation24cases and extra6quality/6frame cases passed. Actual scene phone JBL/Tom/Earth passed. Desktop Tom focus-return intermittent FAIL remains (historically observed too); no entry/navigation fixes applied due explicit scope. development-failures.json records it. No physical/hardware GPU/AT/full context-loss/10cycle trend claimed.

No PR/merge/deploy. All published/enabled flags remain false. New standalone previews rebuilt using package_preview.py. Rollback base0a6c888. Complete updated source export generated outside repository for owner review.

## Neutral correction2026-11-27
Owner replaced per-project frame colors with shared ice white#DCEEF2. Current glow.28; desktop bloom.08. Lowest sheet receives a soft contact shadow, not a physically simulated floor-shadow claim. Assets/poses/navigation unchanged. Previous color tables/screenshots are historical. Current frame/quality/software-GL checks in holographic-specific.json, quality.json and webgl-lab.json. No publication.
