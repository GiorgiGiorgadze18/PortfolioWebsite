# MASTER CASE STUDY ORCHESTRATOR — END-TO-END EXECUTION

**Target:** ChatGPT Codex (or any agent with repository + filesystem access).
**Owner:** Giorgi Giorgadze, Digital Designer & Creative Developer.
**Repository:** https://github.com/GiorgiGiorgadze18/PortfolioWebsite
**Live site:** https://giorgigiorgadze18.github.io/PortfolioWebsite/
**Language:** This brief and all code/comments are English. **Every report and every question addressed to the owner is written in Georgian.** UI copy of the case studies is English first, with an optional `ka` translation layer.

---

## 0. Launch protocol

This file is the single source of truth. Recommended: save it as `docs/case-study/MASTER.md` (and the other numbered prompts next to it), then launch with this one-liner:

> Read `docs/case-study/MASTER.md` completely, then execute only §18 ("First response contract"). Do not start Phase 1 before I approve Gate 0.

If this text was pasted directly, begin at §18.

The condensed modules in §7–§11 are authoritative. If `docs/case-study/02…05-*.md` exist, read them for extra depth; they never override §2 (rules).

---

## 1. Mission

Add a signature **Case Study system** to the existing interactive 3D showroom. Do not rebuild the portfolio.

- **Type A — GraphicExplodedCaseStudy:** a finished graphic-design artwork (JBL, Tom Ford, Earth Hour, future works) separates into its meaningful visual components in 3D space, each with a design-rationale annotation, then recomposes into the original artwork.
- **Type B — ApplicationStorytellingCaseStudy:** a scroll-driven cinematic product story for apps (Tsero on a phone, MeeTab on a tablet): the device moves, the app navigates itself screen to screen, UI highlights and annotations explain Problem → Cause → Goal → Solution → Under the hood → Result, with verified technical architecture.
- One shared, data-driven engine; new projects are added through assets + JSON + (for apps) a demo adapter, not engine rewrites.

Quality bar: premium, cinematic, precise, original. Maximize meaningful visual impact, not effect count; maximize quality and maintainability, not code volume; maximize practical autonomy, not manual coordination.

---

## 2. Non-negotiable rules

1. **Evidence over claims.** Never write PASS, "verified", "60 FPS" or "pixel-perfect" without a recorded artifact (command output, screenshot, trace, diff metric). Test statuses are only `PASS`, `FAIL`, `NOT RUN`, `BLOCKED`.
2. **No fabricated project facts.** Every factual statement shown to visitors (stack, features, numbers, dates, clients, results, architecture) must exist in `docs/case-study/CLAIMS_LEDGER.json` with an evidence pointer (file path, commit, URL) and a status: `production | staging | verified-dev | prototype | planned | concept`. No evidence → do not display it, or display it labelled `concept/planned`. Planned Outlook/Office 365/Exchange integration is never shown as done.
3. **Designer intent vs interpretation.** Rationale text is labelled `designerIntent` (owner confirmed) or `visualInterpretation` (inferred from the image). Collect open questions in `docs/case-study/QUESTIONS.md` as one batched Georgian list; do not block on them.
4. **Preserve the showroom.** Capture baseline screenshots before any change; keep spotlight, lighting, device models, current demos, navigation, accessibility and performance work intact. Ship new features behind a flag (`caseStudies.enabled`, per-project `published`).
5. **Non-destructive.** Never overwrite or modify original artwork; originals stay untouched (hash them in the manifest). Work on a new branch per phase from current HEAD (`feat/case-study-phaseN-…`). Run `git status` first; if the working tree has uncommitted changes, stop and ask. No force-push. **Never merge or deploy without approval.**
6. **Security.** Never print, log or commit secrets/tokens/keys; check env-var presence only. Strip private infrastructure identifiers from public assets. Demo data is deterministic and fake; never create real bookings, orders, payments or support emails; never touch production data.
7. **Honest capability use.** Discover tools instead of assuming them. Do not invent tool names. Never claim that another AI (ChatGPT, Claude) received anything or generated files unless that actually happened in this session. Do not claim background execution.
8. **Artwork fidelity.** Prefer deterministic segmentation, alpha masks and conventional compositing for existing pixels. Generative fill only for hidden/missing pixels, masked and feathered. Never redesign products, logos or typography.
9. **Determinism.** Presentation state is a pure function of scroll progress: `stateAt(p)`. No `setTimeout` choreography, no accumulated transforms, no scroll hijacking (native scroll drives a pinned section).
10. **Minimal dependencies.** Use the existing stack (inspect it). Add a library only if justified in `DECISIONS.md` (reason, size, alternative considered).
11. **Accessibility is a deliverable:** WCAG 2.2 AA target, keyboard path, reduced motion, non-WebGL alternative, focus restoration, Esc to exit. Distinguish automated checks from manual verification in reports.
12. **Performance is measured**, with documented conditions (browser, headless/GPU, viewport, throttling). Headless software-GL numbers are labelled non-representative of real GPUs.
13. **Never publish an incomplete case study.** Unvalidated assets or unverified claims → `published:false`.
14. **Ask the owner only when blocked** by: missing artwork/source files, missing demo source/permissions, unavailable image-generation capability with no fallback, authorization, an ambiguous creative decision that changes direction, large architectural change, deployment approval, paid credits.
15. **Autonomy inside scope.** Do not ask approval for minor implementation details.

