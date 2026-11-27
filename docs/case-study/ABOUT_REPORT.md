# About ინტეგრაცია

მფლობელმა პირდაპირ დაუშვა სამივე გრაფიკული ნამუშევრის საიტზე გამოქვეყნება. მიმდინარე branch feat/case-study-phase4-earth. საწყისი commit da07e3a.

About ღილაკი დაემატა View Original Artwork-ის ზემოთ. გახსნისას selected device-ის pose ინახება, Next იწყებს საერთო timeline-ის დახრასა და ფენების აწევას. აქტიურია იგივე HUD, მარცხენა chapter dots, Previous/Next, Replay და სტატიკური reduced-motion გზა. თითოეული artwork-ის წყარო და გაშლის რიგი არსებულ config-ს ეყრდნობა.

Grid About ხსნის პირდაპირ CSS3D კომპოზიციის modal-ს. გარე ფონი მუქდება და blur10px აქვს. Overlay ზომაა min(1200px,96vw)×94svh. ეს ზომები დამოუკიდებლად შეირჩა, რათა ირგვლივ ფონიც ჩანდეს და მობილურზეც თავსდებოდეს. Showroom-ზე full-viewport გამჭვირვალე HUD გამოიყენება.

გახსნის ღილაკზე focus ბრუნდება ზედაპირის აღდგენის შემდეგ animation-frame-ებზე. ფენების რესურსები ისევ existing lifecycle-ით თავისუფლდება. Public config enabled/published ჩაირთო მხოლოდ სამივე გრაფიკულ case-ზე.

Grid 12cases PASS — Chromium/WebKit ×1440/390 ×3projects, პირდაპირი About, Next/Previous, close/focus, pageerrors0. Shared Node6suites PASS. Actual softwareGL evidence reference/about-*.json-შია. Physical device, hardwareGPU, assistive technology და სრული context-loss matrix NOT RUN. ძველი source/fidelity შეზღუდვები შესაბამის პროექტების ანგარიშებშია შენარჩუნებული. ეს გაშლა ერთხედი source artwork-ის ფენებს იყენებს.

Rollback — წარმოების წინა მდგომარეობა ინახება backup/before-public-case-studies-ზე. მიმდინარე ინტეგრაციის გასაუქმებლად revert integration commit. Original artwork/source backup-ები შენარჩუნებულია.

სამივე რეალური softwareGL phone cycle PASS — JBL,Tom Ford,Earth. თითოეულში4planes, camera/device pose, focus/scroll restoration და before/after texture/geometry counts გაიარა. საწყისი ფერის threshold ტესტი Tom/Earth-ზე ჩავარდა, რადგან მეორე ეტაპზე მომავალი product ფენა მუქდება. geometry/order შემოწმებებთან ერთად nonblank screenshot შემოწმება გამოიყენება, screenshot-ები ხელით განხილულია. ეს ცვლილება ტესტის ძველ bright-product ვარაუდს ასწორებს. Desktop-ის საწყისი scroll_into_view static-box ლოდინი timeout-ით დასრულდა. განმეორებითი შემოწმება native scrollIntoView-ს იყენებს.

Desktop JBL1440×900 recorded assertions PASS — entry,4planes, focus/pose/scroll restore,resource equality,no-JS. Report saved before browser.close. Chromium driver shutdown stalled after assertions; harness interrupted. This is recorded separately from product checks. Previous desktop focus failure did not reproduce after deferred focus restoration. Physical hardware remains untested.
