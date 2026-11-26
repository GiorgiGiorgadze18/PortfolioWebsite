# Gate 1 — JBL reference review

1. **ფაზა და სტატუსი:** Phase1-ის მინიმალური ძრავი და Phase2–3-ის JBL რეფერენსი მზადაა Gate1-ის ვიზუალური განხილვისთვის. ეს არ არის მთელი Case Study სისტემის საბოლოო გამოშვება.
2. **მანამდე:** სანახავი reference იყო, მაგრამ რეალურ დაფას/კამერას შესვლა-გამოსვლის გადასვლა არ ჰქონდა.
3. **პრობლემა:** parent scene-სა და presentation-ს შორის მყისიერი გადახტომა; მდგომარეობის აღდგენის მხოლოდ mock შემოწმება; no-JS-ის ცარიელი pin სივრცის რისკი.
4. **ცვლილება:** რეალური დაფა წინ და ოდნავ მაღლა მოდის, კამერა უახლოვდება; დახურვისას საწყისი pose აღდგება. შესვლის შეწყვეტა იმავე მიმდინარე პოზიციიდან ბრუნდება.
5. **მიზეზი:** JBL-ის რეფერენსის სრულად გასატესტი შესვლა, თხრობა და გამოსვლა.
6. **ვიზუალი:** ექვსი მართვადი2.5D სიბრტყე, თავების არჩევა/Replay, აქტიურ ფენასთან SVG ხაზი. Original endpoints ხელუხლებელია. კამერის კუთხე შეზღუდულია; სრული360° მოდელი არ იგულისხმება.
7. **ტექნიკა:** surface-transition იმავე showroom rAF-ით მუშაობს; დამატებით rAF-ს არ ქმნის. ძრავის stateAt(p) და critically damped spring უცვლელია. offsets/keyframes/annotationLayers/chapter attribution გადატანილია project JSON-ში. iframe DOM/CSS3D presentation ცალკე რჩება; ეს არ არის ყველა ფენის WebGL-სცენაში გადატანა.
8. **აქტივები:** ორიგინალი PSD უცვლელად Git-ის გარეთ;32PNG არქივი დაცულია. ექვსი derived plane ინარჩუნებს PSD blend appearance-ს აწყობილ პოზიციაში. ეს მიდგომა გამოიყურება როგორც შეზღუდულკუთხიანი2.5D, არა რეალური3D რეკონსტრუქცია.
9. **ფაილები:** shared/{showroom-bridge,surface-transition,entry,reference}.mjs; reference.css; jbl-preview.html; project presentation/chapters JSON; config.json; showroom/showroom.js; unit/browser tests; state docs/evidence/hashes. სრული სია git show --stat-შია.
10. **შენარჩუნებული ფუნქციონალი:** Chromium-ის რეალურ JBL selection-ზე3 შესვლა-დაბრუნებამ camera position/rotation/zoom და board position/rotation/scale ზუსტად აღადგინა. ფოკუსი, სქროლი და არჩეული პროექტი შენარჩუნდა. არსებული header/menu და MeeTab-ის სწრაფი wheel/focus ტესტი გაიარა. სრული app ბიზნესმატრიცა ხელახლა არ გაშვებულა.
11. **ტესტები:** node surface-transition/engine/timeline; reference_browser.py; entry_browser.py; არსებული header_focus.py; standalone local-file test.
12. **რეალური შედეგები:** reference/tests.json: Chromium/WebKit desktop/phone PASS. entry-tests.json: Chromium SwiftShader3 რეალური დაბრუნება PASS. surface-transition.txt:10 unit cycles, interruption/disposal/reduced motion PASS. header-regression.log:5 გვერდის header/mobile menus ორივე ბრაუზერში და MeeTab wheel/focus PASS. SSIM0.9971875 და alpha6 PASS. ეს არ არის მთლიან საიტზე WCAG ან ყველა console/network მდგომარეობის სერტიფიცირება.
13. **Before/After:** ადრე dialog მხოლოდ scene-ს ფარავდა; ახლა რეალური board/camera transition და exact restore აქვს. screenshots და alpha-contact sheet evidence-შია; contact sheet ვიზუალურად განხილულია. ამ მასშტაბზე აშკარა matte/checkerboard არ იკვეთება; ყველა edge-ის forensic halo შემოწმება არ ჩატარებულა.
14. **Performance:** ახალ რეალურ GPU-ზე FPS/texture-memory გაზომვა მიუწვდომელია. CSS3D reference და parent pause იზოლირებულია; software-GL ტესტი არ არის რეალური GPU წარმადობის მტკიცებულება. field CWV NOT RUN.
15. **შეზღუდვები:** blend appearance გამომცხვარია assembled background-ზე; source-original final crossfade რჩება საჭირო (max pixel delta87). სრული diffuse lighting/geometry არაა აღდგენილი. ფიზიკური მოწყობილობები, AT, GPU memory,10 browser leak cycles და სრული context-loss სცენარი NOT RUN. ეს შემდგომ QA-ს ღია საკითხებია და არა დახურული PASS.
16. **გადაწყვეტილებები:** default-ზე feature disabled/published:false; preview query ექსპლიციტურია. საჯარო entry არ დამატებულა. მასალები/ზედა header/დემოების ბიზნესლოგიკა არ შეცვლილა. no-JS/reduced-motion ტექსტი pin-ის გარეშე ჩანს.
17. **Branch/SHA:** feat/case-study-phase1-engine; ანგარიშის შესაბამისი SHA: git log -1 --format=%H -- docs/case-study/GATE_1_REPORT.md.
18. **Rollback:** production merge/deploy არ ყოფილა. ამ ეტაპის კომიტის revert აბრუნებს წინა2467b24-ს; backup/before-case-studies დაცულია. სხვა worktree-ებს reset არ გაუკეთოთ.
19. **შემდეგი:** MASTER-ის Gate1-ის შემდეგ სხვა გრაფიკულ ნამუშევრებზე გადასვლა; წყაროების არარსებობისას მათი pipeline-ის ცალკე შეფასება. შემდგომ Tsero/MeeTab მხოლოდ შემდეგი gates-ის ფარგლებში. საჯარო integration/final QA ცალკე ფაზებია.
20. **მფლობელის მოქმედება:** ნახე standalone JBL-case-study-preview.html და შეაფასე რეფერენსის მოძრაობა/დაშლა. MASTER §3 ითხოვს Gate1-ზე განხილვას და შეჩერებას სხვა პროექტებზე გადასვლამდე. ახალი PSD ან მონაცემი ამჟამად საჭირო არაა.

ტესტის პირობები: headless Chromium/WebKit; desktop1440×900, phone390×844 ემულაცია; parent integration1280×720 SwiftShader; DPR1. standalone ფაილი შეიცავს მხოლოდ საჭირო წარმოებულ გამოსახულებებს/შრიფტებს/სკრიპტს, PSD-ს ან საიდუმლო მონაცემებს არა.

Standalone preview validation: HTTP Chromium load/chapter seek PASS; file:// opening BLOCKED by managed-browser administrator policy, not tested on owner device. Save the supplied HTML locally to try it; if local file opening fails, serve it with a simple local HTTP server. Evidence/reference/standalone-test.json.
