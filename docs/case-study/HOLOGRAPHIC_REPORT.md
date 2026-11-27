# ჰოლოგრაფიული ჩარჩოები — ანგარიში

2026-11-27 · Branch `feat/case-study-phase4-earth` · Base `0a6c888`.

1. **სტატუსი:** მხოლოდ layer-frame refinement დასრულებულია review-სთვის. No merge/deployment/PR. მიმდინარე SHA: `git log -1 --format=%H -- docs/case-study/HOLOGRAPHIC_REPORT.md`.
2. **მანამდე:** ერთიანი იასამნისფერი dotted CSS borders და WebGL LineLoop; შიდა ბადე/edge glow/alpha-aware mask არ იყო.
3. **ცვლილება:** თითოეული არსებული plane-ის დეკორატიული overlay: წვრილი კვადრატული grid, major ხაზები ყოველ4უჯრაზე, მსუბუქი tint,5.5% inner glow და მკაფიო1px საზღვარი. ახალი global blue/purple არ გამოიყენება.
4. **ფერის წყარო:** JBL-ის რეალურ სურათებში saturated hue ლურჯია, არა ვარაუდით brand orange. Tom Ford-ის თბილი პალიტრიდან არჩეულია readable gold. Earth თავდაპირველად მწვანედ იყო, მაგრამ მფლობელის ბოლო მითითებით საბოლოოდ#AD94D9 იასამნისფერია. Explicit manifest config ყოველთვის პრიორიტეტულია.
5. **მომავალი fallback:** frame.color-ის არყოფნისას background+hero RGB pixels→36hue-bin histogram, low-alpha/low-saturation pixels გამოტოვებულია; მინიმუმ1.5% occupancy-ის მქონე ჯგუფებში აირჩევა ყველაზე saturated ჯგუფი. ფერი ნათდება3:1-მდე; hue-ის არქონისას neutral gray გამოიყენება. Browser sampling უმნიშვნელოდ განსხვავდება; მიმდინარე პროექტებს explicit colors აძლევს სტაბილურ შედეგს. არჩეული/ავტომატური ფერები JSON-ში ჩაიწერა.
6. **DOM:** არსებული CSS3D plane-ის child Canvas2D, aria-hidden. ბადე/inner glow თავიდან იხატება მხოლოდ ზომის ცვლილებაზე. Canvas2D არჩეულია per-pixel alpha masking-ის Chromium/WebKit-ში სტაბილურად შესასრულებლად; CSS mask-composite არ შემოტანილა. Initial/resize raster cost არსებობს და ცალკე load-time benchmark არ ჩატარებულა.
7. **WebGL:** ერთი shared ShaderMaterial და padded overlay geometry თითო გახსნილ პრეზენტაციაზე. Existing layer texture მხოლოდ alpha-map-ად გამოიყენება; procedural grid texture არ დამატებულა. onBeforeRender ცვლის shared alpha-map uniform-ს; padding desktop bloom-ს იტევს. depthWrite:false, normal straight-alpha blending, colorspace output;1px AA shader derivatives-ით.
8. **მოძრაობა:** frame opacity=.18+.82×existing spread. Intro/camera/layer offsets და ანოტაციები არ შეცვლილა. Breathing განზრახ არ დამატებულა, რათა idle loop არ იმუშაოს. Explicit per-layer focus phase, tags ან registration crosses base-ში არ იყო; ახალი copy/control არ შემოტანილა.
9. **მობილური:** grid density×.7 (~20cells), bloom გამორთულია, არსებული renderer DPR caps უცვლელია. DOM cap≤2 desktop/≤1.5 mobile მხოლოდ decorative canvas-ისთვის. Zero-size/static/reduced-motion sheet paint გამოტოვებულია. ResizeObserver და GPU რესურსები exit-ზე იწმინდება.
10. **Artwork protection:** gridAlpha×(1-.7×layerAlpha). Synthetic opaque/transparent grid-area alpha ratio≈.2976 ორივე ბრაუზერში. Source textures/assets არ შეცვლილა; მხოლოდ overlays. Manifests-ში frame block-ის ამოღებით old JSON ზუსტად იგივეა.
11. **პოზების მტკიცებულება:** Chromium desktop1440×900 და phone390×844; ყველა პროექტზე progress0/.5/.75 before/after screenshot —36PNG. ყველა plane transform string before/after იდენტურია. Screenshot test hook მხოლოდ test route-შია, production კოდში არ არის.
12. **შენარჩუნება:** camera/choreography/presentation.json/chapters.json/assets/navigation/labels/fonts/colors outside frames უცვლელია, Git diff-ითაც გადამოწმდა. Assembled state-ში source image იგივეა; მოთხოვნილი .18 frame opacity განზრახ faint decoration-ია და whole-screen pixel identity არ მტკიცდება.
13. **ტესტები:** ქვევით ცხრილი/არტიფაქტები. Grid opacity, resize, reduced motion და automatic palette contrast ორივე ბრაუზერში შემოწმდა. Frame alpha mask/geometry დამატებითი განლაგების ფუნქცია არ არის.
14. **ზომვები:** DOM CPU update და isolated software-GL render+finish ცალკეა წარმოდგენილი. არცერთი არის field CWV ან hardware FPS. თითო batch90DOM updates /24GL renders; მცირე სხვაობები noise-ითაც იცვლება, speedup claim არ კეთდება. თავდაპირველი parallel-GL გაზომვები შედარებად არ ჩაითვალა და საბოლოო before→after ცალ-ცალკე გავიდა, სხვა GPU ტესტების შემდეგ.
15. **ცნობილი პრობლემა:** დესკტოპის Tom Ford actual-scene test-მა ჯერ frame-stability timeout, შემდეგ exit focus assertion FAIL აჩვენა (active BODY, bridge idle, inspector not inert, pageerror0). ეს intermittent focus failure ადრე TOMFORD_REPORT.md-შიც იყო აღწერილი. Entry/navigation არ შეცვლილა ამ მკაცრი frame-only scope-ში. Tom Ford phone retry PASS, shader harness PASS; desktop full-exit PASS არ მტკიცდება.
16. **შეზღუდვები:** hardware GPU, physical iPhone/Android, AT, full context-loss და10-cycle actualGPU trend NOT RUN. Static screenshots/resize tests არ არის ყველა hardware-ზე moiré/flicker-ის გარანტია. GPU numbers არის isolated small harness, არა full-showroom FPS.
17. **უსაფრთხოება/წვდომა:** overlays aria-hidden/pointer-events:none; caption/HUD რჩება ცალკე z-layer-ზე და ტექსტი არ გადახატულა. No service writes, no real messages, no paid generation ამ refinement-ში. ახალი runtime dependency არ არის.
18. **სტილი:** აუცილებელი გადაწყვეტილება აღარ დარჩა. თითო manifest-ში frame.color/color2/gridCells/glow შეიცვლება; gridCells8..64, default28; glow0..1, default.52. Edge width fixed.055; major cadence4. Optional color2 ზედა edge-ს/UV mix-ს ეხმარება; გამოუყენებლობისას primary color მეორდება.
19. **Rollback:** safe base0a6c888; revert ახალი frame-refinement commit ან ახალი branch ამ base-დან. არ გამოიყენოთ force-push/reset საერთო worktree-ზე. Source assets/earlier ZIP/gen/backup refs შენარჩუნებულია.
20. **შემდეგი:** მფლობელის review. Published/enabled flags false; მხოლოდ ცალკე „publish“ მითითების შემდეგ შეიძლება release. აქ production-ready შეფასება არ გაკეთებულა.

