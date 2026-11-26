# Phase 0 — Baseline audit & planning

1. **ფაზა და სტატუსი:** Phase 0 შესრულებულია; Gate 0 ელოდება მფლობელის განხილვას. Phase 1 არ დაწყებულა.
2. **საწყისი მდგომარეობა:** main `7cd45c57d3177f015efccf42c9c1933b613dd46c`; ორი ბოლო კომიტი case-study პრომპტებს ამატებს. საიტის ბოლო პროდუქტის ცვლილება არის `c60d7cb`. სამუშაო ხე დაწყებისას სუფთა იყო; ღია PR-ების სია ცარიელია (evidence/open-prs.json). სარეზერვო `backup/before-case-studies` დაცულია.
3. **აღმოჩენილი პრობლემები:** მაღალი — ფენები/აღდგენილი ფონები/შესაბამისი ვალიდაცია არ არსებობს, ამიტომ exploded animation-ის აქტივები ჯერ მზად არაა; საშუალო — Tom Ford მხოლოდ 627×1115; მაღალი ინტეგრაციის რისკი — `jbl` MeeTab-ის ID-ია, JBL გრაფიკა `jbl-artwork`; საშუალო — ორი renderer და wheel/focus მართვა მოითხოვს ზუსტ აღდგენას; მაღალი სამომავლო რისკი — MeeTab-ის opaque sandbox და არსებული wildcard messaging ახალ presentation protocol-ს პირდაპირ ვერ ჩაანაცვლებს. ესენი აუდიტის მიგნებებია და ამ ფაზაში არ შესწორებულა.
4. **რა შეიცვალა:** დაემატა მხოლოდ აუდიტის state files, მტკიცებულებები და AGENTS-ის მითითება. პროდუქტის კოდი არ შეცვლილა.
5. **რატომ:** ახალი სესია უნდა აგრძელებდეს იმავე მტკიცებულებებიდან და იცავდეს Gate 0-ს.
6. **ვიზუალური გაუმჯობესება:** ამ ფაზაში არ ყოფილა. originals-contact.png, graphics-1440.png და showroom-390.png ვიზუალურად განხილულია. არსებობს ოთხი ზომის საწყისი სქრინები; Before/After პროდუქტის ცვლილება არ არის.
7. **ტექნიკური გაუმჯობესება:** დოკუმენტირებულია DisplaySurface, IDs, adapter საზღვრები, rollback და ტესტების პირობები. ახალი engine არ დაწერილა.
8. **ახალი აქტივები:** მხოლოდ baseline სქრინები და კვლევის contact sheet; წარმოებისთვის ახალი გრაფიკული ფენები არ შექმნილა. PNG-ების SHA-256, ზომები და ბაიტები ASSET_MANIFEST-შია.
9. **ფაილები:** PLAN.md, PROGRESS.md, ARCHITECTURE.md, TEST_REPORT.md, ASSET_MANIFEST.json, HANDOFF.md, DECISIONS.md, CLAIMS_LEDGER.json, QUESTIONS.md, PHASE_00_REPORT.md და evidence/; AGENTS.md-ში დამატებულია მითითება. წაშლილი/გადაადგილებული პროდუქტის ფაილები: 0.
10. **შენარჩუნებული ფუნქციონალი:** მიმდინარე 3D gallery ოთხ viewport-ზე ჩაიტვირთა, გრაფიკული მხარის გადართვა desktop-ზე შესრულდა. დემოების სრული სცენარები, selection/exit, keyboard/AT ამ ფაზაში არ გადატესტილა. არსებული წინა NOT RUN პუნქტები docs/OPEN_VERIFICATION.md-ში ძალაში რჩება.
11. **ჩატარებული ტესტები:** baseline.py; Chromium screenshots + 10-second rAF sampling; Python HTTPS probes; live Chromium Grid; WebKit/Firefox გაშვების მცდელობები; ZIP/ფაილების inventory; git refs და open PR list.
12. **რეალური შედეგები:** იხილეთ TEST_REPORT.md და ქვემოთ ცხრილები. PASS მხოლოდ კონკრეტულ დაფარვას ნიშნავს.
13. **Before/After:** მიმდინარე მდგომარეობა დაფიქსირებულია; პროდუქტის After არ არსებობს, რადგან Phase 1 არ დაწყებულა.
14. **გაზომილი Performance:** ქვემოთ. local HTTP, Chromium headless, SwiftShader, DPR1, throttling-ის გარეშე. rAF cadence არ უდრის renderer-ის draw timing-ს ან რეალური GPU-ს FPS-ს. transfer size ადგილობრივი სერვერისაა და წარმოების compression/cache-ს არ ასახავს. Heap ერთი snapshot-ია, memory leak-ს ვერ ამტკიცებს/უარყოფს. INP/field CWV/GPU memory მიუწვდომელია.

