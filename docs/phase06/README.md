# ფაზა 06 — SEO და პროფესიული აღმოჩენა

2026-11-26. ბრენჩი upgrade/phase01-identity. საწყისი SHA dec3e99. სტატუსი დასრულებულია რეპოზიტორიის შიგნით განსაზღვრულ იმპლემენტაციასა და ლოკალურ შემოწმებებში. ჰოსტის ძირეული robots, live crawler და სოციალური პლატფორმის შემოწმებები რეესტრში რჩება.

## საწყისი მდგომარეობა

ოთხ გვერდს უკვე ჰქონდა განსხვავებული title და description. canonical, Open Graph, Twitter card, სტრუქტურირებული მონაცემები და sitemap არ არსებობდა. Projects-ის favicon ცარიელი data URL იყო. არქივის სრული პროექტის აღწერები JS მოდულის გარეშე არ ჩანდა, თუმცა ორიგინალ artwork-ზე noscript ბმულები არსებობდა. custom 404 გვერდი რეპოზიტორიაში არ იყო.

## შესრულებული ცვლილებები

ოთხივე გვერდზე title/description განახლდა შესაბამისი გვერდის შინაარსით. canonical ითვალისწინებს /PortfolioWebsite/ პრეფიქსს; Home-ის არჩეული ძირითადი URL მთავრდება /-ით, index.html მისი ალტერნატიული შესასვლელია. ფილტრის query და project hash canonical-ის ცალკე დუბლიკატებად არ განისაზღვრება.

ოთხივე გვერდს აქვს og:type/site_name/title/description/url/image და summary_large_image მეტამონაცემები. სოციალური ანგარიშის გამოგონილი handle დამატებული არ არის. შეიქმნა assets/social-preview.png — 1200×630, დაახლოებით 324KiB — არსებული პორტრეტით, ფერებითა და Inter შრიფტით. წყაროა tools/social-preview.html, რენდერის ბრძანებაა python3 tools/render-social.py http://127.0.0.1:8050/. ეს source გვერდი noindex-ია. პორტრეტის გამოყენება ემყარება უკვე გამოქვეყნებულ Home აქტივს.

საერთო favicon გამოიყენებს არსებულ assets/icon-code.svg-ს. sitemap.xml შეიცავს ოთხივე canonical გვერდს. fragment-ები sitemap-ში არ ჩაიწერა.

JSON-LD-ში გამოიყენება Person და შესაბამისი WebPage/ProfilePage/CollectionPage ტიპები. ავტორის სახელი და ახალი პროფესიული სათაური ემთხვევა ხილულ კონტენტს. sameAs მოიცავს დადასტურებულ GitHub პროფილს. Projects-ზე კატალოგიდან გენერირდება ItemList ექვსი CreativeWork ჩანაწერით. რეიტინგები და გამოუყენებელი კლიენტების/სამუშაო ისტორიის მტკიცებები დამატებული არ არის. ადგილობრივი შემოწმება ფარავს JSON სინტაქსს, ID-ებს, URL-ებს, ტიპებსა და კონტენტთან თანხვედრას; ის გარე Schema.org ან Google validator-ის გავლად არ უნდა ჩაითვალოს.

MeeTab-ის საჯარო ბმულში ახლა meetab გამოიყენება. ძველი jbl ID-ით მოსული ბმულიც იმავე პროექტს ხსნის, მოწყობილობის შიდა ID თავსებადობისთვის დაცულია. ახალი slug Home-ისა და არქივის ბმულებსა და structured data-ში ერთობლივად იკითხება.

Projects-ის ბოლოს დაემატა Project details ექვსი native details ელემენტით. სათაურები, კატეგორიები და აღწერები საწყის semantic HTML-შია, გენერირდება იმავე data/projects.mjs-დან. JavaScript-ის გარეშე შესაძლებელია მათი გახსნა და წაკითხვა. tools/sync-projects.mjs --check ამოწმებს როგორც Home-ს, ისე ამ აღწერებსა და ItemList-ს. ეს მცირე ტექსტური აღწერებია; მომავალი Case Study-ის სივრცე ცალკე დარჩა.

