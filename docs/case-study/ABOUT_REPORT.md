# About ინტეგრაცია

მფლობელმა პირდაპირ დაუშვა სამივე გრაფიკული ნამუშევრის საიტზე გამოქვეყნება. მიმდინარე branch feat/case-study-phase4-earth. საწყისი commit da07e3a.

About ღილაკი დაემატა View Original Artwork-ის ზემოთ. გახსნისას selected device-ის pose ინახება, Next იწყებს საერთო timeline-ის დახრასა და ფენების აწევას. აქტიურია იგივე HUD, მარცხენა chapter dots, Previous/Next, Replay და სტატიკური reduced-motion გზა. თითოეული artwork-ის წყარო და გაშლის რიგი არსებულ config-ს ეყრდნობა.

Grid About ხსნის პირდაპირ CSS3D კომპოზიციის modal-ს. გარე ფონი მუქდება და blur10px აქვს. Overlay ზომაა min(1200px,96vw)×94svh. ეს ზომები დამოუკიდებლად შეირჩა, რათა ირგვლივ ფონიც ჩანდეს და მობილურზეც თავსდებოდეს. Showroom-ზე full-viewport გამჭვირვალე HUD გამოიყენება.

გახსნის ღილაკზე focus ბრუნდება ზედაპირის აღდგენის შემდეგ animation-frame-ებზე. ფენების რესურსები ისევ existing lifecycle-ით თავისუფლდება. Public config enabled/published ჩაირთო მხოლოდ სამივე გრაფიკულ case-ზე.

Grid 12cases PASS — Chromium/WebKit ×1440/390 ×3projects, პირდაპირი About, Next/Previous, close/focus, pageerrors0. Shared Node6suites PASS. Actual softwareGL evidence reference/about-*.json-შია. Physical device, hardwareGPU, assistive technology და სრული context-loss matrix NOT RUN. ძველი source/fidelity შეზღუდვები შესაბამის პროექტების ანგარიშებშია შენარჩუნებული. ეს გაშლა ერთხედი source artwork-ის ფენებს იყენებს.

Rollback — წარმოების წინა მდგომარეობა ინახება backup/before-public-case-studies-ზე. მიმდინარე ინტეგრაციის გასაუქმებლად revert integration commit. Original artwork/source backup-ები შენარჩუნებულია.

სამივე რეალური softwareGL phone cycle PASS — JBL,Tom Ford,Earth. თითოეულში4planes, camera/device pose, focus/scroll restoration და before/after texture/geometry counts გაიარა. საწყისი ფერის threshold ტესტი Tom/Earth-ზე ჩავარდა, რადგან მეორე ეტაპზე მომავალი product ფენა მუქდება. geometry/order შემოწმებებთან ერთად nonblank screenshot შემოწმება გამოიყენება, screenshot-ები ხელით განხილულია. ეს ცვლილება ტესტის ძველ bright-product ვარაუდს ასწორებს. Desktop-ის საწყისი scroll_into_view static-box ლოდინი timeout-ით დასრულდა. განმეორებითი შემოწმება native scrollIntoView-ს იყენებს.

Desktop JBL1440×900 recorded assertions PASS — entry,4planes, focus/pose/scroll restore,resource equality,no-JS. Report saved before browser.close. Chromium driver shutdown stalled after assertions; harness interrupted. This is recorded separately from product checks. Previous desktop focus failure did not reproduce after deferred focus restoration. Physical hardware remains untested.

## კონტროლებისა და შესვლის დახვეწა

About და View Artwork ერთ რიგშია, ერთნაირი ფორმითა და სიმაღლით. About-ს ნამუშევრის ფერის ჩარჩო და გამჭვირვალე ფონი აქვს. დატვირთვისას ღილაკის ტექსტი აღარ იცვლება. HUD მზადყოფნის შეტყობინების შემდეგ ჩნდება და არსებული chapter spring ხელახლა აქტიურდება ხილულ iframe-ში.

პლანშეტის საწყისი პოზიცია და ეკრანზე ზომა ინახება. case-study ზომაზე, პოზიციასა და დახრაზე გადასვლა650ms smoothstep ინტერპოლაციით იმართება არსებულ render loop-ში. შესვლის ფაზა chapter spring-ის.18 ნიშნულამდე ავტომატურად მიდის. Next უკვე ფენებს შლის. Reduced motion დაუყოვნებლივ აჩვენებს შესაბამის სტატიკურ გზას.

Quit არის ცალკე მეორადი მოქმედება. Refresh-ის18px SVG აიქონი44px სამიზნეში Next-ის მარჯვნივ მოთავსდა. მობილურზე ყველა chapter წერტილისა და action-ის სამიზნე44px-ია, ძირითადი აღწერა14px, metadata10px. Refresh-ს ხელმისაწვდომი სახელი და tooltip აქვს. ეს განლაგება დამოუკიდებლად შეირჩა, რათა თავიდან დაწყება chapter ნავიგაციასთან ყოფილიყო, გასვლა კი ცალკე.

