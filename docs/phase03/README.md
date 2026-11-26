# ფაზა 03 — მოძრაობის მართვა და დაბრუნება

2026-11-26. ბრენჩი upgrade/phase01-identity, საწყისი კომიტი a7fadd5. სტატუსი დასრულებულია ამ ეტაპზე განსაზღვრულ მცირე შესწორებებსა და ლაბორატორიულ შემოწმებებში. ანგარიშის ბოლოს მოცემულია დარჩენილი შეზღუდვები.

## მიგნებები და შესრულებული ცვლილებები

ჰოლოგრაფიული ქარდების CSS მოძრაობა ეკრანს მიღმა უკვე ჩერდებოდა. დამალულ ჩანართზე ცალკე შეჩერების წესი არ არსებობდა, ხოლო pointer-ის სამიზნე ფოკუსის დაკარგვის შემდეგ შეიძლებოდა დარჩენილიყო. ახლა visibilitychange აჩერებს მოძრავ ქარდებსა და JS კადრებს, დაბრუნებისას ისევ ამუშავებს მხოლოდ შესაბამის მოძრაობას. blur აბრუნებს დახრილ ქარდებს. ეს ამცირებს არასაჭირო განახლებებსა და დაბრუნებისას დარჩენილი pointer მდგომარეობის ალბათობას.

main.js-ში პარალაქსი და კურსორის ნათება reduced-motion-ის მიმდინარე ცვლილებას არ ითვალისწინებდა. დაემატა საერთო MediaQueryList, პარალაქსის reset, კურსორის დამალვა და კლავიატურით/მაუსით anchor გადასვლისას instant გადაადგილება reduced-motion რეჟიმში. ჩვეულებრივი რეჟიმის native smooth გადასვლა შენარჩუნებულია. საერთო scroll scheduler ახლა hidden მოვლენაზე დაუყოვნებლივ აუქმებს დაგეგმილ კადრს და დაბრუნებისას დროის ნიშნულს ხელახლა იწყებს.

Experience-ის შევსების შესაძლო უწყვეტ მარყუჟზე საწყისი ეჭვი გაზომვამ არ დაადასტურა. ძველსა და ახალ ვარიანტში Chromium-ის ერთნაირ პირობებში 500 მილიწამში 0 დამატებითი callback დაფიქსირდა. შევსების ფორმულა პირვანდელ სახეს დაუბრუნდა. performance გაუმჯობესების რიცხობრივი მტკიცება ამ ფაზიდან არ გამომდინარეობს. მოდულში შეცვლილია საერთო scheduler-ის ვერსიის import.

მოძრაობის აუდიტი მოიცავდა Hero-ის glyph reveal/repel-ს, Hologram-ს, Constellation-ს, Experience-ს, Contact Terminal-ს, პარალაქსს, კურსორის ნათებას და showroom-ის reduced-motion გადასვლებს. Hero და Constellation-ს უკვე აქვს reduced რეჟიმი; Constellation-ს ასევე აქვს visibilitychange და DPR cap. Showroom-ის render მოთხოვნა ყოველ კადრზე რჩება, თუმცა დამალულ ან უმოქმედო სცენაზე GPU ხატვისგან early-return იცავს. მისი demand-rendering-ზე გადაყვანა მოითხოვს render და preview lifecycle-ის უფრო ფართო გაზომვას ფაზა 05-ში.

## დიზაინი და ინტეგრაცია

შეცვლილია მოძრაობის შეჩერებისა და დაბრუნების წესები. კომპოზიციის სტრუქტურა იგივეა. რედიზაინის გადაწყვეტილება ამ ფაზაში მიღებული არ ყოფილა. reduced.png წარმოადგენს შემცირებული მოძრაობის მდგომარეობას. Before / After კადრებს შორის ამ მდგომარეობაში დიდი ვიზუალური სხვაობა მოსალოდნელი არ არის. სინქრონიზაცია ეყრდნობა browser media query-ს და document visibility-ს.

## ტესტები

