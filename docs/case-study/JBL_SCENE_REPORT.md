# JBL — შოურუმის ზედაპირიდან გაშლის ინტეგრაცია

1. **სტატუსი:** JBL-ის ორი წარმოდგენა განხორციელებულია review რეჟიმში: რეალური Three.js display-surface და დამოუკიდებელი Grid პრეზენტაცია. ეს არ არის ყველა Case Study-ის საბოლოო გამოშვება.
2. **მანამდე:** შოურუმიდან იხსნებოდა იგივე CSS3D iframe; რეალურ დივაისს მხოლოდ შესვლა/დაბრუნების მოძრაობა ჰქონდა.
3. **პრობლემები:** ფენები შოურუმის ეკრანზე არ იყო; ადრეულ HUD-ში iframe-ის dark color-scheme ფონი სცენას ფარავდა; მობილურზე ძველი კონტროლების visibility შვილებზე გადმოდიოდა.
4. **რა შეიცვალა:** ექვსი ტექსტურირებული PlaneGeometry ემატება არჩეულ JBL-ის ეკრანს; tilt/spread პირდაპირ JSON timeline-ით იმართება. ფონი ეკრანზე რჩება. Grid-ის About-დან ცალკე CSS3D პრეზენტაცია იხსნება.
5. **რატომ:** მფლობელის მოთხოვნით რეალურ დივაისზე წარმოდგენა და Grid-ის დამოუკიდებელი რეჟიმი განსხვავდება, თუმცა ერთსა და იმავე შინაარსს იყენებს.
6. **ვიზუალი:** ჩატში მოცემულ ისომეტრიულ მაგალითთან მორგებული საერთო ორიენტაცია — pitch60°/yaw22°/roll−10°-ის ეკვივალენტი ერთი fixed-axis ბრუნვით. ფენები საერთო ზედაპირის ნორმალზე იწევა. ეს ვიზუალური მორგებაა და არა სურათიდან კამერის კალიბრაციის გაზომვა. დივაისის bezel/material რჩება; პოსტერის საყრდენი მხოლოდ პრეზენტაციისას იმალება და შემდეგ აღდგება.
7. **ტექნიკა:** webgl-layers.mjs დამოუკიდებელ renderer/rAF-ს არ ქმნის; იყენებს არსებულ focusRenderer-სა და render loop-ს. პროექტის assets lazy-load-ით იტვირთება. parent იღებს მხოლოდ მიმდინარე iframe-ის same-origin პროგრესს, ამოწმებს რიცხვებს/საზღვრებს; child ამოწმებს anchor პაკეტებს. რეალური 3D წერტილები HUD-ის SVG ხაზებს მიეწოდება.
8. **აქტივები:** ორიგინალი PNG/PSD არ შეცვლილა. გამოიყენება უკვე შემოწმებული ექვსი WebP plane. გენერაცია/ფასიანი დამუშავება არ ჩატარებულა.
9. **ფაილები:** shared/webgl-layers.mjs, entry.mjs, reference.mjs/css; showroom/showroom.js; project presentation.json; entry/grid tests; evidence და state docs. სრული diff იხილეთ შესაბამის კომიტში.
10. **შენარჩუნებული:** პროგრამების ბიზნესლოგიკა არ შეცვლილა. camera pose/zoom/FOV/aspect/projection offsets აღდგება; ახალი მასალები, ტექსტურები და გეომეტრია dispose-დება; screen/support visibility ბრუნდება. სრულ app ბიზნესმატრიცაზე ახალი ტესტი არ ჩატარებულა.
11. **ტესტები:** რეალური JBL selection → scene → chapter seek → close; pixel check რეალური artwork-ის ხილვადობაზე; resource count before/after; Grid და annotation tests; shared Node checks.
12. **შედეგები:** ქვემოთ ცხრილი და JSON ფაილები. pageerror0 არ უდრის ყველა console/network მდგომარეობის შემოწმებას.

| Test | მოსალოდნელი | რეალური შედეგი | სტატუსი |
|---|---|---|---|
| 3D ექვსი ფენის გაშლა | ზედაპირს სხვადასხვა სიღრმით დაშორდეს | ექვსი mesh და world-space Z განსხვავებები | PASS |
| რეალური გამოსახულება HUD-ის უკან | პოსტერი ჩანდეს | PNG screenshot + მინიმალური blue-pixel შემოწმება | PASS შესაბამის visual/phone JSON-ში |
| pose/resource აღდგენა | camera/device და texture/geometry counts დაბრუნდეს | entry-tests.json, entry-visual-tests.json, entry-phone-tests.json | PASS შესრულებულ ციკლებში |
| Grid რეჟიმი | დამოუკიდებელი CSS3D, ფოკუსის დაბრუნება | Chromium/WebKit phone viewport | PASS |
| დამოუკიდებელი პრეზენტაცია | chapters/replay/reduced motion და overflow | Chromium/WebKit desktop/phone | PASS |
| ხაზის აღწერის პორტი | ტექსტის სიმაღლემ არ გადაახტუნოს | ორივე ბრაუზერი | PASS |
| context-loss სრული სცენარი | Grid/CSS fallback არ ბლოკავდეს ინფორმაციას | კოდი დამატებულია; სრული სცენარი არ გაშვებულა | NOT RUN |
| რეალური iPhone/Android/AT | ფიზიკური/დამხმარე ტექნოლოგიის გავლა | მოწყობილობები მიუწვდომელია | NOT RUN |
| WebGL Safari რეალურ hardware-ზე | იგივე სცენა | Grid/WebKit ტესტი ამას არ ამტკიცებს | NOT RUN |