## ფერები

| Project | frame.color | Contrast vs dark showroom |
|---|---|---|
| jbl-artwork | `#0078d8` | 4.41:1 |
| tomford | `#b98a46` | 6.39:1 |
| earthhour | `#AD94D9` | 7.55:1 |

Contrast calculation uses relative sRGB luminance against approximately#060A14 (background luminance.0031). Annotation text colors remain unchanged. Caption/HUD stays above sheets; this is not a full WCAG audit.

## DOM update CPU — median / p95 milliseconds

Chromium headless, DPR1, no network throttling, native fonts/assets,90 direct engine.seek calls per case. Timed section includes existing transform/annotation layout work and new frame-opacity update; no full GPU compositing or initial Canvas paint timing. Base source served directly from Git0a6c888. Files before.json/after.json preserve samples and exact poses.

| Project / viewport | Median before | Median after | Difference | P95 before | P95 after |
|---|---|---|---|---|---|
| jbl-artwork / 1440×900 | 0.500 | 0.900 | +0.400 | 0.900 | 1.800 |
| jbl-artwork / 390×844 | 0.300 | 0.200 | -0.100 | 1.200 | 0.700 |
| tomford / 1440×900 | 0.500 | 0.400 | -0.100 | 1.100 | 1.000 |
| tomford / 390×844 | 0.200 | 0.200 | +0.000 | 0.700 | 0.700 |
| earthhour / 1440×900 | 0.500 | 0.400 | -0.100 | 1.100 | 0.900 |
| earthhour / 390×844 | 0.200 | 0.300 | +0.100 | 0.800 | 0.700 |

