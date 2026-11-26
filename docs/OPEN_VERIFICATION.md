# ღია შემოწმებების რეესტრი

განახლებულია 2026-11-26, ფაზა 06. ეს ფაილი ინარჩუნებს წინა ფაზების FAIL, NOT RUN და BLOCKED პუნქტებს. მხოლოდ შესრულებული შესაბამისი ტესტის მტკიცებულება ხურავს ჩანაწერს.

| ID | საკითხი | სტატუსი | ბოლო მტკიცებულება / დარჩენილი სამუშაო |
|---|---|---|---|
| A01 | დახურული მენიუს aria-hidden-focus | PASS შერჩეულ მდგომარეობებში | phase05/accessibility.json; inert, გახსნა/დახურვა და focus return შემოწმდა |
| A02 | Projects აქტიური ფილტრის რაოდენობის კონტრასტი | PASS შერჩეულ მდგომარეობებში | phase05/before.json → after.json; opacity სრულადაა აწეული |
| A03 | ყველა გვერდის, dialog-ისა და ინდივიდუალური ფოკუსის კონტრასტი | NOT RUN სრულად | საწყისი ოთხი გვერდის axe სკანი შეზღუდული დაფარვაა |
| A04 | სრული screen reader / assistive technology გზა | NOT RUN | საჭიროა ხელით AT გავლა |
| R01 | 320–2560px სრული viewport/zoom/DPR მატრიცა | NOT RUN სრულად | წინა ფაზები ფარავს შერჩეულ ზომებს. phase05 root font enlargement 200% ცალკე ემულაციაა |
| R02 | რეალური browser zoom 200%, ყველა ტექსტი და კრიტიკული გზა | NOT RUN სრულად | root font enlargement არ უდრის სრულ browser zoom ტესტს |
| R03 | ფიზიკური iPhone/Android, GPU/ბატარეა/თერმული ქცევა | NOT RUN | არსებული შედეგები ემულაციასა და software WebGL-ს ეკუთვნის |
| M01 | OS-ის რეალური tab switching/background | NOT RUN | phase03-ის document.hidden სიმულაცია ამ პუნქტს ვერ ხურავს |
| M02 | Hero-ს ყველა ვიზუალური მდგომარეობა და შეფერხება | NOT RUN სრულად | ჩვეულებრივი გვერდების ტესტი სრული glyph motion რეგრესია არ არის |
| P01 | განმეორებითი კონტროლირებული Lighthouse | NOT RUN | CLI გარემოში არ აღმოჩნდა; ქულა არ გაზომილა |
| P02 | რეალური მომხმარებლის LCP/INP/CLS p75 | NOT RUN | საველე მონაცემები მიუწვდომელია |
| P03 | გაზომილი GPU memory, draw calls და FPS რეალურ hardware-ზე | NOT RUN | renderer-ის თვისებების არსებობა გაზომვად არ ითვლება |
| D01 | MeeTab/Tsero სრული ბიზნესსცენარების რეგრესია | NOT RUN სრულად | showroom-ის არსებული გზების შედეგი phase05/regression.json-ში აისახება |
| D02 | მობილურ Try Now-ზე live app მოთხოვნა ნული | PASS Chromium ემულაციაში | phase05/regression.json, portrait/landscape და ორივე app notice; ფიზიკური მოწყობილობა R03-ში ღიაა |
| C01 | რეალური ინბოქსის მიწოდება | NOT RUN, რეალური გაგზავნის ნებართვა საჭირო | ადგილობრივი mock პასუხები ამ პუნქტს არ ხურავს |
| C02 | CV და პროფესიული ფაქტები | მფლობელის გადამოწმება | phase01-ის საჭირო ცვლილებები კვლავ ძალაშია |
| S01 | credential/private key ტიპური ფორმატების plaintext ძიება | PASS შეზღუდულ სკანში | შერჩეულ ფორმატებზე დამთხვევა არ დაფიქსირდა. ZIP/history არ შემოწმებულა |
| S02 | სრულყოფილი dependency vulnerability audit | NOT RUN | lockfile/package workflow არ არსებობს; vendor და embedded sources ცალკე review-ს საჭიროებს |
| S03 | ყველა postMessage გზა, storage და iframe უფლებები | ნაწილობრივი | MeeTab source check და wheel მონაცემის დაცვა; Tsero-ს permissions/CSP მიმოხილულია, ფორმალური penetration test არ ჩატარებულა |
| S04 | TLS და ბრაუზერის ნამდვილი სერტიფიკატების ჯაჭვი | NOT RUN დამოუკიდებლად | ბრაუზერის ტესტები ignore_https_errors-ს იყენებს |
| B01 | Firefox და Edge | NOT RUN | მიმდინარე ბრაუზერის მატრიცა Chromium/WebKit |
| SEO01 | metadata/schema/sitemap/social image/404 | PASS ლოკალურ პირობებში | phase06/tests.json და report; წარმოებაზე გამოქვეყნების შემდეგ ხელახლა შესამოწმებელია |
| SEO02 | origin-root robots პოლიტიკა | BLOCKED ამ repo-ს ფარგლებში | host /robots.txt არის 404, პროექტის ქვეკატალოგის robots crawl-ს ვერ მართავს |
| SEO03 | live Google/social crawler და Pages-ის ნამდვილი 404 | NOT RUN | დრაფტის გამოქვეყნების შემდეგ |
| SEO04 | გარე schema / Rich Results validator და Search Console | NOT RUN | ადგილობრივი JSON და content შემოწმება ამას არ ცვლის |
| F01 | ხელმისაწვდომი WebGL fallback და no-JS artwork | PASS წინა ფაზაში | phase04/tests და არსებული fallback_browser.py |
| ARCH01 | CSS/JS ნაწილობრივი ქსელური ჩავარდნა | NOT RUN სრულად | საერთო ES module ჩავარდნის გამძლეობა ცალკე შესამოწმებელია |

## სტატუსის წესი

FAIL — შესრულებულმა ტესტმა მოსალოდნელი შედეგი ვერ მიიღო.
NOT RUN — შესაბამისი შემოწმება სრულად არ შესრულებულა.
BLOCKED — მცდელობა შეაფერხა კონკრეტულმა რესურსმა ან ტექნიკურმა პრობლემამ.
PASS — მხოლოდ იმ კონკრეტულ პირობებშია დადასტურებული, რომლებიც მტკიცებულებაში წერია.

საბოლოო რელიზის ანგარიშმა ამ რეესტრის თითოეულ ღია პუნქტს სტატუსი, გავლენა და საჭირო გადაწყვეტილება უნდა შეუნარჩუნოს.
