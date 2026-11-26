# TSERO IMPLEMENTATION PROMPT — Immersive Product Storytelling (ChatGPT Codex)

Standalone fallback. If `01-MASTER-ORCHESTRATOR.md` is present, its §2 rules, §3 protocol and §16 report format also apply.

**Repo:** https://github.com/GiorgiGiorgadze18/PortfolioWebsite · **Reports and questions: Georgian. Code: English.**

## GROUND RULES (condensed)

Evidence over claims (`PASS/FAIL/NOT RUN/BLOCKED`) · new branch from HEAD, `git status` first, no force-push, no merge/deploy without approval · no secrets printed/committed · preserve the showroom and the working Tsero demo (baseline screenshots first, feature flag) · state = pure function of scroll progress, no timeout choreography, no scroll hijacking · **no fake data presented as fact** · no real orders/payments/emails, deterministic seeded demo data only · minimal dependencies · accessibility + reduced motion + non-WebGL path required.

## PRODUCT

**Tsero** — a Georgian food-delivery mobile application concept. Brand color **`#FF3316`**. Original branding, UI/UX design and an interactive demo ("Try Now") already exist in the showroom on the phone. The presentation must feel **energetic, modern and brand-specific**. Do not reuse MeeTab's choreography.

## 1. Inspect before designing (report in Georgian)

Find the Tsero demo source, how it is embedded (same repo/iframe/separate host/origin), its screens and routes, state handling, framework, data source, assets, fonts, icons, colour tokens, components, and any README/design files. Build the **Claims Ledger** (`CLAIMS_LEDGER.json`): each feature/technology → evidence → status `implemented | prototype | concept | planned`. Never invent backend, database, payment, courier or map services. If a feature (e.g. live tracking) is only a visual concept, label it "concept". Reconcile with earlier "About this app" explainer work if it exists (reuse chapters/data).

## 2. Presentation adapter

Choose, document in `DECISIONS.md`, and implement the safest option, in this order:
1. Demo editable here/in an editable repo → add an isolated presentation module activated by `?presentation=1`, exposing deterministic commands.
2. Cross-origin iframe you control → versioned, origin-allow-listed `postMessage` protocol: `cs:hello` (capability handshake), `navigate{screen}`, `setState{stateId}`, `setScroll{progress}`, `highlight{selector|id}`, `clearHighlights`, `openModal/closeModal`, `simulate{action}`, `reset`, `enter/exitPresentation`; commands idempotent, acknowledged, validated; demo state seeded.
3. Not controllable → record deterministic frame sequences/video from the real demo with Playwright using seeded data; label "recorded from the live prototype".
Rendering the phone screen: do not assume an arbitrary iframe becomes a WebGL texture. Use CSS3DRenderer/DOM overlay aligned with the 3D screen, pre-rendered frames, or same-origin canvas capture. Simulated coordinate clicks are never the primary mechanism. The real demo stays independently reachable.

## 3. Storytelling timeline (`timeline.json`, deterministic `stateAt(p)`)

Each chapter: id, title, description, progress range, camera pose/target/orientation, phone position/rotation/scale, active screen, app state, internal scroll, highlights, annotation states, lighting, transition behavior. Backward scroll restores earlier states; fast scroll and direct chapter jumps work; resize never corrupts the timeline; replay resets; exit restores the showroom.

Chapters (adapt after inspection; drop or merge any chapter the real app cannot support):
1. **Product introduction** — premium entrance of the phone; identity, purpose, `#FF3316` brand color and visual language.
2. **Discovery** — home, food categories, restaurant browsing; sync the external camera; highlight visual-hierarchy decisions.
3. **Search & selection** — search/filters as implemented; how the UI helps users find food and restaurants.
4. **Restaurant & product** — navigate into restaurant/product views; highlight imagery, information hierarchy, price presentation, product cards, navigation, interaction states.
5. **Cart** — add to cart, quantity and price behavior as implemented; interaction feedback and usability decisions (simulated product data).
6. **Checkout** — how essential ordering information is organized; no real payment.
7. **Delivery tracking** — map, status, courier information as implemented or concept; why they build user confidence.
8. **Design system** — real brand identity, palette, typography, icons, components, navigation, states, UI patterns; selected components emerge holographically from the screen and show relationships.
9. **Under the hood** — verified implementation architecture only: front-end structure, navigation, state management, component organization, demo architecture, data handling, API usage if verified.
10. **Final product** — return the phone to a presentation pose; action "Explore the interactive Tsero demo".
Optional framing: Problem → Cause → Goal → Solution **only** with owner-confirmed facts (`designerIntent`), otherwise skip or label `visualInterpretation`. Never fabricate research, metrics or business results.

## 4. Motion language

Brand-driven: confident springy easing, bold camera moves, saturated brand color accents, quick UI highlights (ring/spotlight on the element, subtle ripple on tap targets), internal screen scrolling synchronized with progress, holographic component emergence in the design-system chapter (controlled, not all-blue). Annotations: concise, anchored to UI elements, no overlaps, readable, responsive.

## 5. Quality requirements

- Responsive: desktop/laptop/tablet/phone, portrait/landscape, mouse/touch/keyboard; adapt camera distance, device placement, annotation layout, text sizes, render quality; small screens use sequential chapter cards with the phone above or a static stepper.
- Accessibility: WCAG 2.2 AA target, semantic chapters with text equivalents, keyboard navigation, visible focus, reduced-motion stepper, non-WebGL alternative, Esc, focus restoration, chapters skippable, no hover-only interaction.
- Performance: on-demand loading, DPR cap, adaptive quality, pause when hidden, dispose on exit, measured numbers with conditions (no "60 FPS" claims without measurements).
- Security: validate message origins, no credentials exposed, no production APIs called by the presentation.

## 6. Tests (Playwright, with evidence)

Entry/exit · every chapter reaches the intended screen/state · forward/backward/fast scroll · direct chapter jump · resize/orientation · internal scroll sync · demo reset · reduced motion · mobile touch · keyboard-only · iframe/adapter failure fallback · resource cleanup over 10 cycles · showroom regression vs baseline · the standalone demo still works.

## 7. Output contract

Report in Georgian (Master §16 format, 20 points) with real test statuses, measured performance with conditions, branch + commit SHA, rollback instructions, claims-ledger summary (what is shown as implemented vs concept), and only truly necessary owner actions. Update `docs/case-study/PROGRESS.md`. Keep `published:false` until all acceptance checks pass. Stop for review before touching MeeTab.
