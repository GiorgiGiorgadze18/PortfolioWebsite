# მიმდინარე მდგომარეობა — About და case-study კონტროლები
2026-11-27 · branch feat/case-study-phase4-earth. მიმდინარე refinement-ის ცვლილებები ქვემოთ და ABOUT_REPORT.md-შია. საწყისი production commit d5178a9 ინახება backup/before-case-study-controls-ზე.

About დგას View Artwork-ის გვერდით, ერთნაირი ფორმით,11px ეტიკეტითა და ნამუშევრის ფერის გამჭვირვალე ფენით. HUD მზადყოფნის შემდეგ პირდაპირ ჩნდება. Case-study შესვლა ავტომატურად მიდის.18 ფაზამდე, პლანშეტის საწყისი ეკრანული პოზიციიდან ზომა/დახრა650ms ინტერპოლაციით იცვლება. Next უკვე ფენებს შლის. ქვედა ფენების.20 სიკაშკაშე და მათი რიგი შენარჩუნებულია.

Quit ცალკე მეორადი action-ია, refresh SVG კი Next-ის მარჯვნივ. ყველა მობილური action/chapter სამიზნე44px-ია. აღწერა14px, metadata10px. Grid-ის responsive overlay და blur მოქმედებს. არსებული back link შენარჩუნებულია და44px touch სამიზნე აქვს.

ბოლო matrix24case PASS (Chromium/WebKit ×320/390/768/1440 ×3works), geometry320px PASS, Node6suites PASS, inline JS syntax PASS. სამივე მობილური actual softwareGL cycle PASS — entry pose იცვლება Next-მდე, layers/order, restore/focus/resources, no-JS. Desktop1440 touch-adapted softwareGL PASS. სტანდარტული desktop softwareGL1440×900 ასევე PASS, მისი არტიფაქტია refined-jbl-desktop-high.json. ფიზიკური hardwareGPU/AT/FPS შეფასება NOT RUN.

## წინა ჩანაწერები

# Current state — Audio-first correction
2026-11-27 · branch feat/case-study-phase4-earth · rollback before this correction: d9784cc.

JBL now lifts the original glass/Audio source first, then rear+hero headphone parts merged losslessly, then the unchanged cloud/title. Environment+contact are a lossless stationary base; shadow/reflection no longer raises as the stand. Current grouping supersedes the earlier rear/glass/hero grouping described historically in STACK_REPORT.md.

All three projects: normalized desktop/mobile gaps75/48 (exactly half150/96), passed-sheet brightness.20 instead of.52, active1. Full art and frame dim together; pure reversible timeline, original endpoints retained. Lower offset90 (was180) and live vertical adjustment.06 (was.12) keep compact framing centered. Neutral frame palette/grid/glow and unrelated site code unchanged.

Read STACK_REPORT.md latest refinement, HANDOFF.md and evidence/stack. Original assets and backup refs preserved. No PR/merge/deploy; public enabled/published flags remain false. Physical devices/hardwareGPU/AT/full context loss/10cycle trend remain NOT RUN; historical intermittent desktop Tom Ford exit focus issue is not claimed fixed.

Final evidence:12staged Chromium/WebKit cases PASS,6Node suites PASS,source group identity PASS,actual phone JBL full cycle PASS. Actual desktop JBL opened/rendered correctly but exit focus FAIL (existing limitation); see compact-jbl-desktop-scene.json. Preview and source updates are review-only.

2026-11-27 constant shade correction: passed sheets now take final brightness.20 immediately when the next rise begins; no progressive dim ramp. Same shared implementation for all3projects and DOM/WebGL. Subsequent chapters retain exactly.20; reassembly restoration unchanged. Regression assertions cover onset and later chapters. No merge/deploy.

2026-11-27 visible-shadow correction: undimmed future sheets still overlapped/repainted the dimmed base. All inactive sheets (past AND not-yet-raised) now receive.20 brightness from first rise; only current active rank stays1. Shared DOM/WebGL implementation on all3projects. Earlier numeric-only fix did not address this overlap. Reassembly/spacing/assets unchanged.

Visible-shadow verification:6Node suites PASS;12Chromium/WebKit desktop/phone emulation cases PASS,36stage screenshots, page errors0. First-stage screenshots manually reviewed on all3projects. Future as well as passed sheets are.20, current sheet1. Actual live-WebGL exit was not rerun in this small shared-state correction; previous desktop focus-return FAIL remains open. Rollback before this correction:7974957. New standalone names: JBL-shadow-fix-preview.html,TomFord-shadow-fix-preview.html,Earth-shadow-fix-preview.html. No publication.

2026-11-27 owner authorized public graphic About integration and publication. Current config enabled/published true for3graphic projects. Read ABOUT_REPORT.md and current about-grid/about-* artifacts. Public About replaces preview-only trigger, selected pose is held until Next; Grid launches directly in blurred-backdrop dialog. Apps remain outside this graphic integration.

2026-11-27 refinement supersedes previous hold-until-Next behavior: About is beside View Artwork; entry blends from the selected pose into the assembled case-study pose, then Next raises layers. Quit replaces text Replay; refresh icon sits beside Next. Shared DOM controls and WebGL entry support all3graphic works.
