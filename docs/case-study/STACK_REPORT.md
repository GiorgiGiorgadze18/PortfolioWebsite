# ქვემოდან ზემოთ გაშლა — ანგარიში

2026-11-27 · branch feat/case-study-phase4-earth · base e885ca3.

1. **სტატუსი:** განხორციელებულია review ვერსიაში; no merge/deploy. მფლობელმა პირდაპირ შეცვალა მოძრაობის წესი, ამიტომ წინა „frame-only/hero-first“ წესები ამ ნაწილზე აღარ მოქმედებს.
2. **მანამდე:** სხვადასხვა artwork-ს სხვადასხვა order/offset ჰქონდა; ყურსასმენის ნაწილები და კვამლი ტექნიკურ planes-ად ცალ-ცალკე იშლებოდა.
3. **პრობლემა:** ტექნიკური slicing არ ემთხვეოდა ვიზუალურად გასაგებ კომპონენტებს; ფენების პოზიციები/ფერთა overlap არათანმიმდევრულად აღიქმებოდა.
4. **რიგი:** Earth panel→shadow→character; JBL stand→headphones→cloud/title; Tom Ford leaf→smoke→bottle. Intro-ის შემდეგ პირველი3Next ზუსტად ამ3საფეხურს მართავს.
5. **დაჯგუფება:** JBL rear/glass/hero ერთ headphone assembly-ად გაერთიანდა; Tom Ford-ის ორივე smoke sheet ერთ smoke plane-ად. Original files შენარჩუნებულია, ახალი WebP composites lossless-ია. თითო პროექტს ახლა background+3semantic planes აქვს.
6. **დაშორება:** საერთო normalized gap150desktop/96mobile. CSS3D და WebGL იყენებს ერთ stack-motion.mjs-ს; units artwork/display width-თან მასშტაბირდება, არა სხვადასხვა მოდელის literal world-meter-თან. ყველა მიმდინარე პროექტის desktop/phone projected-depth სხვაობები თანაბარია browser artifact-ში.
7. **ჩამუქება:** როცა შემდეგი ფენა ამოდის, ყველა გავლილი sheet brightness.52-ზე მიდის; ახლად ამოსული1-ზე რჩება. Opacity არ მცირდება — ფენების ერთმანეთში გამჭვირვალედ შერევა არ დაემატა. DOM brightness მთელ parent plane-ს ეხება; WebGL artwork material და shared frame shader ერთნაირად მუქდება.
8. **გადასვლები:** pure progress windows.24–.34/.39–.49/.54–.64; chapters.35/.5/.65. Existing spring აერთიანებს forward/back/fast clicks-ს. Recompose.82–.94-ში depth და dim იხსნება; original endpoints უცვლელია.
9. **კომპოზიცია:** დესკტოპზე მეტი სივრცის მისაცემად lower offset180; phone-ში კომპაქტურად მასშტაბირდება. Live stack group fit.78 და მცირე vertical adjustment იცავს მაღალი stack-ის framing-ს. Camera FOV/მოდელები/საიტის სხვა გვერდები არ გადაკეთებულა; exit ზუსტად აღადგენს pose-ს.
10. **ფაილები/რეპროდუქცია:** source manifests შენახულია stack-source-manifest.json-ებში. group_stack.py ამ წყაროებიდან ქმნის compositor copies/config-ს; ძველი original assets არ იშლება. სტატიკური თავები და აღწერები ახალ რიგთან სინქრონულია.
11. **შენარჩუნებული:** ice-white frames/grid20/glow.28, bottom contact shadow, dots/Previous/Next/Replay, reduced/static reading და აპების დემოები. სრული აპების ბიზნესტესტები ამ დავალებაში არ ჩატარებულა.
12. **ტესტები:** source-unit ordering/equal-gap/dim/reassembly PASS; Chromium/WebKit step1/2/3 screenshots და assertions PASS; responsive navigation matrix24cases PASS; actual Earth phone software-GL entry/layers/restore/resources PASS.
13. **ადრეული FAIL:** ძველი scene test იყენებდა arbitrary worldZ>.7-ს და პროგრესს ზედმეტად ადრე ამოწმებდა; ახალი საერთო gap-ისთვის შეიცვალა stage-target და rank-order assertions-ით. Wheel test fixed wall-time-ს ეყრდნობოდა, ახლა actual settled transforms-ს ელოდება. ეს test assumptions იყო, არცერთი გაუშვებელი შემოწმება PASS-ად არ მონიშნულა.
14. **Performance:** stack samples per-plane reusable objects-ია; ახალი rAF/renderer არ დამატებულა. Source planes6→4JBL,5→4Tom; source screenshot/compositing boundaries შეიცვალა, original display endpoints დარჩა. FPS/hardwareGPU/time comparison ამ ცვლილებაზე არ გაზომილა. Actual renderer before/after counts იხილეთ stack-earth-scene.json-ში.
15. **შეზღუდვები:** დაკარგული პიქსელები/360° geometry არ აღდგენილა. Tom smoke-front ახლა smoke group-შია bottle-ის ქვემოთ, როგორც მფლობელმა მოითხოვა; ამიტომ source original image endpoint აუცილებელია. ძველი six/five-plane fidelity metrics არ არის ახალი assembled hierarchy-ის pixel identity claim.
16. **QA ლიმიტები:** physical phones/hardware GPU/AT/full context-loss/10cycle GPU trend NOT RUN. Desktop intermittent focus-return issue წინანდელ ანგარიშებში რჩება; ახალი სრული desktop exit coverage აქ არ ივარაუდება.
17. **გადაწყვეტილებები:** თანაბარი3semantic ranks, normalized gap, modest48% brightness reduction, original source preservation და neutral frame look. Copy მხოლოდ ახალი stage behavior-ის აღსაწერად შეიცვალა; ყალბი project facts არ დამატებულა.
18. **Branch/SHA:** feat/case-study-phase4-earth; მიმდინარე SHA: git log -1 --format=%H -- docs/case-study/STACK_REPORT.md. დაწყებისას tree სუფთა იყო. Original source assets არ გადაწერილა.
19. **Rollback:** revert stack feature commit ან ახალი branch e885ca3-დან. Original source manifests/files/backup refs შენარჩუნებულია. Force-push/reset არ გამოიყენოთ.
20. **შემდეგი:** owner preview review. No PR/merge/deployment; enabled/published false. დამატებითი პასუხი/ფაილი ამ ცვლილებისთვის საჭირო არაა.

