# Graphic Case Study — ღილაკებით ნავიგაცია

თარიღი2026-11-27, Asia/Tbilisi.

1. **სტატუსი:** განხორციელება დასრულებულია სამუშაო ბრენჩზე; საჯარო გამოქვეყნება არ შესრულებულა. მფლობელის ახალი მოთხოვნა ცვლის წინა scroll-driven წესს JBL/Tom Ford-ის გრაფიკულ პრეზენტაციებში.
2. **მანამდე:** ექვსი დანომრილი ჰორიზონტალური ღილაკი,420svh scroll section და სქროლვაზე მიბმული სცენა. მობილურზე ზედმეტი scroll journey იყო საჭირო.
3. **პრობლემები:** ეტაპის მართვა სქროლზე იყო დამოკიდებული; მფლობელს სურდა განზრახ Previous/Next ნაბიჯები. პატარა ეკრანზე header ორ რიგში გადადიოდა; static-mode CSS specificity მალავდა ტექსტურ fallback-ს ზოგ დაბალ ხედში.
4. **ცვლილება:** ვერტიკალური პატარა წერტილები, Previous/Next, საზღვრებზე disabled მდგომარეობა და Replay. სქროლი ეტაპებს აღარ ცვლის. გრძელი pinned სივრცე მოხსნილია. აქტიური სათაური/წერტილი არჩევისთანავე იცვლება; ვიზუალური სცენა რბილად მიდის შესაბამის მდგომარეობამდე.
5. **რატომ:** ეტაპზე გადასვლა გახდა მკაფიო და კონტროლირებადი, შუალედური მოძრაობის შენარჩუნებით. არც ფენები და არც artwork-ის JSON choreography გადაწერილა.
6. **დიზაინი:** Next და აქტიური წერტილი იღებს canonical project accent-ს: JBL #0E89E6, Tom Ford #A88554. Previous ინარჩუნებს navy surface-ს და ნამუშევრის ფერის მსუბუქ gradient overlay-ს. ვერტიკალური წერტილები ვიზუალურად9px-ია, hit targets32×40/44px. ძველი ნეონის/ფენების/ნამუშევრის ფერები არ იცვლება.
7. **ტექნიკა:** createButtonProgress იყენებს არსებულ critically damped spring-ს და ერთ on-demand rAF-ს; ინარჩუნებს სიჩქარეს მიმართულების შეცვლისას, ჩერდება დასვენებისას/hidden tab-ში და წმენდს listeners/frames-ს. stateAt(p) კვლავ pure ფუნქციაა. selectedChapter გამოყოფილია შუალედური progress-ისგან, რათა სწრაფმა Next-მა ტექსტები უკან-წინ არ გადართოს. ძველი progress.mjs რჩება rollback/future use-ისთვის, მაგრამ გრაფიკული shell აღარ იყენებს.
8. **აქტივები:** artwork assets და ორიგინალები უცვლელია. ახალი preview HTML-ები ცალკე სახელებითაა შექმნილი; ძველი scroll preview ფაილები შენარჩუნებულია. ახალი dependency ან ფასიანი ინსტრუმენტი არ გამოყენებულა.
9. **ფაილები:** ქვემოთ სრული ჩამონათვალი; ძირითადი runtime ცვლილებებია shared/reference.mjs, reference.css და ახალი button-progress.mjs. სხვა გვერდების ღილაკებზე სტილი ჯერ არ გადატანილა.
10. **შენარჩუნებული:** ფენების გაშლა/აწყობა, approved რაკურსი, ხაზები/საწყისი წერტილები/glow, static reading, reduced motion, keyboard და iframe-close/focus/scroll/pose აღდგენა. MeeTab/Tsero დემოები და საიტის სხვა გვერდები არ შეცვლილა; მათი სრული ბიზნესსცენარები ამ დავალებაში არ გადატესტილა.
11. **ტესტები:** ცხრილი ქვემოთ. ხელით განხილულია Tom Ford320×568 საბოლოო screenshot; header ერთ ხაზზეა და ორივე ძირითადი ღილაკი ხილულია. ავტომატიკა ზომავს overflow-სა და ღილაკის ხილვადობას.
12. **შედეგები:** PASS-ები ეფუძნება JSON/command artifacts-ს. ადრეულმა reduced-motion შემოწმებამ media-event დამუშავებამდე შეამოწმა WAAPI; ტესტი ასინქრონულ დასრულებას დაელოდა. ადრეული wheel-check string equality spring-ის .02px tail-ს რეაგირებდა; ახლა მოწმდება იგივე აქტიური თავი და <.1px გადახრა. Crossfade ტესტი ზომავს რეალურ შუალედურ weights-ს და არ მოითხოვს სავალდებულო .5/.5 frame-ს software rendering-ზე. ფუნქციონალური შეცდომა სტატიკური fallback-ის visibility-ში გასწორდა.
13. **Before/After:** ჰორიზონტალური ნომრები → ვერტიკალური წერტილები; native scroll target → Previous/Next target;420svh → ერთი interactive viewport embedded რეჟიმში. ჩვეულებრივი გვერდის კითხვა და სტატიკური fallback ინარჩუნებს native scrolling-ს; input არ არის გატაცებული.
14. **Performance:** დასვენებისას ახალი progress loop არ მუშაობს. რეალური სცენის შესრულებულ ერთ software-GL ციკლში renderer counters: textures22→22, geometries108→108. ეს არ არის GPU RAM, hardware FPS ან ten-cycle memory trend. Lighthouse/CWV/FPS ამ ცვლილებაზე არ გაზომილა.
15. **შეზღუდვები:** ფიზიკური iPhone/Android, AT, hardware Safari WebGL და სრული context-loss/ten-cycle GPU trend კვლავ NOT RUN. ბოლო ტესტები viewport/touch ემულაციაა. დაბალი landscape ხედვა აჩვენებს ყველა თავს სტატიკურად. Embedded interactive რეჟიმში page scroll არ არის; გარეთა standalone introduction და static reading ბუნებრივად იკითხება სქროლვით.
16. **დამოუკიდებელი გადაწყვეტილებები:** მობილურის header კომპაქტურ ერთ რიგშია; გამოსახულება დარჩენილი visual container-ის მიხედვით მცირდება. Point controls ინარჩუნებს სახელებს, aria-current-ს, ArrowUp/Down/Home/End და focus outline-ს. სათაურის ცვლილება aria-live polite-ია. case-action CSS ქმნის მომავალში ხელახლა გამოსაყენებელ ვიზუალურ საფუძველს; მიმდინარე დავალება არ ვრცელდება ყველა საიტის ღილაკზე.
17. **Branch/SHA:** feat/case-study-button-navigation; წინა უსაფრთხო კომიტი cba02ea984395509ac5598ecb420a585e36680a7. მიმდინარე კომიტი: `git log -1 --format=%H -- docs/case-study/NAVIGATION_REPORT.md`. დაწყებისას tree სუფთა იყო; მომხმარებლის ცვლილებები არ გადაწერილა.
18. **Rollback:** ძველი remote branch feat/case-study-phase4-tomford ინახავს cba02ea-ს. დაბრუნებისთვის შექმენით ახალი branch ამ SHA-დან ან revert გაუკეთეთ navigation feature commit-ს. არ გამოიყენოთ force-push/reset საერთო branch-ზე. production და backup/before-case-studies უცვლელია.
19. **შემდეგი:** Earth notes-ის მოსვლის შემდეგ არსებული flattened original-იდან meaningful layers-ის გამოყოფის შესაძლებლობას შევაფასებთ. AI ვექტორული წყარო ჯერ არ გვაქვს; არ მტკიცდება დამალული პიქსელების ისტორიულად ზუსტი აღდგენა. ახლა Earth extraction არ დაწყებულა. ღილაკების მსგავსი სტილის site-wide გამოყენება მომავალ სურვილადაა ჩაწერილი.
20. **საჭირო მოქმედებები:** მიმდინარე ნავიგაციისთვის დამატებითი პასუხი საჭირო არ არის. Earth-ის notes-Earth.md-ს ველოდებით მფლობელის მზადყოფნის შეტყობინებასთან ერთად. გამოქვეყნება ცალკე მითითებას მოითხოვს.

