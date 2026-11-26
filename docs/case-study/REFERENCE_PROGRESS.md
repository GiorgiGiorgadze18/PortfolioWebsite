# JBL reference — შუალედური ანგარიში

1. **ფაზა/სტატუსი:** Phase1–3 ნაწილობრივ შესრულებულია; საბოლოო Gate1 ჯერ არ გამოცხადებულა.
2. **მანამდე:** მხოლოდ ძრავის მოდულები და აქტივების კვლევა არსებობდა; სანახავი ანიმაცია არ იყო.
3. **პრობლემები:** PNG blend modes-ის დაკარგვა, ფენების რიგი, ყურსასმენის დაყოფისას არასწორი სილუეტის რისკი.
4. **ცვლილება:** სანახავი6-ფენიანი CSS3D პრეზენტაცია, თავები, Replay, SVG კავშირი აქტიურ ფენასთან, original-image endpoints.
5. **მიზეზი:** კვლევიდან რეალურად გასატესტ პროტოტიპზე გადასვლა.
6. **ვიზუალი:** ფენების ზომიერი სივრცული გაშლა; ყურსასმენის ნაწილები ერთად მოძრაობს; მობილურზე განმარტება ქვემოთაა, ხაზი დამალულია.
7. **ტექნიკური ნაწილი:** shared timeline/spring/engine, ცალკე reference renderer; native scroll, ვიდეო/ერთიანი სქრინი არ არის.
8. **აქტივები:** PSD blend appearance-baked6 PNG/WebP; masters/original archive დაცულია. დაუმუშავებელი ორიგინალების შეცვლა არ მომხდარა.
9. **ფაილები:** case-studies/jbl-preview.html; shared/{entry,reference}.*; project chapters/manifest/assets; export_reference.py; browser tests; evidence/reference; docs და hash manifest.
10. **შენარჩუნებული:** parent showroom-ის camera/selection არ იცვლება; dialog-ის გახსნისას drawing პაუზდება. არსებული app სცენარები თავიდან არ შემოწმებულა.
11. **ტესტები:** Node engine/timeline; Chromium/WebKit desktop/phone; actual Chromium selection+entry/exit3 ციკლი; no-JS chapters.
12. **შედეგები:** tests.json და entry-tests.json-ში PASS დაფიქსირებულია მითითებულ ფარგლებში; სრული console/a11y/portfolio matrix NOT RUN.
13. **Before/After:** ადრე ვიზუალური reference არ იყო; ახლა evidence/reference/*exploded.png ასახავს საცდელ გაშლილ მდგომარეობას.
14. **Performance:** წარმადობის ახალი GPU/FPS გაზომვა არ ჩატარებულა. ტესტები headless/emulation-ია; entry SwiftShader-ით.
15. **შეზღუდვები:** ყველა ფენის სრული edge/SSIM gate ღიაა; საბოლოო in-scene camera choreography დაუმთავრებელია; რეალური hardware/AT არ შემოწმებულა.
16. **გადაწყვეტილებები:** გამოყოფილი CSS3D preview იცავს არსებულ3D scene-ს; მხოლოდ caseStudyPreview=1 აჩენს შესასვლელს. published:false.
17. **Branch/SHA:** feat/case-study-phase1-engine; შესაბამისი კომიტი: git log -1 --format=%H -- docs/case-study/REFERENCE_PROGRESS.md.
18. **Rollback:** production merge/deploy არ ყოფილა. ამ კომიტის revert ან წინა3b3b70a-დან ცალკე branch აღადგენს წინარე მდგომარეობას; არსებულ worktree-ს reset არ გაუკეთოთ.
19. **შემდეგი:** საბოლოო surface/camera integration, გაფართოებული აქტივების ხარისხი და regression gates. ეს ანგარიში დასრულების/production readiness-ის განცხადება არ არის.
20. **მფლობელის მოქმედება:** ამ ეტაპზე დამატებითი წყარო ან ნებართვა საჭირო არაა; გაგრძელებისთვის არსებული scope საკმარისია.

ლოკალური preview: python3 -m http.server 3000; შემდეგ /case-studies/jbl-preview.html ან /projects.html?view=3d&caseStudyPreview=1 და JBL-ის არჩევა. სერვერი ამ ანგარიშით ავტომატურად არ ირთვება.
