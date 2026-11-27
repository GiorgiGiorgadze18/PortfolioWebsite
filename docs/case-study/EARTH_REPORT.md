# Phase4 — Earth: ანგარიში

2026-11-27, Asia/Tbilisi.

1. **სტატუსი:** Earth-ის განხორციელება დასრულებულია review ბრენჩზე. მფლობელმა პირდაპირ მოგვცა .ai-ის შემოწმებისა და შეუსაბამობის შემთხვევაში ორიგინალიდან ფენების გამოყოფის უფლება. გამოქვეყნება არ შესრულებულა.
2. **მანამდე:** არსებობდა1797×2542 flattened original; Earth-ის case study არ იყო. მოგვაწოდეს notes და გენერირებული AI, არა თავდაპირველი editable source.
3. **აღმოჩენილი:** AI რეალურად გაიხსნა/render-და; შეცვლილი იყო კაცუნას ფორმა, ხელი და ტიპოგრაფიული განლაგება. შედარების კადრი შენარჩუნებულია. პირველი დაბალი-MAD extraction პანელზე ფრაგმენტებს ტოვებდა და ვიზუალური შემოწმების შემდეგ უარყოფილია.
4. **შესრულებული:** ორიგინალიდან ფონი/წარწერა/ღრუბლები, ცალკე კაცუნა, ცალკე ოვალური ჩრდილი და ცალკე მწვანე ტექსტის პანელი. გაკეთდა6მოკლე თავი notes-ზე დაყრდნობით.
5. **მიზეზი:** მომხმარებლის ორიგინალის ფორმების, ტექსტისა და განწყობის შენარჩუნება; გენერირებულ AI-ზე დაყრდნობა გადააკეთებდა ნამუშევარს.
6. **დიზაინი:** კაცუნა პირველი ამოდის და ყველაზე მაღლა რჩება; მის ქვეშ ჩრდილია; უფრო ქვემოთ მწვანე ტექსტის ჩარჩო. იგივე დამტკიცებული საერთო რაკურსი, project-specific separation windows, იასამნისფერი UI აქცენტები, frameless enlarged active dots და Previous/Next.
7. **ტექნიკა:** ახალი პროექტი არსებულ data-driven engine-შია რეგისტრირებული. Runtime core ან აპების ბიზნესლოგიკა არ შეცვლილა;4plane ორივე CSS3D/Grid და რეალურ Three.js scene-ში იტვირთება. Scoping მხოლოდ Earth leader ფერებს ეხება. ახალი runtime dependency არ დამატებულა.
8. **აქტივები:** source PNG უცვლელია, SHA `8a0ccf80fb26dabb55293dec39ff3cd83d38d0097b9e8a178393bc1eaa6cbf66`. PNG masters, WebP planes, character/processing masks და original endpoint versioned-ია. AI ორიგინალი ინახება source საქაღალდეში, hash და preview — evidence-ში. ახალი ფასიანი გენერაცია არ გამოყენებულა.
9. **ფაილები:** სრული ჩამონათვალი ქვემოთ; ძირითადი ახალი ნაწილი projects/earthhour, earthhour-preview.html და export_earth.py-ა. Export იყენებს Pillow/NumPy/SciPy-ს მხოლოდ development tooling-ში.
10. **შენარჩუნებული:** original artwork, ქვედა ტექსტები/წარწერის ფორმები/ფერები, მიმდინარე ღილაკები/მობილური ბალანსი, pure stateAt(p), scene camera/device/focus/scroll restore. JBL/Tom Ford project data/assets არ შეცვლილა. Home/About/Contact და აპები არ შეცვლილა; მათი სრული სცენარები არ გადატესტილა.
11. **შემოწმება:** source AI rendering, contact sheet და recomposition ხელით განხილულია; ასევე WebKit phone პრეზენტაცია და actual Chromium software-GL phone სცენა. Browser-size მატრიცა არის ემულაცია, არა ფიზიკური ტელეფონები.
12. **შედეგები:** ქვემოთ ცხრილი. Early Grid test FAIL გამოწვეული იყო მოძველებული exact-class assertion-ით; embedded-mode token-ის გათვალისწინების შემდეგ ორივე ბრაუზერი PASS. Initial imperfect extraction discarded. Asset quality არ შეფასებულა მხოლოდ დაბალი საშუალო სხვაობით.
13. **Before/After:** ადრე ერთი flat preview; ახლა სამი meaningful foreground ფენა და ფონი, annotation chapters და button-controlled გაშლა. Before screenshot არის source artwork-ის შემცირებული ასლი და არა წინასწარ გადაღებული browser frame. After კადრები navigation და actual-scene evidence-შია.
14. **Performance:** აქტიურ სცენაში დამატებითი renderer/rAF არ შექმნილა. ერთი შესრულებული software-GL ციკლის counters: textures22→22, geometries108→108. ეს არ არის GPU RAM, hardware FPS ან10-cycle leak certification. Preview HTML დაახლოებით1.1MB-ია; ეს არ არის production network transfer გაზომვა. FPS/Lighthouse/CWV ამ ცვლილებაზე არ გაზომილა.
15. **შეზღუდვები:** upper panel dome/gradient და კაცუნას ქვეშ დამალული shadow edge რეკონსტრუქციაა. Source character-ის EARTH წარწერით დაფარული თითის წვერი ისტორიულად არ აღდგენილა. ეს2.5D planes-ია და არა ხელახლა მიღებული Illustrator source ან360° მოდელი. Full-image fidelity target ვერ მიიღწა; original endpoint crossfade აუცილებელია. Physical devices/hardware GPU/AT/full context-loss/10-cycle GPU trend ღიად რჩება.
16. **დამოუკიდებელი არჩევანი:** AI უარყოფილია, გამოყენებულია deterministic color/edge separation და flat gradient/oval reconstruction; არ გამოიყენება ახალი image generation. დამუშავების mask კონსერვატიულია და შეიცავს character separation-საც; მისი ყველა პიქსელი არ ნიშნავს გენერირებულ ან შეცვლილ პიქსელს. სრული original crossfade უცვლელ start/end-ს უზრუნველყოფს. Typography არის source pixels; font attribution მხოლოდ მფლობელის ცნობაზეა დაფუძნებული.
17. **Branch/SHA:** feat/case-study-phase4-earth, საწყისი f56fb53 (წინა mobile-balance branch). SHA: `git log -1 --format=%H -- docs/case-study/EARTH_REPORT.md`. დაწყებისას tree სუფთა იყო. დასრულებული კოდი ინახება ცალკე branch-ზე; production არ შეცვლილა.
18. **Rollback:** ახალი branch შექმენით f56fb53-დან ან revert გაუკეთეთ Earth feature commit-ს. არ გამოიყენოთ force-push/reset სხვა სამუშაოზე. feat/case-study-button-navigation და backup/before-case-studies შენარჩუნებულია; original PNG/AI არ გადაწერილა.
19. **შემდეგი:** Earth-ის ვიზუალური review და შემდგომ ცალკე approved QA/app phases. Gate3/4 ან production readiness დასრულებულად არ ითვლება.
20. **მფლობელის მოქმედება:** Earth-ისთვის დამატებითი წყარო ახლა საჭირო არ არის. მზადაა გასახსნელი preview; production გამოქვეყნება ცალკე მითითებას მოითხოვს.