| Test | Expected | Actual | Status |
|---|---|---|---|
| Pure stack state |rank order, equal gaps, previous dim, reverse |stack-motion.test.mjs | PASS |
| Browser staged movement |3projects×2browsers×2sizes |browser-tests.json,12cases | PASS |
| Responsive/navigation/reduced motion |3×2×4sizes |stack-navigation.json,24cases | PASS |
| Actual Earth surface |4planes, rank order, exact restore |stack-earth-scene.json,1softwareGL cycle | PASS |
| Shared Node checks |timeline/lifecycle/frames/stack |6test files | PASS |
| Full hardware/AT/release matrix |real-device verification |not executed | NOT RUN |

Evidence: evidence/stack/browser-tests.json და {chromium,webkit}-{project}-{1440,390}-step{1,2,3}.png; evidence/navigation/stack-navigation.json; evidence/reference/stack-earth-scene.json/png. Desktop JBL და phone Tom კადრები ხელით განხილულია. Phone და desktop browser viewports ემულაციაა, არა ფიზიკური iPhone/Android.

## Preview / rebuild

- /workspace/portfolio-work/JBL-case-study-button-preview.html
- /workspace/portfolio-work/TomFord-case-study-button-preview.html
- /workspace/portfolio-work/Earth-case-study-preview.html

Real scene: projects.html?view=3d&caseStudyPreview=1 → Graphic Design → artwork → Explore case study. Grid: view=grid.

```sh
python3 tools/case-study/group_stack.py
node --test tests/case-study/*.test.mjs
python3 tests/case-study/stack_browser.py
CASE_SLUGS=jbl-artwork,tomford,earthhour CASE_NAV_REPORT=stack-navigation.json python3 tests/case-study/navigation_browser.py
```

## Files

