# ფაზა 08 — საერთო QA და საბოლოო გასწორება

2026-11-26. სტატუსი: **ნაწილობრივ დასრულებულია**. ადგილობრივი ავტომატური შემოწმებები შესრულებულია; სრული მოწყობილობების, AT-ისა და საველე წარმადობის შემოწმება ღიაა. ბრენჩი `upgrade/phase01-identity`, PR [#24](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/24). ფაზის საწყისი SHA `044377d1f1e80e32e62dc8a62e88009f78a84cee`. ანგარიშის შემცველი კომიტის SHA იხილეთ Git history-ში; საბოლოო ზუსტი SHA გადაეცემა ჩატშიც. რეპორტის მომზადებისას ფაზის ცვლილებები ჯერ დასაკომიტებელი იყო; საბოლოო working tree ცალკე მოწმდება. წარმოება არ გამოქვეყნებულა.

## აღმოჩენილი პრობლემები

| კომპონენტი | მტკიცებულება | სიმძიმე / გავლენა |
|---|---|---|
| Projects Grid-ის პირველი ჩატვირთვა | Lighthouse CLS 0.447–0.519; showroom ჩანდა module initialization-მდე | მაღალი: დიდი ვიზუალური გადაადგილება |
| Home და საერთო შრიფტები | Home LCP 5.49s; remote fonts და რამდენიმე blocking stylesheet | საშუალო: ტექსტისა და მთავარი ვიზუალის დაყოვნება |
| About სერტიფიკატები | PDF CSS background; Skillwill 2025, წყაროში April 2026 | საშუალო: გატეხილი preview და არასწორი თარიღი |
| DataArt აღწერა | PDF/OCR leadership/conflict workshops; საიტზე ზოგადი IT Certificate | საშუალო: კვალიფიკაციის არაზუსტი წარმოდგენა |
| Header brand | ხილული GG და მხოლოდ Home accessible label | დაბალი: visible label/name თანხვედრა |
| ძველი Tsero ტესტი | უკვე შეცვლილი archive გზა და JPG მოლოდინი WebP-ის ნაცვლად | ტესტის მოძველებული მოლოდინი; პროდუქტის preview არ იყო დაკარგული |

## შესრულებული ცვლილებები

Grid query ახლა head-ში ადგენს მხოლოდ საწყის layout-ს. CSS showroom-ს პირველ paint-მდე მალავს; არსებული View controls შემდეგ იმავე მდგომარეობას სინქრონულად მართავს. 3D სცენის მოდელები, განათება, ჩრდილები და კამერის მოძრაობა არ შეცვლილა. Grid-ის საბოლოო CLS 0.0027-ია.

არსებული ლიცენზირებული Inter/Space Grotesk TTF-ებიდან შეიქმნა ლოკალური WOFF2 English subset. ოჯახები და წონები შენარჩუნებულია, ორივე OFL ლიცენზია თან ახლავს. embedded demo-ს საკუთარი შრიფტები უცვლელია. მომავალში ქართული/სხვა სკრიპტის copy-ის დამატებას subset-ის გაფართოება დასჭირდება. Home-ზე იგივე CSS იმავე რიგით ერთ generated ფაილად იკვრება; source stylesheets რჩება რედაქტირების წყაროდ. Hero ფოტოს ემატება ნამდვილი intrinsic ზომა და მაღალი loading priority.

`tools/build_styles.py` განვითარების დამხმარეა, არა runtime dependency. აღდგენა: `python3 -m pip install fonttools brotli`, შემდეგ `python3 tools/build_styles.py`. generated CSS/source თანხვედრა ცალკე შემოწმდა. დროებითი Lighthouse/npm ინსტალაცია რეპოზიტორიაში არ შემოსულა.

About-ში არსებული, წყაროსთან ვიზუალურად შედარებული PNG-ები გამოიყენება CSS preview-დ; original PDFs კვლავ ხელმისაწვდომია. Skillwill თარიღი 2026 გახდა; DataArt აღწერა leadership/teamwork-ს ასახავს. სერტიფიკატის შიგთავსი არ შეცვლილა. CV არ შეცვლილა დაუდასტურებელი ფაქტებით.

Header-ის accessible name შეიცავს ხილულ GG-ს და მფლობელის სახელს. ეს არ ცვლის ხილულ ბრენდს. ტექნიკური გადაწყვეტილებები — ლოკალური შრიფტები, source bundle და საწყისი Grid state — მიღებულია გაზომილი პრობლემების მიხედვით. ახალი ვიზუალური მიმართულება არ დამატებულა.

## ტესტირების შედეგები

| ტესტი | მოსალოდნელი | ფაქტობრივი | სტატუსი |
|---|---|---|---|
| Chromium/WebKit, 5 გვერდი × 11 ზომა | overflow არ იყოს, ერთი H1, page exception 0 | 110 geometry checks; `tests.json` | PASS |
| 320/360/390/430/768/1024/1280/1440/1920/2560 და landscape | კონტენტი viewport-ში | overflow 0; სრული zoom/DPR მატრიცა სხვა საკითხია | PASS ფარგლებში |
| Catalogue network abort | პროექტი ხელმისაწვდომი დარჩეს | native semantic details ორივე ძრავში მუშაობს | PASS |
| Contact required validation | ცარიელი ფორმა არ გაიგზავნოს | მოთხოვნა 0 | PASS |
| Contact duplicate/error/retry/success | ერთი მოთხოვნა, error-ზე ტექსტი დარჩეს, success-ზე reset | intercept 500/200 Chromium/WebKit; `contact.json` | PASS |
| Tsero desktop | კალათა, რაოდენობა, checkout, demo payment/map, session isolation | `tsero-desktop/` | PASS |
| Mobile showroom | screenshot+55% notice, live app მოთხოვნა 0 | portrait/landscape Chromium; `tsero-phone/` | PASS |
| MeeTab ადგილობრივი touch booking | დადასტურება და დახურვა | მხოლოდ სატესტო demo, `meetab/` | PASS |
| Original PDF / PNG შედარება | preview და აღწერა შეესაბამებოდეს | render, ტექსტი, OCR; original PDFs უცვლელი | PASS |
| static local href/src, 6 HTML | ყველა local ფაილი არსებობდეს | დაკარგული reference 0 | PASS |
| catalogue sync / JS parse / whitespace | წარმატებული exit | commands ქვემოთ | PASS |
| განმეორებითი Lighthouse | შედარებადი lab შედეგები | ქვემოთ, პირველი დაბალი run შენარჩუნებულია | PASS შესრულება |
| მუდმივი Performance 95+ | ყველა გაშვება ≥95 | Home ერთ run-ში 76 | FAIL მიზანი |
| Firefox/Edge, physical phones, AT | დამოუკიდებელი შემოწმება | გარემოში არ შესრულებულა | NOT RUN |
| LinkedIn/Behance სრული ვალიდაცია | პროფესიული პროფილის გახსნა | 999 /403 service restriction | BLOCKED |
| რეალური Formspree inbox | წერილის მიღება | რეალური მოთხოვნა არ გაგზავნილა | NOT RUN |

გამოყენებული ბრძანებები: `python3 tests/final_qa.py`; `python3 tests/run_lighthouse.py <installed-lighthouse/cli/index.js>` და `--home-only`; `python3 tests/tsero_showroom.py http://127.0.0.1:8054/ --engine chromium --mode desktop` და `--mode phone`; `python3 tests/demo_touch.py http://127.0.0.1:8054/ --engine chromium`; `node tools/sync-projects.mjs --check`; `node --input-type=module --check < showroom/showroom.js`; `git -c core.whitespace=cr-at-eol diff --check`. WebKit იყენებს `/workspace/portfolio-work/webkit-launch.sh`; გარემოს software rendering ფიზიკურ GPU ტესტს არ უდრის.

ფორმის პასუხები intercept-ით შემოწმდა; ქსელში რეალური წერილი არ გასულა. Tsero/MeeTab შესრულდა ლოკალურ bundled demo-ში, არა რეალურ შეკვეთაზე/გადახდაზე. `tests/final_qa.py` pageerror-ს ამოწმებს; ეს ყველა შესაძლო console warning-ის სრულ აუდიტს არ ნიშნავს.

## Before / After გაზომვები

ეს ცხრილი ფაზა 08-ის დასაწყისსა და დასასრულს ადარებს, არა საწყის production-სა და მთელ upgrade-ს. Lighthouse 13.6.0, local HTTP, Chromium headless, mobile412×823/DPR1.75, simulated RTT150ms/CPU4×, ახალი Chrome თითო run-ზე. მონაცემები `lighthouse-before.json`, `lighthouse-layout-fix.json`, `lighthouse.json`, `lighthouse-home-extra.json`-შია. ლაბორატორიული throttling არ ნიშნავს რეალური მომხმარებლის p75-ს.

| Metric | Before | After | სხვაობა |
|---|---|---|---|
| Home Performance | 78 /78 | 76 /97 /99 | არასტაბილური; 95+ გარანტირებული არაა |
| Home LCP | 5.485 /5.487s | 1.059 /1.061 /1.206s | მნიშვნელოვნად შემცირდა ამ გარემოში |
| Home CLS | .0335 /.0341 | 0 /0 /0 | სტაბილურობა გაუმჯობესდა |
| Home TBT | 30 /84ms | 1217 /189 /107ms | ერთ run-ში დიდი blocking spike; მიზეზი სრულად იზოლირებული არაა |
| Grid Performance | 76 /77 | 99 /98 | +21–23 ქულა |
| Grid CLS | .519 /.447 | .0027 /.0027 | საწყისი layout shift გასწორდა |
| About Performance | 90 | 99 | +9 |
| Contact Performance | 93 | 99 | +6 |
| Lab Performance | 99 | 99 | იგივე ქულა |
| Accessibility / Best Practices / SEO | 100/100/100 | 100/100/100 | მხოლოდ ავტომატური სკანის ფარგლები |
| საველე p75 INP/LCP/CLS | მიუწვდომელი | მიუწვდომელი | არ გაზომილა |

Home-ის მაღალი TBT run არ წაიშალა და მისი მიზეზი დანამდვილებით არ მიეწერება host-ს ან კონკრეტულ ეფექტს. სამივე საბოლოო run უნდა წაიკითხოს შემფასებელმა. რეგრესიის დარჩენილი რისკი `P01`-შია. ორიგინალი creative motion ქულის გამო არ ამოშლილა.

## ვიზუალური მტკიცებულება და შენარჩუნება

საწყისი production ეკრანები: `../audit-00/*-1440.png`, `*-390.png`. საბოლოო: ამ დირექტორიის `*-1440.png`, `*-chromium-390.png`, `*-webkit-390.png`. Home და About mobile ეკრანები ხელითაც გადაიხედა. screenshot არ ამოწმებს ყველა animation state-ს.

ხელახლა დადასტურდა პროექტის semantic fallback, Tsero desktop demo, MeeTab local booking, mobile preview policy, ფორმის ლოკალური validation/state-ები. წინა ფაზების showroom/camera/light, Lab და hero motion შედეგები თავიანთ ანგარიშებშია; ფაზა 08 არ იმეორებს ყველა წინა interaction-ს ყველა ბრაუზერში.

## უსაფრთხოება და დარჩენილი რისკები

OSV-ზე `npm:three@0.180.0` query-მ advisory ID არ დააბრუნა. ეს მხოლოდ declared vendor version-ის შემოწმებაა, არა embedded code-ის სრული vulnerability audit. Python standard TLS validation-ით live URL200 დაბრუნდა. browser tests კვლავ ignore_https_errors-ს იყენებს; სრული browser certificate chain ტესტი ღიაა. GitHub პროფილის HTTP200 არ უდრის მისი ყველა შინაარსის გადამოწმებას.

ყველა NOT RUN/BLOCKED/ნაწილობრივი საკითხი ჩამოთვლილია `../OPEN_VERIFICATION.md`-ში. CV factual review, physical devices/GPU/battery, ნამდვილი zoom/AT, Firefox/Edge, საველე მონაცემები და გამოქვეყნებისშემდგომი crawler/404 ჯერ საჭიროა. GitHub Pages-ზე arbitrary security response headers ვერ დაკონფიგურირდება ამ static repository-დან. არც სრული WCAG შესაბამისობა და არც სრულყოფილი უსაფრთხოება არ დასტურდება.

## ფაილები, rollback და შემდეგი ნაბიჯი

ზუსტი სია: `files.json`. Production/source SHA-256: `../../tests/artifacts/source-sha256.json`. არც original artwork, არც original font, არც PDF, არც backup ref არ წაშლილა. დროებითი test artifacts historical ადგილიდან ამ ფაზის `meetab/`-ში გადაიტანეს; ისტორიული ფაილები HEAD მდგომარეობაზე აღდგა.

მხოლოდ ფაზა 08-ის დაბრუნება: clean worktree-ში ამ ფაზის კომიტის `git revert <phase08-sha>` და regression checks. სრული upgrade-ის დაბრუნება: production reference `7333ef1f6f72f2ad8f81761efa8610de92345716` უცვლელია; დამატებითი ძველი `backup/before-home-hologram` ref ინარჩუნებს თავის საწყის მდგომარეობას. საერთო branch-ის force reset ან force push საჭირო არაა.

შემდეგი ნაბიჯია მფლობელის საბოლოო განხილვა, CV factual review და დარჩენილი verification-ის პრიორიტეტების არჩევა. Merge/deploy ამ ფაზაში არ შესრულებულა. გამოქვეყნების შემდეგ საჭიროა Pages URL/base-path/404/social preview smoke check. საბოლოო გაერთიანებული ანგარიშია `../FINAL_AUDIT.md`.
