# Current state — Button-driven graphic case studies
Updated2026-11-27 (Asia/Tbilisi). Current branch feat/case-study-button-navigation, base cba02ea984395509ac5598ecb420a585e36680a7. Implementation SHA: `git log -1 --format=%H -- docs/case-study/NAVIGATION_REPORT.md`.

Owner explicitly replaced scroll progression with Previous/Next and vertical dots. Shared button-progress.mjs drives the same pure timelines and smooth transitions; scrolling has no chapter effect. Active dots/Next use project accent; Previous uses navy with project-color overlay. Applies to both JBL and Tom Ford, independent Grid and actual showroom. No production merge/deployment; review flags remain off by default.

Read NAVIGATION_REPORT.md and evidence/navigation/tests.json, node-tests.json, plus evidence/reference/button-navigation-scene.json. Earlier TOMFORD_REPORT.md and JBL reports remain historical evidence for art extraction. Artwork, project choreography JSON and app demos unchanged.

New standalone files: /workspace/portfolio-work/{JBL,TomFord}-case-study-button-preview.html. Earlier scroll preview files and cba02ea remote branch retained for rollback. Review repository URLs unchanged: projects.html?view=3d&caseStudyPreview=1 or ?view=grid&caseStudyPreview=1.

Earth: owner says layered AI unavailable and will supply notes-Earth.md in the existing Drive folder later. Do not claim it has arrived or start extraction now. Existing flattened original can be evaluated after notes arrive. Site-wide rollout of the button style is a future preference, not performed now.

Open QA remains: physical devices, hardware GPU/FPS, AT, hardware Safari WebGL, full context-loss and ten-cycle actual GPU-memory trend. Keep docs/OPEN_VERIFICATION.md limits open.

Dot refinement2026-11-27: active dot1.65×, project color and soft glow; no outer button frame or dot border. Keyboard-only focus stays on the dot. Browser evidence: evidence/navigation/dot-refinement.json. Artwork and timeline unchanged.

Mobile balance2026-11-27: artwork width budget60vw/34svh/80% stage-height instead of40vw/22svh/50%; compact one-row actions retain44px targets, dot targets32px, long description scrolls within12svh. Desktop unaffected. Final browser matrix: evidence/navigation/tests.json; physical devices remain untested.
