# ფენების ჩარჩოები და Earth-ის ახალი ZIP

2026-11-27 · მიმდინარე branch: feat/case-study-phase4-earth.

1. **სტატუსი:** განხორციელებულია review ვერსიაში, არა production-ზე. უახლესი მოთხოვნა აერთიანებს ყველა ფენის ჩარჩოებს, ნამუშევრის მარცხენა chapter rail-ს და ZIP-ის თითის შესწორებას.
2. **მანამდე:** Earth ძველი extraction-ით იყო; foreground fingertip მოჭრილი, chapter dots აღწერასთან, plane borders არ იყო.
3. **წყაროები:** Drive Earth folder-ის ახალი earth-hour.zip რეალურად ჩამოიტვირთა და path-traversal შემოწმებით გაიშალა. ფაილები სხვადასხვა ზომის ნამდვილი-alpha PNG-ებია:832×1177,756×1101,426×60,628×615. Archive და hashes შენარჩუნებულია.
4. **ცვლილებები:** Earth ახლა supplied ZIP-ის ფონით, ტექსტის/გრადიენტის პანელით, ჩრდილითა და კაცუნათი მუშაობს. შეინარჩუნა ახალი პანელის ფერები. ადრინდელი gradient/finger procedural draft აღარ არის აქტიური წყარო.
5. **თითი:** image-generation ინსტრუმენტით გაკეთდა ერთი repair. მიღებული მთლიანი გამოსახულებიდან გამოყენებულია მხოლოდ x530,y0,w78,h40 mask, ბოლო10row-ზე feather-ით. დანარჩენი კაცუნას ყველა RGBA byte იდენტურია supplied source-ისა. გენერაცია preserved-ია; სხვა ფორმის/სახის/პოზის ცვლილება არ შემოტანილა.
6. **ჩარჩოები:** ყველა პროექტის ყველა plane-ს აქვს თხელი იასამნისფერი საზღვარი. CSS3D-ში dotted border და უკიდურესად მსუბუქი tint; რეალურ WebGL-ში LineLoop იმავე plane-ის child-ია. ორივე რეალურ depth/pose-ს მიჰყვება და assembly-ზე ფერმკრთალდება.
7. **ნავიგაცია:** chapter rail გადატანილია .pin-ის ცალკე child-ად, ნამუშევრის მარცხნივ. Previous/Next, active enlarged dot, keyboard focus და mobile balance შენარჩუნებულია.
8. **ტექნიკა:** WebGL border geometry/material საზიარო რესურსებია per presentation, არა per frame. exit/failure-ზე dispose სრულდება. დამატებითი renderer/rAF არ შექმნილა. Runtime dependency არ დამატებულა.
9. **აქტივები:** ახალი ZIP და generation source evidence-შია. Original portfolio PNG/სხვა ნამუშევრების source pixels არ შეცვლილა. Importer სრულ canvas-ზე არეგისტრირებს supplied cropped planes-ს; positioning მიახლოებითია და old-original pixel-perfect match არ მტკიცდება.
10. **შენარჩუნებული:** JBL/Tom Ford-ის assets და choreography უცვლელია. Shared source changes არის საზღვრები და rail განლაგება. Source poster რჩება original start/end-სურათად; ახალი ZIP-ის განსხვავებული gradient/shape შეიძლება გარდამავალ crossfade-ში გამოჩნდეს.
11. **ვიზუალური განხილვა:** supplied ZIP contact sheet, repaired finger close-up, composite და actual WebGL frame screenshot ხელით განხილულია. პირველი tip crop-ის შეერთება ხილული იყო და გასწორდა source-aligned masked blend-ით.
12. **ტესტები:**24Chromium/WebKit browser-size cases PASS; actual Earth software-GL entry/exit/resource restoration PASS;4Node test files PASS. დამატებითი border/rail assertions ცალკე artifact-შია. ქვევით მხოლოდ რეალურად შესრულებული სტატუსებია.
13. **Before/After:** no borders → per-plane frames; caption-side dots → artwork-left rail; cropped tip → rounded generated cap. ZIP-ის სხვა წყაროები არ გადახატულა.
14. **Performance:** ერთი actual software-GL cycle-ის renderer counters before/after ერთნაირია (earth-frames-scene.json). ეს არ არის hardware FPS/GPU RAM/10-cycle trend. ახალი generation/tooling არ არის browser dependency; თანხა ინსტრუმენტის შედეგში მითითებული არ ყოფილა.
15. **შეზღუდვები:** supplied ZIP არის owner-provided AI-derived reconstruction, არა თავდაპირველი Illustrator source. Alignment მიახლოებითია. ისტორიული EARTH_REPORT-ის MAD/SSIM არ გამოიყენება ახალ stack-ზე. Physical hardware/phones/AT/full context-loss/10cycleGPU trend კვლავ NOT RUN.
16. **გადაწყვეტილებები:** user-ის „მხოლოდ თითი“ მოთხოვნის გამო generation-ის სხვა პიქსელები არ გამოყენებულა. Original character-ის fully-transparent RGB-ც პირდაპირი paste-ით შენარჩუნდა; საწყისი alpha-composite იდენტურობის შემოწმება10transparent pixel-ზე განსხვავდებოდა და ეს გასწორდა. Active dot-ს mouse frame არ დაბრუნებია.
17. **Branch/SHA:** feat/case-study-phase4-earth; safe previous957d734. მიმდინარე SHA: `git log -1 --format=%H -- docs/case-study/FRAMES_REPORT.md`. საწყისი მიმდინარე draft ჩვენი წინა მოთხოვნის ცვლილებები იყო და შენარჩუნდა/გადამუშავდა მიმდინარე scope-ში; user work არ გადაწერილა.
18. **Rollback:** revert refinement commit ან ახალი branch957d734-დან. Original ZIP/generation/PNG შენარჩუნებულია. არა force-push/reset.
19. **შემდეგი:** ვიზუალური review. No PR/merge/deploy; public case flags კვლავ false. App phases არ დაწყებულა.
20. **მფლობელის მოქმედება:** დამატებითი ფაილი საჭირო არაა. Preview-ები განახლებულია; publish ცალკე ავტორიზაციას ელოდება.