---

## 3. Operating protocol

**Gates (stop and report in Georgian, then wait):**
- **Gate 0** — after Phase 0 report + plan.
- **Gate 1** — after Phase 1 (engine) + Phase 2/3 (JBL reference).
- **Gate 2** — after Phase 4 (other graphic works).
- **Gate 3** — after Phases 5–6 (Tsero, MeeTab).
- **Gate 4** — after Phases 7–8, before any merge request.
The owner may pre-approve ("approved through Gate N"); between gates act autonomously. Independent tasks may proceed in parallel; a blocked asset task must not block unrelated app work.

**Persistent state** (create under `docs/case-study/`, update after every task, commit with the work): `PLAN.md`, `PROGRESS.md` (phase, done/pending/blocked, branch, commit SHA, required owner actions), `ARCHITECTURE.md`, `TEST_REPORT.md`, `ASSET_MANIFEST.json`, `HANDOFF.md`, `DECISIONS.md`, `CLAIMS_LEDGER.json`, `QUESTIONS.md`. A fresh session must be able to resume from these files alone. Add a short "Case Study System" section to `AGENTS.md` pointing to them (create `AGENTS.md` only if absent; otherwise append).

---

## 4. Phase 0 — Baseline audit & capability discovery

1. Read `AGENTS.md`, README, package manifests, build config, existing docs.
2. Inspect the showroom: renderer/library versions, scene graph, device models, materials, lighting, camera system, interaction/routing, scroll handling, how demos are embedded (iframe? same-origin? separate repo/host? origins), and asset inventory (path, format, pixel size, bytes).
3. List branches and open PRs. **Reconcile with prior work if present:** the two-sided showroom wall (graphics may now sit on paper art boards on a back wall instead of a device screen) and earlier "About" explainer templates (`explain.html`, `explain-app.html`, `assets/data/*explainers*`). Reuse data models/assets; do not duplicate. Define a `DisplaySurface` abstraction so the case study works whether the artwork lives on a device screen or a paper board (for a board: "device tilts back" becomes "board lifts toward camera"; "reconstructed background stays on the screen" becomes "stays on the board").
4. Locate originals: JBL, Tom Ford (Tobacco Vanille), Earth Hour. Prefer layered sources (PSD/AI/SVG/Figma export) over flattened PNG/JPG; report which exist.
5. **Capability probe** (record results in `PLAN.md`; do not print secrets): Python and packages (Pillow, numpy, opencv, scikit-image, onnxruntime, torch, rembg or segmentation models), Node/npm, Playwright + browsers, network reachability (with timeouts), GPU presence, image-generation/editing API availability and whether the owner authorized its use and a spend limit (check env-var *presence* only), MCP servers/skills, git ability.
6. Baseline: Playwright screenshots (desktop 1440×900, laptop 1280×720, tablet 820×1180, phone 390×844), console errors, load metrics, 10-second frame-time sampling in the showroom, memory where measurable. Record conditions.
7. Risks, regression list, acceptance criteria per case study.

