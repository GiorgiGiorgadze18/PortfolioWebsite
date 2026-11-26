# MEETAB IMPLEMENTATION PROMPT — Enterprise Product Storytelling with Technical Architecture (ChatGPT Codex)

Standalone fallback. If `01-MASTER-ORCHESTRATOR.md` is present, its §2 rules, §3 protocol and §16 report format also apply.

**Repo:** https://github.com/GiorgiGiorgadze18/PortfolioWebsite · **Reports and questions: Georgian. Code: English.**

## GROUND RULES (condensed)

Evidence over claims (`PASS/FAIL/NOT RUN/BLOCKED`) · new branch from HEAD, `git status` first, no force-push, no merge/deploy without approval · **never print or commit secrets, tokens, connection strings, internal hostnames, project/service IDs** · preserve the showroom and the working MeeTab demo (baseline screenshots first, feature flag) · state = pure function of scroll progress, no timeout choreography, no scroll hijacking · no real bookings, support requests, calendar writes or admin actions — deterministic seeded demo data only · minimal dependencies · accessibility + reduced motion + non-WebGL path required.

## PRODUCT

**MeeTab** — a meeting-room management and booking application designed primarily for **tablets** mounted at corporate meeting rooms. Tone of the presentation: **professional, precise, technically informative, enterprise-grade**. Technical storytelling is the signature of this case study.

Known/possible areas (each must be **verified in the code or docs** before it is shown): room availability, current meeting, calendar view, quick booking (15/30 minutes), Google Calendar integration, administration, IT support, PostgreSQL, Render hosting, Android tablet deployment, authentication, multi-company architecture, settings. Some functionality belongs to different development versions.

## 1. Inspect and classify (report in Georgian)

Locate the MeeTab demo and project source (this repo, another repo, or a hosted app); how it is embedded; origins; framework; API surface; auth model; data model (as visible in code/migrations, without exposing credentials); calendar integration code; deployment config; environments; tests; docs. Build the **Claims Ledger**: each capability/technology → evidence (file/commit/URL) → status `production | staging | verified-dev | prototype | planned`. Never present planned Microsoft Outlook/Office 365/Exchange integration as completed. Never invent performance, reliability, adoption or business numbers. Reconcile with earlier "About this app" explainer work if present.

## 2. Presentation adapter (same decision order as Tsero)

1. Editable demo → isolated `?presentation=1` module with deterministic commands.
2. Controllable cross-origin iframe → versioned, origin-allow-listed `postMessage` (`cs:hello`, `navigate`, `setState`, `setScroll`, `highlight`, `clearHighlights`, `openModal/closeModal`, `simulate{bookQuick15|bookQuick30|createSupportTicket}`, `reset`, `enter/exitPresentation`) — all idempotent, acknowledged, validated, seeded.
3. Otherwise deterministic recorded frames/video from the real demo via Playwright with seeded data, labelled "recorded from the live prototype".
Presentation mode must **stub every network side effect** (calendar writes, database writes, e-mail/support) and run on fake data; assert this in a test that fails if a real request leaves the page. The standalone demo stays independently reachable. Do not assume an arbitrary iframe can become a WebGL texture; use CSS3DRenderer/DOM overlay aligned to the 3D screen, pre-rendered frames or same-origin capture.

## 3. Storytelling timeline (`timeline.json`, deterministic `stateAt(p)`)

Chapters (adapt after inspection; drop what cannot be verified):
1. **The problem** — meeting-room availability, scheduling, room visibility, booking coordination. No fabricated research or results; use `designerIntent` text only if the owner confirmed it, otherwise label `visualInterpretation`.
2. **Product introduction** — the tablet in its physical environment; actual visual identity; purpose.
3. **Room availability** — main screen: room name, current meeting, time, availability status, room info, navigation, relevant settings; show available vs occupied states where implemented; explain why the hierarchy suits a wall-mounted meeting-room tablet.
4. **Calendar experience** — the app navigates itself to the calendar; upcoming meetings and schedule visibility; camera move emphasizes the transition.
5. **Quick booking** — 15- and 30-minute options where verified; simulated booking with seeded data; feedback, availability checks, confirmation.
6. **Administrative experience** — calendar registration, room configuration, administrator management, settings, access boundaries; no real credentials or admin data.
7. **IT support** — how the feature connects the physical room with technical assistance; no real support request.
8. **Design system** — brand identity, colour system, typography, layout grid, components, status indicators, navigation, interaction states, accessibility considerations; selected components emerge spatially from the tablet screen.
9. **Under the hood (strongest chapter)** — the tablet dissolves into a cinematic technical architecture: only **verified** nodes (e.g. tablet app, web client, API, authentication/authorization, calendar integration, PostgreSQL, hosting, admin services, IT-support integration) placed with intentional spatial logic, connections animated as a **verified request flow** (e.g. quick-booking: tablet → API → availability validation → calendar integration → storage → updated app state — use the real sequence found in code, not this example). Each node says *why it exists*. Show engineering relationships, not decorative glowing boxes. No sensitive infrastructure identifiers.
10. **Deployment & reliability** — verified Android deployment, web deployment, staging, infrastructure, testing, security practices, development workflow. No invented statistics.
11. **Final product** — restore the full tablet experience; action "Explore the interactive MeeTab demo".

Each chapter defines: id, title, description, progress range, camera pose/target, device pose/scale, active screen, app state, internal scroll, highlights, annotations, lighting, technical-visual state, transition. Backward scroll, fast scroll, direct chapter jump, resize, replay and exit all restore correct state.

## 4. Architecture visualization requirements

Data-driven from `architecture.json` (nodes, edges, flows, each with `evidence` + `status`). Nodes whose status is `planned` render in a visibly different style with a "planned" label or are omitted. Layout is hand-authored in 3D/2.5D space (depth = layer of the stack: client → API → services → data/hosting), camera orbit limited, labels never overlap, flow animation driven by `p` (reversible). Provide a text/table equivalent for screen readers and the reduced-motion stepper.

## 5. Motion language

Calm, precise, enterprise: measured easings, smooth camera moves, restrained highlights (ring/spotlight on the active UI element), internal tablet scroll synced to progress, holographic component emergence limited to chapter 8 and the architecture reveal. Do not copy Tsero's energetic choreography.

## 6. Quality requirements

Responsive (desktop/laptop/tablet/phone; portrait/landscape; mouse/touch/keyboard; sequential chapter cards or static stepper on small screens) · WCAG 2.2 AA target, semantic chapters with text equivalents, keyboard navigation, visible focus, reduced-motion stepper, non-WebGL alternative, Esc, focus restoration, chapters skippable · on-demand loading, DPR cap, adaptive quality, pause when hidden, dispose on exit, measured performance with conditions · origin validation, no credentials in assets/bundles (scan the build output for secret patterns and report).

## 7. Tests (Playwright, with evidence)

Entry/exit · each chapter reaches its intended screen/state · forward/backward/fast scroll · direct chapter jump · resize/orientation · internal scroll sync · demo reset · **network-isolation test (no real writes in presentation mode)** · reduced motion · mobile touch · keyboard-only · adapter failure fallback · architecture overlay overlap check · resource cleanup over 10 cycles · showroom regression vs baseline · standalone demo still works.

## 8. Output contract

Report in Georgian (Master §16 format, 20 points): real test statuses, measured performance with conditions, branch + commit SHA, rollback instructions, claims-ledger summary (production/staging/verified-dev/prototype/planned), security scan result, and only truly necessary owner actions. Update `docs/case-study/PROGRESS.md`. Keep `published:false` until all acceptance checks pass.