შესვლის საწყისი layout-ის შემდეგ დამატებულია პირველი ზუსტი render, სრულეკრანიანი გადასვლა ხილვადობის ძველ მდგომარეობაზე აღარ ჩერდება. iframe-ის გამჭვირვალე reveal და ready/visible handshake თავიდან აცილებს დამალულ ფანჯარაში ანიმაციის შეჩერებას. CSS/JS/iframe URL-ების ვერსიები განახლებულია, რომ წინა დათვალიერების cache არ აჩვენებდეს ძველ კონტროლებს.

საწყის ტესტში ვერსიის შეცვლის regex-მა inline import-ის სინტაქსი დააზიანა. ეს აღმოჩნდა ბრაუზერულ შემოწმებაში და გამოსწორდა გამოქვეყნებამდე. შემდეგ inline module-ების სინტაქსი შემოწმდა node --check-ით. ადრეული800ms შემოწმება შეიცვალა რეალურად მიღწეული pose-ის ლოდინით. წარუმატებელი და შეწყვეტილი ადრეული შემოწმებები საბოლოო PASS-ად არ ითვლება.

შემოწმებები შესრულებულია ემულაციაში და software-WebGL-ზე. ფიზიკური მოწყობილობები, hardwareGPU FPS და სრული screen-reader შემოწმება NOT RUN. საწყისი რელიზი ინახება backup/before-case-study-controls-ზე, commit d5178a9. Rollback — ახალი refinement commit-ის revert.

## მიმდინარე ტესტები

| შემოწმება | მოსალოდნელი შედეგი | ფაქტობრივი შედეგი | სტატუსი |
|---|---|---|---|
| Grid responsive actions |3works×2browsers×4widths |24case, Quit/refresh/Previous/Next/return focus | PASS |
| მობილური მინიმალური ზომა |44px targets, no horizontal overflow |320×740 measured geometry | PASS |
| Node lifecycle/timeline |6suites, restore/reverse |6PASS | PASS |
| Inline/module syntax |valid imports |node --check | PASS |
| მობილური WebGL |entry pose before Next, rank order, exact restore/resources |JBL/Tom Ford/Earth,390×844,1cycle each | PASS |
| Desktop ზომის WebGL |same lifecycle and automatic entry |1440×900,touch-adapted softwareGL,1cycle | PASS |
| HardwareGPU/physical devices/AT |physical verification |unavailable | NOT RUN |

Before/After — evidence/reference/about-jbl.png და refined-jbl.png ერთი390×844 ემულაციის ძველი და ახალი HUD კადრებია. Screenshot-ები ხელით განხილულია. ემულაცია ფიზიკური ტელეფონის შემოწმებას არ უდრის. FPS და hardware Core Web Vitals არ გაზომილა; ახალი render loop არ დამატებულა.

## საბოლოო შედეგი

სტანდარტული desktop softwareGL1440×900 — PASS. Entry pose იცვლება Next-მდე, ორივე Next მოქმედებს, exit აღადგენს focus/scroll/device/camera pose-ს და რესურსების რაოდენობას. მობილური3cycle და touch-adapted desktop cycle ასევე PASS. საწყისი RAF-polling დროის შეცდომები საბოლოო pose-ის timer-polling შემოწმებით აღარ განმეორდა. Hardware GPU/FPS შეფასება NOT RUN.

ბოლო24responsive case ყველა44px სამიზნესა და overflow-ს ამოწმებს, ყველა PASS. დამატებითი320/768 geometry artifact-ებიც PASS. Desktop refresh Next-ის გვერდით ერთ რიგში რჩება. About/View Artwork-ის მოკლე11px ეტიკეტები ერთ რიგშია; ეს შერჩეულია მცირე ეკრანზე წაკითხვისა და მოთავსებისთვის. კადრები evidence/reference/refined-*.png-შია.

ახალი dependency არ დამატებულა. Original artwork/source asset-ები არ შეცვლილა. Source delivery checksums განახლებულია. ამ refinement-ის SHA იძებნება git log --grep='refine About entry and case-study controls'. Rollback — revert ამ commit-ზე ან შეამოწმეთ backup/before-case-study-controls, რომელიცd5178a9-ს ინახავს.

2026-11-27 მფლობელის ახალი შესწორება — About-ზე პლანშეტი ინარჩუნებს ჩვეულებრივ დახრას. ავტომატური.18 ფაზა გაუქმდა. პირველი Next იწყებს დაწოლას timeline-ით, საწყისი quaternion-იდან რბილი გადასვლით. ვრცელდება სამივე ნამუშევარზე. ეს ცვლის წინა ავტომატური დახრის წესს.