---

## 5. Dependency graph

```
repo audit → capability probe → source inventory → artwork analysis → extraction → background reconstruction → asset validation
→ shared engine → JBL reference → graphic framework validation → Tom Ford, Earth Hour
→ Tsero adapter → Tsero case study → MeeTab adapter → MeeTab case study
→ integration → performance, a11y, security, cross-browser tests → final review
```
Shared engine and app-adapter work do not depend on graphic asset processing. Validation gates are never bypassed.

---

## 6. Phase 1 — Shared Case Study Engine (minimum viable, data-driven)

Layout (adapt to repo):
```
case-studies/shared/{engine,camera,timeline,layers,annotations,adapters,motion,a11y,performance}
case-studies/projects/<slug>/{manifest.json,timeline.json,annotations.json,assets/,demo-adapter/}
```
Contracts:
- `CaseStudyEngine.open(slug) / close() / replay() / goToChapter(id)`; lifecycle `idle → entering → active → exiting → disposed`; on exit restore the exact showroom state (camera, selection, wall side, focus) and dispose everything.
- `ProgressSource`: pinned `position: sticky` container driven by native scroll; progress smoothed with a critically damped spring; also accepts programmatic seek (chapter dots, keyboard).
- `Timeline.stateAt(p)`: pure function returning camera pose, device/board pose, layer offsets, active screen/state, highlights, annotation visibility, lighting. Interpolates keyframes with named easings. Supports forward, backward, fast scroll, resize, direct chapter jump, replay, exit.
- `CameraRig`, `DisplaySurface`, `LayerStage` (Type A), `AppAdapter` (Type B), `AnnotationLayer` (DOM/SVG overlay anchored to projected 3D points or screen positions, with simple collision-avoiding label placement and leader lines), `QualityManager`, `A11yShell` (semantic parallel content), `Disposer`.
- Deep links (`?case=<slug>` or the repo's routing convention) and `<title>`/metadata per project; progressive loading (assets fetched on open only).
- Reduced-motion/no-WebGL path = **Stepper mode**: semantic chapters as static cards with poster images; no pinning; same information.
Validate the architecture on JBL before building the rest.

---

## 7. Module G — Graphic asset pipeline (Phase 2)

Goal: individually usable, real-alpha layers + a reconstructed background that recompose to the original.

1. **Source choice:** layered source > vector > high-res flattened. Preserve masters; record SHA-256.
2. **Analysis:** identify hero/secondary products, pedestal/stand, environment surfaces, typography, logos, graphic/decorative elements, light effects, reflections, shadows, atmosphere, composition structure. **Meaningful-layer test:** keep a component only if it carries visual hierarchy, brand communication, product positioning, lighting, depth or marketing intent. Target 4–7 layers. No fragmentation.
3. **Extraction:** coarse mask (segmentation/matting if available, otherwise classical: GrabCut/edge-aware thresholding/manual polygon refinement), then refine edges (guided filter/closed-form matting), colour-decontaminate fringes (no white/black halos), clean alpha (no jaggies, no remnants). Preserve silhouette, proportions, perspective, branding, materials, colours. Typography/logos: use vector/source if available; otherwise extract as-is.
4. **Background reconstruction (critical):** for each removed object, build a mask (dilate 8–24 px to include halo/contact shadow). Small/simple regions: OpenCV Telea/Navier–Stokes, gradient/texture continuation. Large/complex regions: authorized generative inpainting on a *crop with context padding*, never on the full canvas; paste back through a feathered mask; **verify pixels outside the mask are bit-identical to the original**; match grain/noise, palette, perspective, light direction. Separate object-specific shadows/reflections into their own layers. Result must look coherent when shown alone on the device screen: no silhouettes, no seams, no residual reflections.
5. **Honesty:** hidden pixels of a flattened image cannot be recovered with historical accuracy; they are plausibly reconstructed. Record `original | reconstructed` per layer region in the manifest. Do not present reconstruction as verified geometry.
6. **Occluded objects:** reconstruct missing parts only if the timeline reveals them; otherwise leave them and constrain camera/parallax so they stay hidden. Document which parts are original and which reconstructed.
7. **Export:** full-canvas aligned transparent PNG masters (`RGBA`, real alpha; a painted checkerboard is a failure) + optimized WebP production files (target ≤ 300 KB per layer where quality permits) + masks + depth map when used + per-project `manifest.json`. Never one image containing several objects. Layout `case-studies/projects/<slug>/assets/{masters,web,masks}/` with stable names like `01-background-reconstructed`, `02-hero-product`.
8. **Metadata per layer:** id, display name, source file, canvas w/h, bbox, normalized x/y, size, rotation, stacking order, mask ref, pivot, suggested depth, representation (`plane | parallax | depthDisplacement | extruded | model`), suggested exploded offset, rotation limits, annotation anchor, reconstruction status, validation status. Measured values only.
9. **Recomposition validation (before any animation):** composite all layers over the reconstructed background and compare with the original: per-pixel mean/max absolute difference, SSIM outside reconstructed regions, edge-halo check, alpha sanity (min/max, not fully opaque), identical dimensions, alignment. Produce a checkerboard contact sheet + recomposite preview, and **look at them**. Targets (not claims): mean abs diff ≤ 1/255 in untouched regions, SSIM ≥ 0.995 outside reconstructed regions. If the recomposite cannot match exactly, plan a synchronized cross-fade to the original at the end — no visible jump. Do not proceed with invalid assets.
10. **If a required capability is missing**, run §15.

---

## 8. Module GX — Holographic exploded composition (Phases 3–4)

**Representation per object:** transparent planes / multi-plane parallax / depth displacement / extruded or procedural geometry / existing model. Prefer faithful 2.5D over an incorrect 3D reconstruction. For single-view assets limit rotation, use controlled parallax, never expose unsupported rear sides, never stretch flat assets. Never claim a flat image contains a valid 360° model.

**Coordinates:** image px → normalized (u,v) → world, anchored to the display surface; stable under resize (derive from surface size, not viewport).

**Choreography (adapt per artwork; do not reuse one pattern for all):**
1. Original on the surface. 2. Surface moves/tilts back; camera takes a cinematic angle. 3. Subtle activation (soft edge shimmer, restrained scan reveal; no aggressive glitch). 4. Hero emerges first, then supporting elements (pedestal down, upper surfaces up, light/graphics where relevant). 5. Reconstructed background stays on the surface. 6. Clear exploded composition with hierarchy and spacing. 7. Thin technical annotation lines + rationale. 8. Where meaningful: palette (extracted), type (labelled `identified`/`likely` unless source confirms), grid, hierarchy, lighting direction, materials. 9. Recompose to the original. 10. Exit/replay/next project.

**JBL reference:** tablet displays the artwork → tilts back → headphones become the central object → pedestal lower → environment surfaces upper → reconstructed background remains → annotations → recompose. Only separate elements that really exist in the artwork.

**Holographic look:** controlled — rim light from alpha edges, soft bloom, volumetric hint, contact shadows, ambient occlusion, restrained scanline. Not all-blue, not neon sci-fi, no particle storms, no excessive transparency, no random floating rectangles.

**Annotations:** concise, explain *why*, follow anchors, no overlaps/unnecessary crossings, readable, adapt to camera and viewport, screen-space or world-space as appropriate.

**Optional controls** (unobtrusive): assemble/explode slider, replay, previous/next, focus layer, annotations toggle, reset view.

---

## 9. Module A — Application adapter & scroll storytelling (shared by Type B)

Chapter schema: id, title, description, progress range, camera pose/target, device pose/scale, active screen, app state, internal scroll, highlights, annotations, lighting, technical-visual state, transition type.

**Adapter decision order (choose and document):**
1. Demo lives in this repo or an editable repo → add an isolated presentation module (`?presentation=1`) exposing commands.
2. Cross-origin iframe you control → versioned, origin-allow-listed `postMessage` protocol (`cs:hello` capability handshake; commands `navigate`, `setState`, `setScroll`, `highlight`, `clearHighlights`, `openModal`, `closeModal`, `simulate`, `reset`, `enter/exitPresentation`; every command idempotent, acknowledged, deterministic from a seeded demo state).
3. Demo not controllable → record deterministic frames/video from the real demo with Playwright using seeded data and play them back; label them "recorded from the live prototype".
Rendering the screen: do **not** assume an arbitrary/cross-origin iframe can become a WebGL texture. Choose among CSS3DRenderer/DOM overlay aligned to the 3D screen, pre-rendered frame textures, or same-origin canvas capture. Coordinate-based simulated clicks are never the primary mechanism.
Always keep the real, independent demo reachable ("Explore the interactive demo").

---

## 10. Module T — Tsero (Phase 5)

Georgian food-delivery app concept, brand `#FF3316`. Inspect real source and demo first; mark each feature `prototype | implemented | concept | planned`; invent no backend. Energetic, modern, brand-specific choreography on the phone (do not copy MeeTab's).
Chapters (improve after inspection): 1 Product intro (identity, premium entrance) · 2 Discovery (home, categories, restaurants) · 3 Search & selection · 4 Restaurant & product (imagery, hierarchy, price, cards) · 5 Cart (quantity/price feedback, simulated data) · 6 Checkout (no real payment) · 7 Delivery tracking (map, status, courier — as implemented/concept) · 8 Design system (real palette/type/icons/components; selected components emerge holographically) · 9 Under the hood (verified architecture only) · 10 Final product + "Explore the Tsero demo". Include Problem → Cause → Goal framing only with owner-confirmed facts.

## 11. Module M — MeeTab (Phase 6)

Tablet meeting-room management/booking app for corporate rooms. Inspect the actual project; classify each capability `production | staging | verified-dev | prototype | planned`. Possible areas: availability, current meeting, calendar, 15/30-minute quick booking, Google Calendar integration, admin, IT support, PostgreSQL, Render hosting, Android tablet deployment, authentication, multi-company architecture. No fake research or business results.
Chapters: 1 The problem · 2 Product intro · 3 Room availability (hierarchy fit for a wall tablet) · 4 Calendar · 5 Quick booking (safe demo data) · 6 Administration (no real credentials) · 7 IT support (no real request) · 8 Design system · 9 **Under the hood — signature chapter:** the tablet dissolves into a cinematic architecture visualization with intentional spatial layout and animated *verified* request flow (e.g. tablet → API → availability validation → calendar integration → storage → updated state — only the verified sequence), each component explained, no secrets/infrastructure identifiers · 10 Deployment & reliability (verified Android/web/staging/testing/security practices; no invented stats) · 11 Final product + "Explore the MeeTab demo".

---

## 12. Phase 7 — Integration

Showroom entry points ("Explore Case Study" on selected device/board), device transitions, project navigation, return transitions, deep links, metadata, responsive layouts, accessibility, browser compatibility, asset loading, memory, security boundaries, compatibility with existing features. Do not redesign unrelated sections.

## 13. Phase 8 — QA (Playwright + manual where needed)

Entry/exit · chapter navigation · forward/backward/fast scroll · direct chapter jump · animation interruption · resize/orientation · asset alignment · layer transparency · background appearance · annotation positions · recomposition · app-screen sync + internal scroll · demo reset · WebGL failure (simulate context loss) · reduced motion · mobile touch · keyboard-only · resource cleanup (no leaked rAF loops/textures/listeners; check GPU/heap trend across 10 open/close cycles) · existing showroom regression vs baseline screenshots. Capture screenshots/video/traces. Run an automated accessibility scan if installable; report it as automated-only. Unexecuted tests are `NOT RUN`.

---

## 14. Cross-cutting standards

- **Motion:** one language — shared easings, interruptible, reversible, no state jumps, no layout shifts, no duplicate loops, no accumulated transforms; use the existing animation stack; WAAPI/rAF/state machines over timeouts.
- **Visual consistency:** dark technological showroom (materials, lighting direction, shadows, camera language) + each project keeps its own identity (Tsero brand, MeeTab visual identity, original artwork).
- **Responsive:** not just scaled-down desktop — adapt camera distance, placement, layer spacing, annotation layout, text size, controls, render quality; small screens use sequential explanations, compact panels, chapter navigation, simplified scenes or static fallbacks; no information lost.
- **Accessibility:** semantic HTML, visible focus, accessible chapter descriptions and controls, screen-reader text for every layer/annotation, sufficient contrast, reduced motion, WebGL-independent alternative, Esc, focus restoration, no hover-only interaction, visitors can skip chapters. Project pages have meaningful URLs and indexable content.
- **Performance:** on-demand init; lazy per-project assets; texture compression/responsive sizes; budget GPU/texture memory; DPR cap (≤2, ≤1.5 on mobile); adaptive quality from frame-time EMA; pause when tab hidden; single animation loop; dispose geometries/materials/textures; handle context loss; no leaks. Report measured numbers with conditions.

---

## 15. Handoff protocol (only when capability is genuinely missing)

If visual processing (segmentation, inpainting, generation) cannot be done here: 1) check for an authorized integration/shared workspace; if one truly exists, transfer only the necessary artwork (never code/secrets/unrelated files), validate what returns, register it, continue. 2) Otherwise create `docs/case-study/handoff/<slug>/`: originals, required layer list, masks if available, exact file names, dimensions, alpha requirements, expected positions, destination folders, acceptance criteria, validation script, resume instructions — zipped if possible — plus **one** copy-ready ChatGPT prompt (use `02-UNIVERSAL-GRAPHIC-ASSET-PROMPT.md`). Say plainly in Georgian what the owner must do. When files arrive, validate and resume from `PROGRESS.md`; never restart.