13. **Before/After:** ადრე მხოლოდ იზოლირებული preview იყო; ახლა actual-webgl-desktop.png და actual-webgl-phone.png შოურუმის რეალურ დივაისს აჩვენებს. სქრინები ვიზუალურად განხილულია, ადრეული გაუმჭვირვალე HUD კადრი შეიცვალა.
14. **Performance:** არსებული loop გამოიყენება; პაუზა სტატიკურ/hidden რეჟიმში; სტაბილურ პროგრესზე ზედმეტი scene drawing გამოტოვებულია. გაზომილია renderer resource counts, არა GPU RAM bytes/FPS/field CWV. software SwiftShader შედეგები რეალური hardware-ის წარმადობად არ ითვლება.
15. **შეზღუდვები:** პოსტერი რეალურ alpha planes-ადაა წარმოდგენილი და არ არის headphones-ის360° მოდელი. წყაროს blend appearance baked-ია. სრული context-loss/AT/ფიზიკური მოწყობილობები/10-cycle GPU-memory trend და ყველა აპის რეგრესია ღიაა. არსებული docs/OPEN_VERIFICATION.md ძალაშია.
16. **დამოუკიდებელი გადაწყვეტილებები:** ეკრანის vanishing point მორგებულია visual stage-ზე, რათა გვერდით HUD-მა რაკურსი არ დაამახინჯოს; გადახრისასავე კამერის projection state ინახება. დაბალ landscape ხედში სტატიკური თავები გამოიყენება. მობილურზე მოქმედება მუდმივ inspector action ზონაშია.
17. **Branch/SHA:** feat/case-study-phase1-engine; git log -1 --format=%H -- docs/case-study/JBL_SCENE_REPORT.md.
18. **Rollback:** production merge/deploy არ შესრულებულა. კომიტის revert ან წინა c1225cc-დან ახალი branch აღადგენს წინა review-ს. original PSD/არქივი და backup/before-case-studies შენარჩუნებულია; სხვა worktree-ებს reset არ გაუკეთოთ.
19. **შემდეგი:** მფლობელის ვიზუალური შეფასება; Tom Ford მხოლოდ წყაროებისა და შემდეგი gate-ის ფარგლებში. სრული საჯარო ინტეგრაცია/QA roadmap ჯერ დასრულებულად არ ითვლება.
20. **საჭირო მოქმედება:** ნახე ახალი რაკურსი და რეალური 3D სქრინები; დამატებითი JBL წყარო ამჟამად არ გვჭირდება. კონტენტი published:false და default entry გამორთულია. MASTER-ის Gate1 review ჯერ არ გადახტუნებულა.

## Preview

- Local HTTP: `python3 -m http.server 3000`; 3D — `projects.html?view=3d&caseStudyPreview=1`, Graphic Design → JBL → Explore case study.
- Grid — `projects.html?view=grid&caseStudyPreview=1`, JBL About → Explore case study.
- დამოუკიდებელი Grid ფაილი: `/workspace/portfolio-work/JBL-case-study-preview-reference-angle.html`; ეს ფაილი რეალური შოურუმის ნაცვლად Grid წარმოდგენას აჩვენებს.

პირობები: headless Chromium/SwiftShader რეალური scene ტესტისთვის; viewport1280×720 და390×844 ემულაცია, DPR1. Grid/reference ასევე WebKit-ში შემოწმდა. იხილეთ JSON-ის რეალური cycles და counts; ძველი სამი ციკლის ტესტი ვიზუალურ pixel-check-ს წინ უსწრებდა და ცალკეა დატოვებული.

## Latest measured renderer counts

| Artifact | Textures before/after | Geometries before/after | Result |
|---|---|---|---|
| entry-visual-tests.json | 24 → 24 | 113 → 113 | PASS / 1 cycle |
| entry-phone-tests.json | 22 → 22 | 108 → 108 | PASS / 1 cycle |

ეს renderer-ის resource counters-ია, არა GPU RAM-ის ბაიტები. Latest visual tests include finite world depths, support hiding, visible artwork pixel check and exact restored pose including camera projection offsets/aspect/FOV.