404.html იყენებს იგივე მუქ/ცისფერ პალიტრას, noindex-ს და /PortfolioWebsite/ პრეფიქსიან Home/Work/Contact ბმულებს. nested დაკარგული URL-დან დაბრუნება local server-ის custom-404 იმიტაციაში შემოწმდა. provider-ის ნამდვილი HTTP პასუხის შემოწმება გამოქვეყნების შემდეგ უნდა განმეორდეს.

## robots და ჰოსტინგის შეზღუდვა

2026-11-26 ჰოსტის ძირეული https://giorgigiorgadze18.github.io/robots.txt აბრუნებდა 404-ს. robots ფაილი პროტოკოლით სწორედ origin-ის root-ში უნდა იყოს. /PortfolioWebsite/robots.txt ამ საიტისთვის crawl პოლიტიკას ვერ დააწესებს. შესაბამისად, ასეთი არაეფექტური ფაილი არ შექმნილა. ფაილის არყოფნა საიტის crawling-ის აკრძალვას არ ნიშნავს. sitemap შეიძლება Search Console-ში მიეთითოს მხოლოდ მფლობელის ანგარიშის ავტორიზაციით. repo-root-ის robots საკითხი owner.github.io საიტს ან მომავალ custom domain-ს ეხება.

## ტესტირება

tests/seo_browser.py ირთვება ბრძანებით PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1 LIBGL_ALWAYS_SOFTWARE=1 python3 tests/seo_browser.py. ქმნის ლოკალურ HTTP სერვერს და /PortfolioWebsite/ პრეფიქსს. წარმოების absolute asset URL-ები იგივე მისამართის შესაბამის ლოკალურ ფაილზე მოწმდება. ეს ლოკალური კოდის დასტურია; GitHub-ზე ახალი asset-ები დრაფტის გამოქვეყნებამდე მიუწვდომელია.

| ტესტი | მოსალოდნელი | ფაქტობრივი | სტატუსი |
|---|---|---|---|
| ოთხი title/description/canonical | გვერდის შესაბამისი და უნიკალური | Chromium/WebKit, 4/4 | PASS |
| OG/Twitter image და favicon | სწორი production პრეფიქსი, ფაილი არსებობს | ადგილობრივად ორივე ბრაუზერში გადაწყდა | PASS |
| სტრუქტურირებული მონაცემი | JSON იკითხება, Person და ექვსი CreativeWork-ის ID/URL შესაბამისია | ადგილობრივი შემოწმება | PASS |
| MeeTab-ის public slug და legacy alias | ორივე იგივე აპს ხსნის | Chromium/WebKit | PASS |
| sitemap XML | ოთხი უნიკალური canonical, fragment-ების გარეშე | URL-ები ადგილობრივად HTTP 200 | PASS |
| nested 404 | HTTP 404, noindex და მოქმედი recovery ბმულები | custom server-ის იმიტაცია, ორივე ბრაუზერი | PASS |
| JavaScript გამორთული | ექვსი პროექტის აღწერა იკითხება | Chromium, Tsero-ს native details გაიხსნა | PASS |
| მიმდინარე assets/data სინქრონიზაცია | გენერირებული HTML ემთხვევა კატალოგს | node tools/sync-projects.mjs --check | PASS |
| Google/Search Console და სოციალური პლატფორმის რეალური crawler | გამოქვეყნებულ მისამართებზე შემოწმება | დრაფტის ეტაპზე არ შესრულებულა | NOT RUN |
| ნამდვილი Pages custom-404 პასუხი | live routing | გამოქვეყნების შემდეგ | NOT RUN |
| origin-root robots პოლიტიკა | root ფაილის კონტროლი | ამ repo-ს /PortfolioWebsite/ მდებარეობის ფარგლებს სცდება | BLOCKED |

