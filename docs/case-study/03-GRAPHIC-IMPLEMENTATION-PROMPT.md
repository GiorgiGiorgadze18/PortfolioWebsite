# GRAPHIC DESIGN IMPLEMENTATION PROMPT — Holographic Exploded Composition (ChatGPT Codex)

Standalone fallback. If `01-MASTER-ORCHESTRATOR.md` is present, its §2 rules, §3 protocol and §16 report format apply here too.

**Repo:** https://github.com/GiorgiGiorgadze18/PortfolioWebsite · **Reports and questions: Georgian. Code: English.**

## GROUND RULES (condensed)

Evidence over claims (`PASS/FAIL/NOT RUN/BLOCKED` only) · new branch from HEAD, `git status` first, no force-push, no merge/deploy without approval · never modify originals · no secrets in output/commits · preserve the existing showroom (baseline screenshots first, feature flag) · state is a pure function of scroll progress, no timeout choreography, no scroll hijacking · minimal dependencies (justify in `DECISIONS.md`) · accessibility, reduced motion and a non-WebGL path are required · unpublished until validated.

## SCOPE

Build the **GraphicExplodedCaseStudy** type on top of the existing showroom, first for **JBL** (reference), then Tom Ford and Earth Hour **only after the JBL implementation passes review**. Assets come from the asset pipeline (`02-UNIVERSAL-GRAPHIC-ASSET-PROMPT.md` or the Master's Module G). **Do not start animations with unvalidated assets.** If assets are missing, generate the handoff package and continue with engine work using placeholder layers marked `published:false`.

## 1. Repository inspection (report in Georgian before coding)

Renderer/library versions · scene graph · device models and materials · lighting/shadows/spotlight code · camera system · how a device is selected/focused · routing/deep links · scroll handling · post-processing availability (bloom etc.) · existing animation library · asset loading · build pipeline. **Reconcile with prior work:** the two-sided showroom wall (graphics may sit on paper art boards on the back wall instead of a device screen) and any `explain.html`/graphics-explainer data. Implement a **`DisplaySurface`** abstraction (device screen or paper board) so the same code path works for both; for a board, "device tilts back" becomes "board lifts toward camera".

## 2. Entry and exit

"Explore Case Study" action on the selected graphic work. Entering: remember the exact showroom state (camera pose, selected item, wall side, focus), animate the surface into the presentation position, lazy-load only this project's assets, mount the semantic content shell. Exiting (button, Esc, browser back): reverse transition, restore the remembered state exactly, dispose all resources, restore focus to the trigger.

## 3. Layer stage

- Load `manifest.json`; one textured plane per layer, positioned from normalized coordinates on the display surface (full-canvas aligned layers need no per-layer offsets). Coordinate conversion: image px → `u = x/W, v = 1 − y/H` → surface-local `(u−.5)*surfaceWidth, (v−.5)*surfaceHeight` → world via the surface's matrix. Derive size from the surface, never from the viewport, so resize cannot misalign layers.
- Alpha correctness: premultiplied-alpha textures or `premultiplyAlpha` consistent with the material; `depthWrite:false` for transparent planes, explicit `renderOrder` plus tiny z-separation for stacking; sRGB colour space; mipmaps + anisotropy; avoid bleeding fringes.
- Representation per layer from the manifest (`plane | parallax | depthDisplacement | extruded | model`). Prefer faithful 2.5D; limit rotation/parallax to the manifest's `rotationLimits`; never expose unsupported rear sides; never stretch assets.
- The reconstructed background layer stays on the surface the whole time.

## 4. Choreography (deterministic)

`timeline.json` defines chapters with progress ranges and keyframes; `stateAt(p)` returns camera pose, surface pose, per-layer offset/rotation/opacity/effect amount, annotation visibility. Progress comes from a pinned `position: sticky` section (native scroll) smoothed with a critically damped spring; chapter dots and keyboard seek programmatically. Required behavior: forward, backward, fast scroll, resize, direct jump, replay, exit — all restore the correct state; no accumulated transforms; no duplicate rAF loops.
Stages: original → surface moves/tilts → subtle activation → hero emerges, then supporting elements → exploded composition with clear hierarchy → annotations/rationale → design-system reveal where meaningful (extracted palette, type labelled `identified/likely` unless source confirms, grid, hierarchy, lighting direction) → recomposition → return/replay/next. **Each artwork gets its own choreography**; do not reuse JBL's pattern for the others. JBL sketch: tablet tilts back, headphones become the central object, pedestal drops, upper environment rises, reconstructed background remains, annotations appear, everything returns. Separate only elements that really exist.

## 5. Holographic look (controlled)

Rim/edge glow computed from alpha (shader samples neighbouring alpha) · restrained scan-reveal driven by a `uProgress` uniform · soft bloom (use existing post-processing; otherwise a cheap additive sprite) · subtle volumetric hint · contact shadows / ambient occlusion · screen emission on the surface · smooth camera motion. **Do not** make everything transparent blue, no neon sci-fi, no particle storms, no random floating rectangles, no heavy glitch. The original artwork remains the foundation.

## 6. Annotations

`annotations.json`: id, layerId or world/screen anchor, label, rationale, `source: designerIntent | visualInterpretation`, side preference. Render as DOM/SVG overlay: projected anchors, leader lines, simple label placement that avoids overlaps and unnecessary crossings, stable between frames, readable, adapting to camera and viewport. Rationale explains *why* (focal point, hierarchy, balance, material language, readability, lighting/contrast, colour identity, audience, marketing intent). Never invent the designer's reasoning; collect open questions in `QUESTIONS.md`.

## 7. Optional controls (unobtrusive)

Assemble/Explode slider, Replay, Previous/Next layer, Focus layer, Annotations toggle, Reset view.

## 8. Responsive, accessibility, performance

- Responsive: adapt camera distance, layer spacing, annotation layout, text size, controls and render quality; small screens use sequential layer explanations, compact panels, chapter navigation, simplified scene or static layer cards.
- Accessibility: WCAG 2.2 AA target; semantic `<article>` with a heading and a described step per layer (alt text for each layer image); keyboard navigation for chapters and controls; visible focus; reduced-motion = Stepper mode (static cards with the layer images, no pinning); non-WebGL fallback; Esc; focus restoration; no hover-only interaction.
- Performance: on-demand init; lazy assets; WebP + responsive sizes; DPR cap (≤2, ≤1.5 mobile); adaptive quality from frame-time EMA; pause when hidden; handle `webglcontextlost/restored`; dispose geometries/materials/textures and listeners on exit; measure (document conditions) before/after.

## 9. Tests (Playwright; capture screenshots/traces)

Entry/exit · chapter navigation · forward/backward/fast scroll · resize/orientation · alignment of recomposed layers vs original (screenshot diff at progress 0 and 1) · transparency artifacts · annotation overlap check · reduced motion · WebGL context loss · mobile touch · keyboard-only · resource cleanup across 10 open/close cycles · regression of the existing showroom vs baseline.

## 10. Output contract

After each stage reply in Georgian using the 20-point report format of the Master (§16), including real test statuses, measured performance with conditions, branch and commit SHA, rollback instructions, and only the owner actions that are truly necessary. Update `docs/case-study/PROGRESS.md`. **Stop after JBL for review** before extending to Tom Ford and Earth Hour.