## Isolated software WebGL — render+finish milliseconds

Chromium headless SwiftShader,320×400,DPR1,AAoff,24render+gl.finish samples. Same source textures/poses before and after; not the full showroom, not physical-device FPS. Both variants warmed once before sampling. All console/pageerror arrays empty; every stage disposed to0geometries/0textures.

| Project | Median before | Median after | Difference | Draw calls before/after | Active geometries before/after |
|---|---|---|---|---|---|
| jbl-artwork | 0.800 | 0.500 | -0.300 | 18 / 18 | 2 / 2 |
| tomford | 0.500 | 0.500 | +0.000 | 16 / 16 | 2 / 2 |
| earthhour | 0.300 | 0.300 | +0.000 | 13 / 13 | 2 / 2 |

## ტესტები

| Test | Expected | Actual | Status |
|---|---|---|---|
| Exact-progress screenshots / poses | unchanged choreography |36screenshots,18pose matches | PASS |
| Project palette / contrast |3different colors≥3:1 | colors.json; Earth final purple | PASS |
| Opaque-grid attenuation |≈.3ratio |≈.2976 Chromium/WebKit | PASS |
| Fallback / resize / reduced motion | safe future defaults and static reading |6cases, quality.json | PASS |
| Navigation / overflow / mobile landscape |3projects×2browsers×4viewports |24cases, holographic-navigation.json | PASS |
| Canvas frames / left rail | no position change |6cases, holographic-specific.json | PASS |
| Isolated shader / console / disposal |3projects both versions |6cases, console errors0, resources0 | PASS |
| Actual phone scenes | shader, art visibility, exact restore/resources | JBL/Tom Ford/Earth SwiftShader,1cycle each | PASS |
| Actual desktop Tom full exit | focus restore | intermittent failure, development-failures.json | FAIL |
| Generated self-contained previews |3files×2browsers, sheets/Next | standalone.json | PASS |
| Unit config/lifecycle/spring | preserve old engine math |5test files | PASS |
| Physical/hardware/AT/context-loss/10cycleGPU | release matrix | not executed | NOT RUN |

## Review / Code / Config

Before/after gallery: evidence/holographic/index.html. Screenshots: before/after-{project}-{1440,390}-{0,0.5,0.75}.png. Actual scene screenshots: evidence/reference/holographic-*-scene.png and holographic-tomford-phone.png. Chosen/fallback colors in colors.json/quality.json. Failure details explicitly retained in development-failures.json.

Self-contained updated previews:
- /workspace/portfolio-work/JBL-case-study-button-preview.html
- /workspace/portfolio-work/TomFord-case-study-button-preview.html
- /workspace/portfolio-work/Earth-case-study-preview.html

Complete updated text/code files exported to /workspace/portfolio-work/Holographic-complete-code.md, path above each full file. Binary PNG screenshots are separate artifacts; no image source pixels changed. Standalone before/after gallery exported to /workspace/portfolio-work/Holographic-before-after.html.

Config example (per project manifest):
```json
"frame": {"color":"#AD94D9", "gridCells":28, "glow":0.52}
```