---

## 16. Report template (Georgian, one per phase)

1. ფაზის დასახელება და სტატუსი · 2. მდგომარეობა ცვლილებამდე · 3. აღმოჩენილი პრობლემები · 4. რა შეიცვალა · 5. რატომ · 6. ვიზუალური გაუმჯობესება · 7. ტექნიკური გაუმჯობესება · 8. ახალი აქტივები · 9. შექმნილი/შეცვლილი ფაილები · 10. შენარჩუნებული ფუნქციონალი · 11. ჩატარებული ტესტები · 12. ტესტების რეალური შედეგები (`PASS/FAIL/NOT RUN/BLOCKED`) · 13. Before/After · 14. გაზომილი Performance (პირობებით) · 15. პრობლემები და შეზღუდვები · 16. დამოუკიდებლად მიღებული გადაწყვეტილებები · 17. Branch და Commit SHA · 18. Rollback ინსტრუქცია · 19. შემდეგი ეტაპი · 20. ჩემი საჭირო მოქმედებები (მხოლოდ აუცილებლობისას).
No evidence → say "მტკიცებულება არ არსებობს".

The final consolidated Georgian report (after Gate 4) additionally contains: executive summary, original vs final state, completed case studies, asset inventory, engine architecture, visual/motion/sync/technical-story improvements, accessibility and performance results, security assessment, remaining limitations and technical debt, how to onboard a new project, final branch/SHA, preview instructions, deployment readiness, rollback. Never say "production-ready" without completed verification.

