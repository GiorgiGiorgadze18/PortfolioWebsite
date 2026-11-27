# Current state — Earth graphic case study
2026-11-27 Asia/Tbilisi. Branch feat/case-study-phase4-earth, from f56fb53 (latest mobile balance). Current SHA: git log -1 --format=%H -- docs/case-study/EARTH_REPORT.md.

Earth notes read; generated AI rejected for changed shape/gesture/layout. Original PNG unchanged. Four planes: background, reconstructed upper green panel, reconstructed occluded oval shadow, original-pixel character. User ordering: character first/highest, shadow middle, panel lowest. Existing button navigation/dots/mobile balance retained. No apps/production changes.

EARTH_REPORT.md records actual tests/limits. Eight Chromium/WebKit viewport cases, touch, Grid, real Chromium SwiftShader scene1cycle, node and standalone checks passed. Outside documented processing mask: mean difference0/255. Whole-image mean1.1875/255 and SSIM.986795 are NOT exact/full-target fidelity passes; endpoints use actual original. Finger tip previously hidden behind lettering is not recovered.

Preview: projects.html?view=3d&caseStudyPreview=1 or ?view=grid&caseStudyPreview=1 → Earth Hour → Explore case study. Independent case-studies/earthhour-preview.html. Self-contained /workspace/portfolio-work/Earth-case-study-preview.html.

No PR/merge/deployment. All cases remain published:false/global enabled:false. Owner visual review remains appropriate; no more source question needed. Gate3 app cases and Gate4 release QA are not complete. Hardware/physical phones/AT/full context loss/10cycle real GPU trend remain NOT RUN.

## Latest2026-11-27 — Supplied ZIP / frames
See FRAMES_REPORT.md. Owner supplied earth-hour.zip; current Earth layers now use it, not the earlier extraction. Old masked-fidelity metrics describe the historical pipeline only. New importer tools/case-study/import_earth_zip.py; supplied source and generated tip stored in evidence/earth. Only78×40px tip region changes, outside exact RGBA identity passes. Shared rail is left of artwork; CSS3D/WebGL frames added to every plane. Source original and previous commit957d734 retained; no merge/deployment.