## ტესტირების შედეგები

| Test | მოსალოდნელი | რეალური შედეგი | სტატუსი |
|---|---|---|---|
| Button navigation matrix | ორივე artwork,16 browser/size სცენარი | Chromium/WebKit1440×900,390×844,320×568,844×390; dot/Next/Previous/keyboard/bounds/overflow/static/reduced motion | PASS |
| Touch navigation | tap-ით ნაბიჯები და პირდაპირი არჩევა | ორივე artwork / Chromium+WebKit mobile touch emulation | PASS |
| JBL layer/annotation regression | recline, separation, leader handoff, recompose/replay |4 browser/size cases; რეალური შუალედური fade weights; pageerror0 | PASS |
| Actual Tom Ford showroom | Next→Next,5 meshes, exact exit restoration | Chromium SwiftShader390×844,1cycle; resources unchanged; pageerror0 | PASS |
| Progress lifecycle + shared engine | reverse/interrupt, hidden pause/resume, stop at rest, disposal |4 Node test files; mocked lifecycle coverage | PASS |
| Generated preview HTML | Next და dot state ჩაშენებულ ფაილშიც მუშაობდეს | ორივე პროექტი Chromium/WebKit local HTTP | PASS |
| Physical device / hardware FPS / AT | მოწყობილობაზე/დამხმარე ტექნოლოგიით გავლა | არ შესრულებულა | NOT RUN |
| Full demo business regression / context loss / GPU10cycle | სრული release matrix | არ შესრულებულა | NOT RUN |

`pageerror0` არ არის ყველა console/network/security მდგომარეობის სრულად შემოწმების განცხადება. No-JS semantic content სცენის ტესტში შემოწმდა; media static fallback დამატებით16-case მატრიცაშია.

## Evidence / commands