- CHANGELOG.md
- case-studies/earthhour-preview.html
- case-studies/jbl-preview.html
- case-studies/projects/earthhour/chapters.json
- case-studies/projects/earthhour/presentation.json
- case-studies/projects/jbl-artwork/chapters.json
- case-studies/projects/jbl-artwork/manifest.json
- case-studies/projects/jbl-artwork/presentation.json
- case-studies/projects/tomford/chapters.json
- case-studies/projects/tomford/manifest.json
- case-studies/projects/tomford/presentation.json
- case-studies/shared/frame-shader.mjs
- case-studies/shared/reference.css
- case-studies/shared/reference.mjs
- case-studies/shared/webgl-layers.mjs
- case-studies/tomford-preview.html
- docs/case-study/ARCHITECTURE.md
- docs/case-study/ASSET_MANIFEST.json
- docs/case-study/DECISIONS.md
- docs/case-study/HANDOFF.md
- docs/case-study/PLAN.md
- docs/case-study/PROGRESS.md
- docs/case-study/QUESTIONS.md
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
- tests/case-study/entry_browser.py
- tests/case-study/navigation_browser.py
- tests/case-study/reference_browser.py
- tests/case-study/tomford_browser.py
- case-studies/projects/earthhour/stack-source-manifest.json
- case-studies/projects/jbl-artwork/assets/web/stack-headphones.webp
- case-studies/projects/jbl-artwork/stack-source-manifest.json
- case-studies/projects/tomford/assets/web/stack-smoke.webp
- case-studies/projects/tomford/stack-source-manifest.json
- case-studies/shared/stack-motion.mjs
- docs/case-study/STACK_REPORT.md
- docs/case-study/evidence/navigation/stack-navigation.json
- docs/case-study/evidence/reference/stack-earth-scene.json
- docs/case-study/evidence/reference/stack-earth-scene.png
- docs/case-study/evidence/stack/browser-tests.json
- docs/case-study/evidence/stack/chromium-earthhour-1440-step1.png
- docs/case-study/evidence/stack/chromium-earthhour-1440-step2.png
- docs/case-study/evidence/stack/chromium-earthhour-1440-step3.png
- docs/case-study/evidence/stack/chromium-earthhour-390-step1.png
- docs/case-study/evidence/stack/chromium-earthhour-390-step2.png
- docs/case-study/evidence/stack/chromium-earthhour-390-step3.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-1440-step1.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-1440-step2.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-1440-step3.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-390-step1.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-390-step2.png
- docs/case-study/evidence/stack/chromium-jbl-artwork-390-step3.png
- docs/case-study/evidence/stack/chromium-tomford-1440-step1.png
- docs/case-study/evidence/stack/chromium-tomford-1440-step2.png
- docs/case-study/evidence/stack/chromium-tomford-1440-step3.png
- docs/case-study/evidence/stack/chromium-tomford-390-step1.png
- docs/case-study/evidence/stack/chromium-tomford-390-step2.png
- docs/case-study/evidence/stack/chromium-tomford-390-step3.png
- docs/case-study/evidence/stack/webkit-earthhour-1440-step1.png
- docs/case-study/evidence/stack/webkit-earthhour-1440-step2.png
- docs/case-study/evidence/stack/webkit-earthhour-1440-step3.png
- docs/case-study/evidence/stack/webkit-earthhour-390-step1.png
- docs/case-study/evidence/stack/webkit-earthhour-390-step2.png
- docs/case-study/evidence/stack/webkit-earthhour-390-step3.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-1440-step1.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-1440-step2.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-1440-step3.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-390-step1.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-390-step2.png
- docs/case-study/evidence/stack/webkit-jbl-artwork-390-step3.png
- docs/case-study/evidence/stack/webkit-tomford-1440-step1.png
- docs/case-study/evidence/stack/webkit-tomford-1440-step2.png
- docs/case-study/evidence/stack/webkit-tomford-1440-step3.png
- docs/case-study/evidence/stack/webkit-tomford-390-step1.png
- docs/case-study/evidence/stack/webkit-tomford-390-step2.png
- docs/case-study/evidence/stack/webkit-tomford-390-step3.png
- tests/case-study/stack-motion.test.mjs
- tests/case-study/stack_browser.py
- tools/case-study/group_stack.py

No source asset deletions; no moved files.