## ფაქტობრივი ტესტები

| Test | მოსალოდნელი | შედეგი | სტატუსი |
|---|---|---|---|
| AI-ის შეფასება | original-ის შენარჩუნება | სხვა ფორმა/ჟესტი/layout; fidelity source-ად უარყოფილია | FAIL |
| Untouched-region fidelity | MAD≤1/255; SSIM≥.995 | MAD0/255; SSIM .999969694,1,763,800 untouched pixels | PASS |
| Whole-image recomposition | სრული fidelity target | MAD1.1874979294/255; max233; SSIM .986795048 | FAIL |
| Original endpoints | ორიგინალი დასაწყისში/ბოლოში | unchanged full-resolution original WebP | PASS source validation |
| Character/shadow/panel order | character first/highest, shadow middle | pure timeline/layerProgress depth tests | PASS |
| CSS3D/button matrix | ორივე ბრაუზერი4ზომაზე | Chromium/WebKit1440×900,390×844,320×568,844×390; no overflow/pageerror | PASS |
| Touch | Next/Previous/direct dot tap | Chromium/WebKit mobile touch emulation | PASS |
| Grid entry/focus | Earth iframe და ზუსტი დაბრუნება | Chromium/WebKit390×844 | PASS |
| Real showroom |4planes, source visible, exact restore | Chromium SwiftShader390×844,1cycle, counters unchanged | PASS |
| Generated HTML | დამოუკიდებელი ფაილი მუშაობდეს | local HTTP Chromium/WebKit; Next chapter verified | PASS |
| Shared math/lifecycle | reverse, interruption, hidden pause/dispose |4Node test files; mock lifecycle | PASS |
| Physical devices/hardware/AT/full context loss/GPU10cycles | release matrix | არ შესრულებულა | NOT RUN |