- `python3 tests/case-study/navigation_browser.py` → evidence/navigation/tests.json და12 final interactive screenshots.
- `python3 tests/case-study/touch_navigation_browser.py` → evidence/navigation/touch-tests.json.
- `python3 tests/case-study/reference_browser.py` → evidence/reference/tests.json.
- `CASE_SLUG=tomford CASE_CYCLES=1 CASE_WIDTH=390 CASE_HEIGHT=844 CASE_REPORT=button-navigation-scene.json CASE_SCREENSHOT=button-navigation-scene.png python3 tests/case-study/entry_browser.py`.
- `node --test tests/case-study/*.test.mjs` → evidence/navigation/node-tests.json.
- Generated standalone checks → evidence/navigation/standalone-tests.json; ephemeral local HTTP server, both browsers and both generated files.

Before screenshots: evidence/navigation/before-*.png. After screenshots: evidence/navigation/{chromium,webkit}-{jbl-artwork,tomford}-{1440,390,320}.png. Existing reference/scene screenshots are also retained.

## Preview

Repository HTTP server: `python3 -m http.server 3000`. Existing review entry: projects.html?view=3d&caseStudyPreview=1 or ?view=grid&caseStudyPreview=1. Choose Graphic Design and JBL/Tom Ford, then Explore case study.

Self-contained new files:
- /workspace/portfolio-work/JBL-case-study-button-preview.html
- /workspace/portfolio-work/TomFord-case-study-button-preview.html

Rebuild: esbuild shared/reference.mjs as documented in tools/case-study/package_preview.py, then pass slug jbl-artwork or tomford. File:// testing is limited by managed-browser policy; the generated files are tested over local HTTP. No public hosting claimed.

## სრული ფაილების ჩამონათვალი

- Modified: `AGENTS.md`
- Modified: `CHANGELOG.md`
- Modified: `case-studies/shared/reference.css`
- Modified: `case-studies/shared/reference.mjs`
- Modified: `docs/case-study/ARCHITECTURE.md`
- Modified: `docs/case-study/CLAIMS_LEDGER.json`
- Modified: `docs/case-study/DECISIONS.md`
- Modified: `docs/case-study/HANDOFF.md`
- Modified: `docs/case-study/PLAN.md`
- Modified: `docs/case-study/PROGRESS.md`
- Modified: `docs/case-study/QUESTIONS.md`
- Modified: `docs/case-study/TEST_REPORT.md`
- Modified: `docs/case-study/evidence/reference/chromium-1440-exploded.png`
- Modified: `docs/case-study/evidence/reference/chromium-1440-reclined.png`
- Modified: `docs/case-study/evidence/reference/chromium-390-exploded.png`
- Modified: `docs/case-study/evidence/reference/chromium-390-reclined.png`
- Modified: `docs/case-study/evidence/reference/tests.json`
- Modified: `docs/case-study/evidence/reference/webkit-1440-exploded.png`
- Modified: `docs/case-study/evidence/reference/webkit-1440-reclined.png`
- Modified: `docs/case-study/evidence/reference/webkit-390-exploded.png`
- Modified: `docs/case-study/evidence/reference/webkit-390-reclined.png`
- Modified: `tests/artifacts/source-sha256.json`
- Modified: `tests/case-study/entry_browser.py`
- Modified: `tests/case-study/reference_browser.py`
- Created: `case-studies/shared/button-progress.mjs`
- Created: `docs/case-study/NAVIGATION_REPORT.md`
- Created: `docs/case-study/evidence/navigation/before-jbl-desktop.png`
- Created: `docs/case-study/evidence/navigation/before-tomford-phone.png`
- Created: `docs/case-study/evidence/navigation/chromium-jbl-artwork-1440.png`
- Created: `docs/case-study/evidence/navigation/chromium-jbl-artwork-320.png`
- Created: `docs/case-study/evidence/navigation/chromium-jbl-artwork-390.png`
- Created: `docs/case-study/evidence/navigation/chromium-tomford-1440.png`
- Created: `docs/case-study/evidence/navigation/chromium-tomford-320.png`
- Created: `docs/case-study/evidence/navigation/chromium-tomford-390.png`
- Created: `docs/case-study/evidence/navigation/node-tests.json`
- Created: `docs/case-study/evidence/navigation/standalone-tests.json`
- Created: `docs/case-study/evidence/navigation/tests.json`
- Created: `docs/case-study/evidence/navigation/touch-tests.json`
- Created: `docs/case-study/evidence/navigation/webkit-jbl-artwork-1440.png`
- Created: `docs/case-study/evidence/navigation/webkit-jbl-artwork-320.png`
- Created: `docs/case-study/evidence/navigation/webkit-jbl-artwork-390.png`
- Created: `docs/case-study/evidence/navigation/webkit-tomford-1440.png`
- Created: `docs/case-study/evidence/navigation/webkit-tomford-320.png`
- Created: `docs/case-study/evidence/navigation/webkit-tomford-390.png`
- Created: `docs/case-study/evidence/reference/button-navigation-scene.json`
- Created: `docs/case-study/evidence/reference/button-navigation-scene.png`
- Created: `tests/case-study/button-progress.test.mjs`
- Created: `tests/case-study/navigation_browser.py`
- Created: `tests/case-study/touch_navigation_browser.py`

Removed: none. Moved: none. Artwork project data/assets unchanged.