| ტესტი | მოსალოდნელი | მიღებული | სტატუსი |
|---|---|---|---|
| Experience დასრულება და უკუსქროლი | 1-დან 0-მდე დაბრუნება, უწყვეტი idle განახლებების გარეშე | Chromium და WebKit, desktop/portrait/landscape | PASS |
| მაუსის მოშორება | ქარდი ნეიტრალურ დახრილობას უბრუნდება | ექვსივე viewport სცენარი | PASS |
| touch drag და pointer capture დასრულება | tilt მდგომარეობა იხსნება | Chromium-ის 390px touch ემულაცია | PASS |
| hidden მოვლენის იმიტაცია | floating paused, scheduler შეჩერებულია | ექვსივე სცენარი | PASS |
| დაბრუნება ხილულ მდგომარეობაში | floating განახლდება | ექვსივე სცენარი | PASS |
| offscreen | ქარდის floating paused | ექვსივე სცენარი | PASS |
| reduced-motion ცოცხალი გადართვა | floating გაჩერდება, timeline static გახდება, უკან გადართვაც იმუშავებს | ექვსივე სცენარი | PASS |
| Contact | ფორმა თავიდანვე გამოსაყენებელია | ექვსივე სცენარი | PASS |
| Showroom shelf reduced forward/reverse | ორივე მხარე ხელმისაწვდომია, ჩვეულებრივი motion განახლდება | Chromium software WebGL | PASS |
| reduced anchor | instant გადასვლა | Chromium | PASS |
| OS-ის რეალური tab/background და ფიზიკური მოწყობილობა | მოწყობილობაზე გამეორება | არ შესრულებულა | NOT RUN |
| სრული Hero ვიზუალური რეგრესია, ყველა demo სცენარი | დამოუკიდებელი სრული კრებული | არ შესრულებულა | NOT RUN |

გამეორება: PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LIBGL_ALWAYS_SOFTWARE=1 python3 tests/motion_lifecycle.py http://127.0.0.1:8043/
საჭიროა ლოკალური HTTP სერვერი. tests.json ასახავს შედეგებს, comparison.json შეიცავს 500ms scheduler შედარებას, showroom.json — დამატებით სცენარს. document.hidden getter და visibilitychange ტესტში იმიტირებულია. ეს არ წარმოადგენს ნამდვილ OS tab switching ტესტს.

| საზომი | მანამდე | შემდეგ | სხვაობა |
|---|---:|---:|---:|
| settled timeline callback, Chromium 500ms | 0 | 0 | 0 |
| რეალური FPS, LCP/INP, battery | გაუზომავი | გაუზომავი | მიუწვდომელია |

WebKit-ის ერთ settled სცენარში 500ms ფანჯარაში დაფიქსირდა 1 callback. ტესტი უშვებს მაქსიმუმ ერთ დამატებით მოთხოვნას, resize/scroll-ის საბოლოო მოვლენების გამო. სრული FPS-ის გარანტია ამ მონაცემიდან არ გამომდინარეობს.

## ფაილები და რისკები

შეცვლილია js/main.js, js/hologram.js, js/scroll-motion.js, js/experience-scroll.js, js/contact-terminal.js (import), css/hologram.css, index.html, about.html, contact.html (asset revisions), CHANGELOG.md და tests/artifacts/source-sha256.json. შეიქმნა tests/motion_lifecycle.py და docs/phase03-ის ანგარიში, reduced.png, tests.json, comparison.json, showroom.json. წაშლილი/გადატანილი ფაილები ნულია.

საერთო main.js-ის ცვლილება სამ გვერდს ეხება, Projects ცალკე shell-ს იყენებს. source manifest შეესაბამება მიმდინარე ფაილებს. უსაფრთხოების და axe-ის ფაზა 00 მიგნებები ცალკე backlog-ში რჩება. ვერსიის query-ები განახლებულია შესაბამისი module/script წყვილებისათვის.

Rollback: ამ ფაზის კომიტის git revert დააბრუნებს ფაზა 02-ის მდგომარეობას. მანამდე არსებული backup refs შენარჩუნებულია. ფაზა 04 შეეხება საერთო მონაცემებს, სტილებსა და აქტივების გამოყენების აუდიტს. მისი დაწყება მფლობელის შეფასებას ელოდება.