| Test | Expected | Actual | Status |
|---|---|---|---|
| Supplied character outside-mask identity |0RGBA difference | exact, finger-mask-validation.json | PASS |
| Navigation matrix |3projects×2browsers×4sizes |24cases, frames-tests.json | PASS |
| Plane border / left rail | all planes framed; rail left of board | frames-specific.json | PASS |
| Actual scene restore / cleanup | same pose/focus/scroll/resources | earth-frames-scene.json,1software-GL cycle | PASS |
| Shared engine lifecycle | math/reversal/cleanup |4Node test files | PASS |
| Full old-original stack fidelity | exact original despite new source | not claimed; owner supplied different reconstruction | NOT RUN |
| Hardware/physical/AT/context-loss/10cycleGPU | release matrix | not executed | NOT RUN |

## Reproduce / Preview

- Extract evidence/earth/owner-layers.zip to /workspace/portfolio-work/case-study-sources/Earth/new; run `python3 tools/case-study/import_earth_zip.py` from repo root. Generation source is versioned, no regeneration necessary.
- `python3 tests/case-study/frames_browser.py` checks borders/rail.
- `CASE_SLUGS=jbl-artwork,tomford,earthhour CASE_NAV_REPORT=frames-tests.json python3 tests/case-study/navigation_browser.py`.
- `CASE_SLUG=earthhour CASE_CYCLES=1 CASE_WIDTH=390 CASE_HEIGHT=844 CASE_REPORT=earth-frames-scene.json CASE_SCREENSHOT=earth-frames-scene.png python3 tests/case-study/entry_browser.py`.
- Self-contained files: /workspace/portfolio-work/Earth-case-study-preview.html, JBL-case-study-button-preview.html, TomFord-case-study-button-preview.html.
- Real scene review URLs unchanged: projects.html?view=3d&caseStudyPreview=1 or Grid with view=grid; choose artwork → Explore case study. Static semantics and reduced motion remain.

## Files

- CHANGELOG.md
- case-studies/earthhour-preview.html
- case-studies/projects/earthhour/README.md
- case-studies/projects/earthhour/assets/masters/background.png
- case-studies/projects/earthhour/assets/masters/character.png
- case-studies/projects/earthhour/assets/masters/original.png
- case-studies/projects/earthhour/assets/masters/panel.png
- case-studies/projects/earthhour/assets/masters/shadow.png
- case-studies/projects/earthhour/assets/web/background.webp
- case-studies/projects/earthhour/assets/web/character.webp
- case-studies/projects/earthhour/assets/web/panel.webp
- case-studies/projects/earthhour/assets/web/shadow.webp
- case-studies/projects/earthhour/chapters.json
- case-studies/projects/earthhour/manifest.json
- case-studies/shared/reference.css
- case-studies/shared/reference.mjs
- case-studies/shared/webgl-layers.mjs
- docs/case-study/ASSET_MANIFEST.json
- docs/case-study/CLAIMS_LEDGER.json
- docs/case-study/HANDOFF.md
- docs/case-study/PROGRESS.md
- docs/case-study/TEST_REPORT.md
- docs/case-study/evidence/navigation/chromium-earthhour-1440.png
- docs/case-study/evidence/navigation/chromium-earthhour-320.png
- docs/case-study/evidence/navigation/chromium-earthhour-390.png
- docs/case-study/evidence/navigation/chromium-jbl-artwork-1440.png
- docs/case-study/evidence/navigation/chromium-jbl-artwork-320.png
- docs/case-study/evidence/navigation/chromium-jbl-artwork-390.png
- docs/case-study/evidence/navigation/chromium-tomford-1440.png
- docs/case-study/evidence/navigation/chromium-tomford-320.png
- docs/case-study/evidence/navigation/chromium-tomford-390.png
- docs/case-study/evidence/navigation/webkit-earthhour-1440.png
- docs/case-study/evidence/navigation/webkit-earthhour-320.png
- docs/case-study/evidence/navigation/webkit-earthhour-390.png
- docs/case-study/evidence/navigation/webkit-jbl-artwork-1440.png
- docs/case-study/evidence/navigation/webkit-jbl-artwork-320.png
- docs/case-study/evidence/navigation/webkit-jbl-artwork-390.png
- docs/case-study/evidence/navigation/webkit-tomford-1440.png
- docs/case-study/evidence/navigation/webkit-tomford-320.png
- docs/case-study/evidence/navigation/webkit-tomford-390.png
- tests/artifacts/source-sha256.json
- case-studies/projects/earthhour/assets/masters/character-repaired-source.png
- docs/case-study/FRAMES_REPORT.md
- docs/case-study/evidence/earth/finger-generation.png
- docs/case-study/evidence/earth/finger-mask-validation.json
- docs/case-study/evidence/earth/owner-layers.zip
- docs/case-study/evidence/earth/zip-recomposition.png
- docs/case-study/evidence/earth/zip-sources.json
- docs/case-study/evidence/navigation/frames-specific.json
- docs/case-study/evidence/navigation/frames-tests.json
- docs/case-study/evidence/reference/earth-frames-scene.json
- docs/case-study/evidence/reference/earth-frames-scene.png
- tests/case-study/frames_browser.py
- tools/case-study/import_earth_zip.py

No removed or moved files.