შედეგები tests.json-შია. 404-chromium.png, 404-webkit.png და projects-no-js.png ვიზუალურად გადაიხედა. სოციალური ბარათი assets/social-preview.png-შიც გადაიხედა. ტესტის პირველ გაშვებაში სწრაფი ნავიგაციის შედეგად ლოკალური HTTP სერვერი BrokenPipe შეტყობინებებს წერდა, მტკიცებები დასრულდა PASS-ით. handler ახლა მხოლოდ კავშირის ასეთი მოსალოდნელი გათიშვის შეტყობინებებს ახშობს.

## Before / After

| მაჩვენებელი | მანამდე | შემდეგ |
|---|---:|---:|
| canonical-ის მქონე ძირითადი გვერდები | 0 | 4 |
| OG/Twitter image მითითების მქონე გვერდები | 0 | 4 |
| sitemap canonical URL-ები | 0 | 4 |
| source HTML-ში სრული არქივის პროექტების აღწერები | 0 | 6 |
| metadata JSON-LD სკრიპტები | 0 | 5 |
| custom 404 | 0 | 1 |
| Lighthouse SEO ქულა / ინდექსირების საველე შედეგი | გაუზომავი | გაუზომავი |

## შემდგომი პირადი დომენი

მომავალი არჩევანი მოიცავს მფლობელის მიერ დომენის დარეგისტრირებას, GitHub-ში ownership-ის დადასტურებას, DNS ჩანაწერებს, custom-domain პარამეტრს და HTTPS-ის გამართვას. საჭიროა canonical/OG/JSON-LD/sitemap/404 URL-ების ერთობლივი გადაყვანა ახალ მისამართზე, HTTP/HTTPS და www ვარიანტების redirect-ების შემოწმება, ძველი /PortfolioWebsite/ ბმულების ტესტი და Search Console-ის განახლება. current Pages ინსტალაციის ქცევა უნდა დარჩეს გადასამოწმებელ baseline-ად. დომენი და წარმოების პარამეტრები მფლობელის ცალკე ავტორიზაციას საჭიროებს.

## ფაილები, rollback და შემდეგი ეტაპი

შექმნილია 404.html, sitemap.xml, assets/social-preview.png, tools/social-preview.html, tools/render-social.py, tests/seo_browser.py და docs/phase06-ის ეს ანგარიში/ტესტის JSON/სამი PNG.
შეცვლილია index.html, projects.html, about.html, contact.html, css/phase02.css, data/projects.mjs, showroom/showroom.js, tools/sync-projects.mjs, CHANGELOG.md, docs/OPEN_VERIFICATION.md და tests/artifacts/source-sha256.json.
წაშლილი/გადატანილი ფაილები ნულია.

Rollback: ფაზის კომიტის git revert აღადგენს dec3e99-ის მდგომარეობას. გენერატორისა და HTML-ის ერთობლივი დაბრუნების შემდეგ გაუშვით node tools/sync-projects.mjs --check. ღია და შეზღუდული ტესტები შენარჩუნებულია ერთიან რეესტრში.

შემდეგი ფაზა 07 შეაფასებს არსებული ექსპერიმენტების მცირე, შინაარსიან Lab-ში წარმოდგენას და დამატებითი კონტროლების საჭიროებას. ცალკე approval საზღვარი ძალაშია. ნებისმიერი ფიზიკური მოწყობილობის, რეალური crawler-ის ან სრული AT შემოწმება რეესტრში უნდა დარჩეს, სანამ შესაბამისი მტკიცებულება არ შეგროვდება.

ოფიციალური წყაროები — [robots-ის მდებარეობა](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [Schema.org Person](https://schema.org/Person), [CollectionPage](https://schema.org/CollectionPage), [GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