---

## 17. Definition of done

**Graphic case study:** original fidelity; individually usable assets with valid alpha; coherent reconstructed background; minimal artifacts; preserved proportions; intentional spatial composition; readable meaningful annotations; smooth interruptible/reversible separation; consistent recomposition; usable mobile alternative; existing features intact; unresolved inaccuracies reported.
**Application case study:** accurate representation; app states match chapters; synced internal scrolling; coherent camera/device motion; meaningful highlights; restorable states; isolated demo data, no real transactions; verified architecture claims; chapters skippable; safe exit; link to the real demo; existing demo behavior preserved; responsive alternative usable.
**Engineering:** maintainable, data-driven, no duplication, minimal dependencies, no leaks, no duplicate loops, on-demand loading, accessibility preferences respected, fallbacks, documented interfaces, meaningful automated tests where practical.

---

## 18. First response contract (do this now, then stop)

Execute **Phase 0 only**. Create the `docs/case-study/` state files. Reply in Georgian with: (1) the Phase 0 report (§16 format), (2) what exists vs. what is missing (originals, layered sources, demo sources), (3) capability discovery results, (4) how you will adapt to the current showroom state (device screen vs. paper board; earlier explainer work), (5) the phase plan with estimated checkpoints, (6) one batched list of questions/decisions needed. Then wait for **Gate 0**.