Tests: holographic_browser.py before/after; frame_quality_browser.py; frame_webgl_lab.py; frames_browser.py; navigation_browser.py with CASE_SLUGS=jbl-artwork,tomford,earthhour; actual entry_browser.py reports; node --test tests/case-study/*.test.mjs. All artifacts record actual scope/conditions.

## ფაილები

- CHANGELOG.md
- case-studies/projects/earthhour/manifest.json
- case-studies/projects/jbl-artwork/manifest.json
- case-studies/projects/tomford/manifest.json
- case-studies/shared/reference.css
- case-studies/shared/reference.mjs
- case-studies/shared/webgl-layers.mjs
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
- tests/case-study/frames_browser.py
- case-studies/shared/frame-shader.mjs
- case-studies/shared/frame-style.mjs
- docs/case-study/HOLOGRAPHIC_REPORT.md
- docs/case-study/evidence/holographic/after-earthhour-1440-0.5.png
- docs/case-study/evidence/holographic/after-earthhour-1440-0.75.png
- docs/case-study/evidence/holographic/after-earthhour-1440-0.png
- docs/case-study/evidence/holographic/after-earthhour-390-0.5.png
- docs/case-study/evidence/holographic/after-earthhour-390-0.75.png
- docs/case-study/evidence/holographic/after-earthhour-390-0.png
- docs/case-study/evidence/holographic/after-jbl-artwork-1440-0.5.png
- docs/case-study/evidence/holographic/after-jbl-artwork-1440-0.75.png
- docs/case-study/evidence/holographic/after-jbl-artwork-1440-0.png
- docs/case-study/evidence/holographic/after-jbl-artwork-390-0.5.png
- docs/case-study/evidence/holographic/after-jbl-artwork-390-0.75.png
- docs/case-study/evidence/holographic/after-jbl-artwork-390-0.png
- docs/case-study/evidence/holographic/after-tomford-1440-0.5.png
- docs/case-study/evidence/holographic/after-tomford-1440-0.75.png
- docs/case-study/evidence/holographic/after-tomford-1440-0.png
- docs/case-study/evidence/holographic/after-tomford-390-0.5.png
- docs/case-study/evidence/holographic/after-tomford-390-0.75.png
- docs/case-study/evidence/holographic/after-tomford-390-0.png
- docs/case-study/evidence/holographic/after.json
- docs/case-study/evidence/holographic/before-earthhour-1440-0.5.png
- docs/case-study/evidence/holographic/before-earthhour-1440-0.75.png
- docs/case-study/evidence/holographic/before-earthhour-1440-0.png
- docs/case-study/evidence/holographic/before-earthhour-390-0.5.png
- docs/case-study/evidence/holographic/before-earthhour-390-0.75.png
- docs/case-study/evidence/holographic/before-earthhour-390-0.png
- docs/case-study/evidence/holographic/before-jbl-artwork-1440-0.5.png
- docs/case-study/evidence/holographic/before-jbl-artwork-1440-0.75.png
- docs/case-study/evidence/holographic/before-jbl-artwork-1440-0.png
- docs/case-study/evidence/holographic/before-jbl-artwork-390-0.5.png
- docs/case-study/evidence/holographic/before-jbl-artwork-390-0.75.png
- docs/case-study/evidence/holographic/before-jbl-artwork-390-0.png
- docs/case-study/evidence/holographic/before-tomford-1440-0.5.png
- docs/case-study/evidence/holographic/before-tomford-1440-0.75.png
- docs/case-study/evidence/holographic/before-tomford-1440-0.png
- docs/case-study/evidence/holographic/before-tomford-390-0.5.png
- docs/case-study/evidence/holographic/before-tomford-390-0.75.png
- docs/case-study/evidence/holographic/before-tomford-390-0.png
- docs/case-study/evidence/holographic/before.json
- docs/case-study/evidence/holographic/colors.json
- docs/case-study/evidence/holographic/comparison.json
- docs/case-study/evidence/holographic/development-failures.json
- docs/case-study/evidence/holographic/index.html
- docs/case-study/evidence/holographic/node-tests.json
- docs/case-study/evidence/holographic/quality.json
- docs/case-study/evidence/holographic/webgl-lab.json
- docs/case-study/evidence/navigation/holographic-navigation.json
- docs/case-study/evidence/navigation/holographic-specific.json
- docs/case-study/evidence/reference/holographic-earth-scene.json
- docs/case-study/evidence/reference/holographic-earth-scene.png
- docs/case-study/evidence/reference/holographic-jbl-scene.json
- docs/case-study/evidence/reference/holographic-jbl-scene.png
- docs/case-study/evidence/reference/holographic-tomford-phone.json
- docs/case-study/evidence/reference/holographic-tomford-phone.png
- docs/case-study/evidence/reference/holographic-tomford-scene.png
- tests/case-study/frame-style.test.mjs
- tests/case-study/frame_quality_browser.py
- tests/case-study/frame_webgl_lab.py
- tests/case-study/holographic_browser.py

Removed/moved files: none.
