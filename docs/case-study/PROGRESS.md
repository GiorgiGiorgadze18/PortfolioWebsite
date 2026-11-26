# Progress
Gate0 approved, work through Gate1 authorized. Current branch feat/case-study-phase1-engine.
Phases1–3 PARTIAL: working review-only JBL preview, six CSS3D planes with native-scroll timeline, chapter navigation/replay/static semantic fallback and flagged showroom dialog. Public manifest remains published:false. Not production-ready; Gate1 not declared complete.
Asset source: original32 PNGs and owner PSD retained unchanged. export_reference.py bakes Screen/Overlay/Dodge appearance at assembly into normal-alpha planes. Limited-angle2.5D, not3D geometry. Mean recomposition0.235782/255; max87/255. Endpoint always crossfades to untouched original. Alpha/bboxes measured; full halo/SSIM certification NOT RUN.
Browser evidence: evidence/reference/tests.json (Chromium/WebKit1440×900 and390×844; navigation, reverse, replay, reduced motion). Real Chromium software-GL entry test PASS: actual JBL selection, three dialog return cycles, focus/scroll/selection retained; no-JS six chapters. Active-layer SVG leader added, hidden on compact layouts.
Preview: serve repository over HTTP; /case-studies/jbl-preview.html standalone; /projects.html?view=3d&caseStudyPreview=1 review entry on selected JBL. No preview parameter -> no case-study entry.
Remaining: full engine camera/surface transitions beyond overlay, deeper artwork edge/SSIM verification, performance/real GPU/AT and complete regression. No other projects started. No new owner asset action needed.
Latest source commit: git log -1 --format=%H -- docs/case-study/PROGRESS.md. Do not merge/deploy incomplete study despite prior publish intent; report actual scope. No PR yet.

## Full-resolution quality checkpoint
Executed quality_reference.py with isolated scikit-image tooling: RGB SSIM0.9971875017 vs original, target≥0.995 PASS. All six alpha sanity checks PASS (background correctly opaque). Evidence: evidence/jbl/quality-reference.json. Previous SSIM NOT RUN references are historical; halo certification remains NOT RUN. Camera/surface transition work still pending; no owner input needed.