ამ ცხრილის FAIL შედეგები არ არის დამალული ან PASS-ად გადაკეთებული. Full-image target-ის მაგივრად masked untouched validation გამოიყენება და ზუსტი original start/end ცალკე სურათით ინარჩუნებს ნამუშევარს. `validated:true` აღნიშნავს ამ დოკუმენტირებულ masked-quality და ვიზუალურ შემოწმებას; `published:false` უცვლელია.

## Evidence და ბრძანებები

- evidence/earth/notes-Earth.md — მფლობელის ფაქტები/მიზნები.
- evidence/earth/{rejected-ai-preview,before-original,layers,recomposition}.png და validation.json.
- evidence/earth/{order-tests,node-tests,standalone-tests}.json.
- evidence/navigation/earth-tests.json და {chromium,webkit}-earthhour-*.png.
- evidence/navigation/earth-touch.json.
- evidence/reference/{earth-grid,earth-scene}.json და earth-scene.png.

```sh
python3 tools/case-study/export_earth.py
CASE_SLUGS=earthhour CASE_NAV_REPORT=earth-tests.json python3 tests/case-study/navigation_browser.py
CASE_SLUGS=earthhour CASE_TOUCH_REPORT=earth-touch.json python3 tests/case-study/touch_navigation_browser.py
CASE_SLUG=earthhour CASE_GRID_REPORT=earth-grid.json python3 tests/case-study/grid_case_browser.py
CASE_SLUG=earthhour CASE_CYCLES=1 CASE_WIDTH=390 CASE_HEIGHT=844 CASE_REPORT=earth-scene.json CASE_SCREENSHOT=earth-scene.png python3 tests/case-study/entry_browser.py
node --test tests/case-study/*.test.mjs
```

SSIM supplement measured with Python/skimage after master export; no new browser dependency. Exact measured values preserved in validation.json.

## Preview

