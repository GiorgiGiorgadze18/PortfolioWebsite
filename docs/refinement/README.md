# პორტფოლიოს დახვეწა და Creative Lab-ის გაფართოება

საწყისი წარმოების კომიტი `6624a642735e1644249896b29434f2db31b1c3c0`. იზოლირებული ბრენჩი `feat/portfolio-refinement`. ფაზები შესრულდა თანმიმდევრობით და შედეგები ქვემოთაა. პროდუქტის კომიტია `88f0cbe5776c9a6325bb8ff4549583bf3c31f091`. ანგარიშის განახლებული SHA ჩანს [დრაფტ PR #25-ში](https://github.com/GiorgiGiorgadze18/PortfolioWebsite/pull/25).

## ფაზა 01 — Projects

ჩვეულებრივ Projects ბმულზე ძველი ვერსიაც 3D-ს იწყებდა. Home-ის ინდივიდუალური პროექტის ბმულები მიზანმიმართულად ითხოვდა Grid-ს, ხოლო რეჟიმის შეცვლა მხოლოდ მიმდინარე URL-ში იწერებოდა. ახალი რიგია: URL-ის ცხადი არჩევანი, პროექტის პირდაპირი ბმული ან გამარტივებული ნაგულისხმევი რეჟიმი, შენახული არჩევანი, ბოლოს 3D. reduced-motion და Data Saver ავტომატურად Grid-ს ირჩევს. მკაფიო 3D არჩევანისას მოქმედებს არსებული reduced-motion ქცევა. შენახვა მხოლოდ რეჟიმის ღილაკზე ხდება. ძველი hash alias-ები კვლავ მუშაობს.

WebGL 2 და ტექსტურის მაქსიმალური ზომა მოწმდება Three.js-ის ჩატვირთვამდე. ჩავარდნისას Grid ხელმისაწვდომია და სტატუსი იკითხება. 3D-ის ინიციალიზაცია Grid ღილაკს არ ბლოკავს და თუ სტუმარი ჩატვირთვისას Grid-ზე გადავიდა, renderer არ იქმნება დამალულ სცენაში. ჩართული სცენა Grid-ზე ყოფნისას აღარ ხატავს კადრებს. 3D-ის არსებული მოდელები, მასალები, ჩრდილები და app კოდი უცვლელია.

ქვედა დუბლირებული Project details განყოფილება გაერთიანდა არსებულ არქივში. გენერატორი აღწერებს, წელს, კატეგორიას და artwork ბმულებს ერთიანი მონაცემებიდან ქმნის. აღწერები საწყის HTML-შია, მშობლიური details/summary-ით იხსნება და module failure-ისასაც იკითხება. JavaScript-ის დროს About ინარჩუნებს dialog-ს და შესაბამის demo action-ს. CreativeWork JSON-LD, საჯარო slug-ები და მომავალი case study-ის გაფართოების წერტილები დარჩა.

## ფაზა 02 — ღილაკები და დაშორებები

3D/Grid ერთ სეგმენტურ კონტროლშია, თანაბარი სიმაღლით, ხატულის ფიქსირებული სიგანით, 8px შიდა დაშორებით და `aria-pressed` მდგომარეობით. ზედა სათაურის შემდგომი ცარიელი სივრცე შემცირდა, რომ შოურუმი უფრო ადრე გამოჩნდეს. საერთო 44px მინიმუმი შეეხო პატარ-პატარა ქარდის ღილაკებს, ფილტრებს, მთავარ CTA-ს და მობილურ მენიუს. ფოკუსის ვიზუალური წესი საერთო ფაილშია. არსებული მკვეთრი CTA და მსუბუქი მეორადი მოქმედებები ვიზუალურად განსხვავდება. ქარდის მოქმედებები კლავიატურით ფოკუსის დროს და touch ეკრანზე ჩანს. About-ის სერტიფიკატების არსებული შიდა ჰორიზონტალური სია შენარჩუნებულია.

## ფაზები 03–04 — Creative Lab და არქიტექტურა

| ექსპერიმენტი | რეალური შესრულება | კონტროლები და fallback |
|---|---|---|
| Holographic Interface | არსებული CSS 3D და JavaScript tilt, touch drag და სინათლის არეკვლა | Tilt, Reflection, Pause, Reset. სტატიკური ვარიანტი reduced motion-ზე |
| Interactive Shader Playground | WebGL 2 და GLSL, პროცედურული ზედაპირი და სიმაღლის წარმოებულებით გამოთვლილი განათება | სიჩქარე, დამახინჯება, სიხშირე, touch/მაუსი, XY sliders, Pause/Reset. WebGL-ის გარეშე ილუსტრაციული preview |
| Real-Time Lighting Studio | არსებული Three.js r180, PBR mesh, point light, ambient, shadow map | სინათლის კუთხე/ძალა, roughness, ambient, Reset. input/resize-ზე ხატავს. პატარა ვიუპორტზე ნაკლები shadow resolution |
| Motion Physics Lab | Canvas 2D, ანალიზური unit-mass spring (under/critical/overdamped) და cubic easing | stiffness, damping, duration, Pause, Replay, Reset. მოდელი ერთია გრაფიკისა და წერტილისთვის. reduced motion-ზე სტატიკური მრუდები |
| Interactive Particle Field | Canvas 2D, 216/384 წერტილი, ფორმებს შორის ინტერპოლაცია | Globe/Grid/Wave, ატრაქცია/რეპულსია, ძალა, touch/მაუსი და XY sliders, Pause/Reset. მოძრაობის დასრულებისას ხატვა ჩერდება |
| Spatial UI Playground | CSS perspective/translate3d სამი DOM ფენით | assembled/exploded, depth, perspective, angle, Reset. ტექსტური ფენები Canvas-ის გარეთაა |

არჩეულია ერთი native dialog, რომ მოწყობილობაზე fullscreen სავალდებულო არ გახდეს და რამდენიმე renderer პარალელურად არ გაეშვას. `registry.js` აღწერს ახალ მოდულებს, preview-ს, შესაძლებლობებსა და კონტროლებს. `gallery.js` მართავს stage-სა და ფორმას. `runtime.js` აერთიანებს resize/DPR-ს, visibility-ს, reduced motion-ს, listener cleanup-ს და ერთ მოთხოვნისამებრ animation scheduler-ს. სპეციალიზებული ლოგიკა ცალკე ფაილებშია. ჰოლოგრამა ინარჩუნებს თავის არსებულ Home-თან გაზიარებულ lifecycle-ს. WebGL context loss-ზე სცენა თავისუფლდება და preview ჩანს. ანიმაცია ერგება ეკრანის ზომას და DPR-ს. ახალი dependency არ დამატებულა.

## ფაზები 05–06 — დიზაინის შემოწმება და მტკიცებულება

საწყისი ფოტოები გადაღებულია გამოქვეყნებულ გვერდებზე Chromium-ში, 1440 და 390px-ზე. რეფაინმენტის სქრინები ლოკალური HTTP სერვერიდანაა. მობილური dialog-ის სათაური და დახურვის ღილაკი შიდა scroll-ისას ხელმისაწვდომი რჩება. Lab-ის preview-ები მოკლე გრაფიკული მინიშნებებია, მოქმედი სცენები იხსნება ღილაკით.

`measurements.json` ადარებს ერთ ლოკალურ Chromium ჩატვირთვას თითო გვერდზე, 390×844, reduced motion-ით. დათვლილია იმავე origin-ის encoded response body. გარე მოთხოვნები, მომხმარებლის საველე მონაცემები და frame timing ცხრილში არ შედის.

| გვერდი | ადრე | შემდეგ |
|---|---:|---:|
| Home | 1,168,938 ბაიტი / 27 მოთხოვნა | 1,169,545 / 28 |
| Projects Grid | 993,033 ბაიტი / 19 მოთხოვნა | 1,001,958 / 21 |
| Lab | 268,837 ბაიტი / 20 მოთხოვნა | 288,786 / 24 |

Lab-ის საწყის ჩატვირთვაზე Three.js, shader და lighting სცენის მოთხოვნები ორივე შემთხვევაში 0. ამ ცდაში Lab-ის ახალი shell დაახლოებით 20KB დაუკომპრესირებელ ადგილობრივ ტრაფიკს ამატებს. Lighthouse, hardware FPS და საველე მონაცემები ამ დავალებაში არ გაზომილა.

[Projects — ადრე](before-projects-390.webp) · [Projects — შემდეგ, Grid](after-chromium-projects-390.webp) · [Lab — ადრე](before-lab-1440.webp) · [Lab — შემდეგ](after-chromium-lab-1440.webp) · [Lighting](after-chromium-lighting-430.webp) · [Shader](after-chromium-shader-430.webp)

## ტესტირების შედეგები

| ტესტი | მოსალოდნელი | ფაქტობრივი | სტატუსი |
|---|---|---|---|
| Projects Chromium და WebKit | ნაგულისხმევი 3D, განმეორებითი გადართვა, შენახული არჩევანი, ფილტრები, About და deep link | ორივე ძრავში UI-მ გაიარა | PASS |
| WebGL/ES module გათიშვა, reduced motion, no-JS | Grid და წაკითხვადი აღწერა, ავტომატური არჩევანი არ შეინახოს | Chromium/WebKit fallback გაიარა. JavaScript-ის გარეშე სტატიკური ორიგინალის ბმული და აღწერაც ხელმისაწვდომია | PASS |
| Shader | GLSL-ის გამოსახულება იცვლება frequency და touch input-ზე | Chromium/WebKit-ში შეიცვალა, Reset/reopen მუშაობს | PASS |
| Lighting | PBR ფორმის ჩრდილი და განათება იცვლება | Chromium/WebKit-ზე angle ცვლილებისას განსხვავებული კადრი მივიღეთ, Reset/reopen გაიარა | PASS |
| Motion Physics | stiffness ცვლის მრუდს, Replay თავიდან იწყებს | Chromium/WebKit შევამოწმეთ. reduced motion-ზე კადრი სტატიკურია | PASS |
| Particle Field | ფორმა და touch რეაგირებს | Chromium/WebKit, shape/touch/Reset/reopen | PASS |
| Spatial UI | assembled/exploded ცვლის ფენების განლაგებას | Chromium/WebKit, select/Reset/resize | PASS |
| Lab lifecycle | დახურულ სცენაზე renderer და frame scheduling თავისუფლდება | ორივე ძრავში DOM სუფთაა და დახურვის შემდეგ frame count არ იზრდება. Chromium-ში სიმულირებული hidden/resume და რეალურად გამოძახებული WebGL context loss fallback შემოწმდა | PASS |
| არსებული ჰოლოგრამა და Home motion | tilt, keyboard, reset, reduced motion და timeline lifecycle | Chromium/WebKit, ჰოლოგრამა ექვს ზომაზე თითო ძრავში და Home lifecycle სამ ზომაზე თითო ძრავში | PASS |
| ხუთი გვერდი ათ ზომაზე თითო ძრავში | 320–2560px-ზე ჰორიზონტალური გადაცდენა არ იყოს | Chromium/WebKit, 100 geometry check. თითოეული hover/focus state-ის ვიზუალური მატრიცა ცალკე არ გამართულა | PASS |
| SEO და სტატიკური არქივი | metadata, canonical, JSON-LD, aliases, სატესტო 404 და sitemap | ორივე ძრავში metadata/aliases, Chromium no-JS, ხუთი sitemap URL | PASS |
| CV, mobile nav, Contact | PDF ხელმისაწვდომია და ფორმა გახსნიდანვე ვალიდირდება | Chromium/WebKit. ცარიელი ფორმა არავალიდურია. რეალური გაგზავნა არ განხორციელებულა | PASS |
| Tsero mobile | screenshot HUD, 55% overlay და live app მოთხოვნა 0 | Chromium phone emulation, portrait/landscape | PASS |
| Tsero desktop და MeeTab-ზე გადართვა | checkout, კალათის შენარჩუნება, demo payment, map და სხვა app-ის ცალკე სესია | Chromium-ზე შერჩეული გზა გაიარა, რეალური გადახდა არ ყოფილა | PASS |
| ორი თაროს სრული რეგრესია | ყველა artwork-ის არჩევა და desktop/mobile გზები | Chromium-ის გაფართოებულ ტესტში Earth Hour control click-ის ლოდინი ამოიწურა. showroom rendering და რეჟიმის გადართვა ცალკე ტესტებში გაიარა | FAIL |
| ფიზიკური მოწყობილობები, FPS, Lighthouse, full AT და საველე მეტრიკები | რეალურ გარემოში გაზომვა | ამ ეტაპზე ვერ გაიზომა | NOT RUN |

ბრაუზერის ბრძანებები: `tests/refinement_browser.py`, `tests/fallback_browser.py`, `tests/lab_browser.py`, `tests/motion_lifecycle.py`, `tests/seo_browser.py` და `tests/tsero_showroom.py`. Browser geometry და render assertions ეყრდნობა ემულაციას და ლოკალურ software WebGL-ს. პირველ WebKit ცდაში shader-ის still frame განახლება ჩავარდა, ხოლო framebuffer-ის შენარჩუნებით და native input/change event-ების დამუშავებით ხელახალი ტესტი გავიდა. გაშვებების ხანგრძლივობა გარემოს დატვირთვაზე მერყეობდა. FPS-ის შეფასება არ გაკეთებულა.

## ფაილები და დარჩენილი საკითხები

ექსპერიმენტების კოდი შეიქმნა `js/lab/`-ში, ხოლო საერთო კონტროლების CSS — `css/controls.css`-ში. შეიცვალა ხუთივე პროდუქტის HTML, Lab/Projects CSS, shared tokens და generated Home bundle, `showroom/showroom.js`, არქივის გენერატორი, ტესტები, source manifest და CHANGELOG. სრული ფაილების სტატუსებია [files.json](files.json). ფაილების წაშლა არ მომხდარა. შენარჩუნებულია prior phase-ის [ღია შემოწმებების რეესტრი](../OPEN_VERIFICATION.md).

დრაფტის განხილვა შესაძლებელია. სრული 3D regression-ის ერთ-ერთი click timeout, ფიზიკური მოწყობილობები, სრული accessibility ტესტი და წარმადობის დამატებითი პროფილირება ღიად რჩება. 3D-ის default-ზე არჩევანი ეყრდნობა WebGL 2-სა და ტექსტურის მოცულობას, ამიტომ ეს არ იძლევა გარკვეული FPS-ის გარანტიას. მომხმარებლის გადაწყვეტილება საჭიროა გამოქვეყნებაზე.

## Preview და დაბრუნება

რეპოზიტორიის root-ში `python3 -m http.server 8000` და შემდეგ `http://localhost:8000/projects.html` ან `/lab.html`. ძველი ვარიანტი საწყის SHA-ზე ინახება. გამოქვეყნებამდე დრაფტის დახურვა ან რეფაინმენტის commit-ის revert საკმარისია. გამოქვეყნების შემდეგ ჩვეულებრივი revert და Pages-ის განმეორებითი deployment გამოიყენეთ. სრული production rollout ცალკე ავტორიზაციას ელოდება.