| Viewport | LCP ms | CLS | Load ms | rAF mean/p95 ms | JS page errors |
|---|---:|---:|---:|---:|---:|
| 1440×900 | 3108 | 0.0181 | 853 | 1853.5 / 2433.2 | 0 |
| 1280×720 | 892 | 0.0118 | 543 | 1458.2 / 2199.9 | 0 |
| 820×1180 | 1288 | 0.0306 | 534 | 642.9 / 1900.0 | 0 |
| 390×844 | 852 | 0.0276 | 500 | 351.1 / 999.9 | 0 |

15. **შეზღუდვები:** რეალური GPU/ფიზიკური ტელეფონები არ გვაქვს; Firefox binary არ არის; WebKit მხოლოდ launch probe-ით შემოწმდა, სრული სცენარები NOT RUN. Browser console.error ცალკე არ შეგროვებულა, მხოლოდ pageerror; შესაბამისად სრული „console errors 0“ მტკიცებულება არ არსებობს. Live browser Grid მოინახულა ignore_https_errors რეჟიმში; Python HTTPS 200 ცალკეა. backend/private repos ამ ფაზაში არ შემოწმებულა; MeeTab-ის production არქიტექტურის მტკიცებულება ჯერ არ არსებობს.
16. **დამოუკიდებელი გადაწყვეტილებები:** არსებული პოსტერის პანელები რჩება DisplaySurface-ად; სტატიკური stack რჩება; ახალ დამოკიდებულებებს/გენერაციას არ ვიყენებთ; დაუდასტურებელი case study გამოუქვეყნებელია. საბოლოო მონტაჟის განსხვავებული მიმართულება Gate 0-ზე შეიძლება შეიცვალოს.
17. **Branch / SHA:** `feat/case-study-phase0-audit`; baseline `7cd45c57d3177f015efccf42c9c1933b613dd46c`. აუდიტის კომიტისთვის `git log -1 --format=%H -- docs/case-study/PROGRESS.md`; დასრულების პასუხში სრული SHA იქნება მითითებული.
18. **Rollback:** Phase 0 პროდუქტის ცვლილებას არ შეიცავს. main-ზე გადასვლა აბრუნებს აუდიტამდე worktree-ს; სხვა worktree/backup არ შეცვალოთ. აუდიტის შემდეგ ფაზებს ჰქონდეს ცალკე branch და შემდგომი revert; არ გამოიყენოთ force-push/reset.
19. **შემდეგი ეტაპი:** მხოლოდ Gate 0-ის შემდეგ — მინიმალური shared engine + JBL აქტივები/რეფერენსი; შემდეგ Gate 1. ეტაპობრივი checkpoint-ები PLAN.md-შია; დროის ზუსტი შეფასება extraction-ის გამოცდამდე არ იქნება სანდო.
20. **მფლობელის საჭირო მოქმედებები:** ერთიანი ოთხპუნქტიანი QUESTIONS.md: ხელმისაწვდომი ფენები/მაღალი რეზოლუცია; საჭიროების შემთხვევაში გენერაციის თანხმობა/ხარჯი; დადასტურებული rationale/problem framing; Gate 0-ის დამტკიცება ან გეგმის კორექტირება. პასუხამდე Phase 1 არ დაიწყება. Merge/deploy არ შესრულებულა.