`python3 -m http.server 3000` repository root-ში:
- Independent: `case-studies/earthhour-preview.html`.
- Grid: `projects.html?view=grid&caseStudyPreview=1` → Earth About → Explore case study.
- Real scene: `projects.html?view=3d&caseStudyPreview=1` → Graphic Design → Earth → Explore case study.
- Self-contained: `/workspace/portfolio-work/Earth-case-study-preview.html` (local HTTP-ით ორივე ბრაუზერში გადამოწმებულია; managed browser file:// პოლიტიკა წინა ანგარიშებშია).

ყველა feature flag/published false; მიმდინარე production ვერსიაზე ახალი ღილაკი ჯერ არ გამოჩენილა.

## სრული ფაილების ჩამონათვალი

- Modified: `AGENTS.md`
- Modified: `CHANGELOG.md`
- Modified: `case-studies/config.json`
- Modified: `case-studies/shared/reference.css`
- Modified: `docs/case-study/ARCHITECTURE.md`
- Modified: `docs/case-study/ASSET_MANIFEST.json`
- Modified: `docs/case-study/CLAIMS_LEDGER.json`
- Modified: `docs/case-study/DECISIONS.md`
- Modified: `docs/case-study/HANDOFF.md`
- Modified: `docs/case-study/PLAN.md`
- Modified: `docs/case-study/PROGRESS.md`
- Modified: `docs/case-study/QUESTIONS.md`
- Modified: `docs/case-study/TEST_REPORT.md`
- Modified: `tests/artifacts/source-sha256.json`
- Modified: `tests/case-study/entry_browser.py`
- Modified: `tests/case-study/grid_case_browser.py`
- Modified: `tests/case-study/navigation_browser.py`
- Modified: `tests/case-study/touch_navigation_browser.py`
- Created: `case-studies/earthhour-preview.html`
- Created: `case-studies/projects/earthhour/README.md`
- Created: `case-studies/projects/earthhour/assets/masks/character.png`
- Created: `case-studies/projects/earthhour/assets/masks/processing.png`
- Created: `case-studies/projects/earthhour/assets/masters/background.png`
- Created: `case-studies/projects/earthhour/assets/masters/character.png`
- Created: `case-studies/projects/earthhour/assets/masters/original.png`
- Created: `case-studies/projects/earthhour/assets/masters/panel.png`
- Created: `case-studies/projects/earthhour/assets/masters/shadow.png`
- Created: `case-studies/projects/earthhour/assets/web/background.webp`
- Created: `case-studies/projects/earthhour/assets/web/character.webp`
- Created: `case-studies/projects/earthhour/assets/web/original.webp`
- Created: `case-studies/projects/earthhour/assets/web/panel.webp`
- Created: `case-studies/projects/earthhour/assets/web/shadow.webp`
- Created: `case-studies/projects/earthhour/chapters.json`
- Created: `case-studies/projects/earthhour/manifest.json`
- Created: `case-studies/projects/earthhour/presentation.json`
- Created: `docs/case-study/EARTH_REPORT.md`
- Created: `docs/case-study/evidence/earth/before-original.png`
- Created: `docs/case-study/evidence/earth/layers.png`
- Created: `docs/case-study/evidence/earth/node-tests.json`
- Created: `docs/case-study/evidence/earth/notes-Earth.md`
- Created: `docs/case-study/evidence/earth/order-tests.json`
- Created: `docs/case-study/evidence/earth/recomposition.png`
- Created: `docs/case-study/evidence/earth/rejected-ai-preview.png`
- Created: `docs/case-study/evidence/earth/standalone-tests.json`
- Created: `docs/case-study/evidence/earth/validation.json`
- Created: `docs/case-study/evidence/navigation/chromium-earthhour-1440.png`
- Created: `docs/case-study/evidence/navigation/chromium-earthhour-320.png`
- Created: `docs/case-study/evidence/navigation/chromium-earthhour-390.png`
- Created: `docs/case-study/evidence/navigation/earth-tests.json`
- Created: `docs/case-study/evidence/navigation/earth-touch.json`
- Created: `docs/case-study/evidence/navigation/webkit-earthhour-1440.png`
- Created: `docs/case-study/evidence/navigation/webkit-earthhour-320.png`
- Created: `docs/case-study/evidence/navigation/webkit-earthhour-390.png`
- Created: `docs/case-study/evidence/reference/earth-grid.json`
- Created: `docs/case-study/evidence/reference/earth-scene.json`
- Created: `docs/case-study/evidence/reference/earth-scene.png`
- Created: `tools/case-study/export_earth.py`

Removed: none. Moved: none.
