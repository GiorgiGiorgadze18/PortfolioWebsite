# TECHNICAL SPECIFICATION — Case Study System (practical, not over-engineered)

## 1. Architecture

```
Showroom (existing)
  └─ CaseStudyEngine ── open(slug) / close() / goToChapter(id) / replay()
        ├─ ProgressSource   native scroll in a pinned (position:sticky) container → spring-smoothed p∈[0,1]; programmatic seek
        ├─ Timeline         stateAt(p) → pure function from JSON keyframes
        ├─ CameraRig        applies camera pose from state
        ├─ DisplaySurface   device screen OR paper board (same API)
        ├─ LayerStage       Type A: textured planes from manifest
        ├─ AppAdapter       Type B: drives the demo (module | postMessage | recorded frames)
        ├─ ScreenRenderer   CSS3D/DOM overlay | frame textures | same-origin canvas
        ├─ AnnotationLayer  DOM/SVG overlay, projected anchors, label placement
        ├─ A11yShell        semantic parallel content, Stepper mode, focus management
        └─ QualityManager   DPR cap, adaptive quality, visibility pause, context-loss handling, Disposer
```
Rule: **UI state = `stateAt(p)`**. Nothing else mutates the scene during a case study.

## 2. Execution dependency graph

```
audit ─▶ capability probe ─▶ source inventory ─▶ artwork analysis ─▶ extraction ─▶ background reconstruction ─▶ asset validation ─┐
   └─▶ shared engine ───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
                                                                                         JBL reference ◀──────────────────────────┘
JBL reference ─▶ framework review (Gate 1) ─▶ Tom Ford, Earth Hour (Gate 2)
engine ─▶ Tsero adapter ─▶ Tsero case study ─┐
engine ─▶ MeeTab adapter ─▶ MeeTab case study ┴▶ (Gate 3) ─▶ integration ─▶ perf/a11y/security/cross-browser ─▶ final review (Gate 4)
```

## 3. Asset processing pipeline

source choice → analysis → meaningful-layer selection (4–7) → coarse masks → edge refinement + colour decontamination → background reconstruction (masked, feathered, outside-mask pixels bit-identical) → shadow/reflection separation → occlusion decision → export (RGBA PNG masters, WebP web, masks, depth) → manifest → recomposition validation → contact sheet review → register in `ASSET_MANIFEST.json` → `published:false` until validated.

## 4. Example asset manifest

```json
{
  "project": "jbl",
  "type": "graphic-exploded",
  "source": { "file": "artwork/jbl-original.png", "sha256": "…", "width": 2400, "height": 3000, "layered": false },
  "canvas": { "width": 2400, "height": 3000 },
  "layers": [
    {
      "id": "background",
      "displayName": "Reconstructed environment",
      "file": "web/01-background-reconstructed.webp",
      "master": "masters/01-background-reconstructed.png",
      "bbox": [0, 0, 2400, 3000],
      "normalized": { "x": 0, "y": 0, "w": 1, "h": 1 },
      "rotation": 0, "stackOrder": 0, "pivot": [0.5, 0.5],
      "representation": "plane",
      "suggestedDepth": 0, "suggestedExplodedOffset": [0, 0, 0],
      "rotationLimits": { "yaw": 0, "pitch": 0 },
      "annotationAnchor": [0.12, 0.2],
      "reconstruction": { "status": "partly-reconstructed", "maskRef": "masks/background-hole.png", "method": "inpaint-crop+feather" },
      "validation": { "alpha": "PASS", "alignment": "PASS", "halo": "NOT RUN" }
    },
    {
      "id": "hero-product",
      "displayName": "Headphones",
      "file": "web/02-hero-product.webp",
      "master": "masters/02-hero-product.png",
      "bbox": [610, 840, 1180, 1320],
      "normalized": { "x": 0.254, "y": 0.28, "w": 0.492, "h": 0.44 },
      "rotation": 0, "stackOrder": 2, "pivot": [0.5, 0.55],
      "representation": "parallax",
      "suggestedDepth": 0.6, "suggestedExplodedOffset": [0, 0.05, 0.9],
      "rotationLimits": { "yaw": 12, "pitch": 6 },
      "annotationAnchor": [0.62, 0.38],
      "reconstruction": { "status": "original" },
      "validation": { "alpha": "PASS", "alignment": "PASS", "halo": "PASS" }
    }
  ],
  "recomposition": { "meanAbsDiff": 0.62, "ssimOutsideReconstructed": 0.9971, "status": "PASS" }
}
```
(All numbers illustrative; real values must be measured.)

## 5. Example chapter timeline

```json
{
  "project": "jbl",
  "chapters": [
    { "id": "original", "title": "The finished artwork", "range": [0.00, 0.10],
      "camera": { "pos": [0, 0, 3.2], "target": [0, 0, 0], "fov": 35 },
      "surface": { "rot": [0, 0, 0], "pos": [0, 0, 0] },
      "layers": { "hero-product": { "offset": [0,0,0], "opacity": 1 } },
      "annotations": [], "ease": "inOutCubic" },
    { "id": "separation", "title": "The hero leaves the frame", "range": [0.10, 0.45],
      "camera": { "pos": [1.1, 0.6, 3.6], "target": [0, 0.1, 0.2], "fov": 35 },
      "surface": { "rot": [-0.45, 0.2, 0], "pos": [0, -0.2, -0.2] },
      "layers": { "hero-product": { "offset": [0,0.05,0.9], "opacity": 1, "effect": { "rim": 0.6 } } },
      "annotations": ["hero-focus"], "ease": "outCubic" }
  ]
}
```
`stateAt(p)` finds the active chapter, interpolates between neighbouring keyframes with the named easing, and returns a complete state object — never a delta.

## 6. Example annotation configuration

```json
{
  "id": "hero-focus",
  "anchor": { "type": "layer", "layerId": "hero-product", "point": [0.62, 0.38] },
  "label": "Hero product",
  "rationale": "Highest contrast and central placement make the headphones the first read.",
  "source": "visualInterpretation",
  "side": "right",
  "showFrom": 0.14, "showTo": 0.44
}
```

## 7. Presentation adapter interface

```ts
type Ack = { id: string; ok: boolean; error?: string; stateId?: string };
interface PresentationAdapter {
  hello(): Promise<{ version: 1; screens: string[]; capabilities: string[] }>;
  navigate(screen: string): Promise<Ack>;
  setState(stateId: string): Promise<Ack>;          // seeded, deterministic demo states
  setScroll(progress: number): Promise<Ack>;        // internal screen scroll 0..1
  highlight(target: string): Promise<Ack>;          // stable data-presentation-id, not CSS guesses
  clearHighlights(): Promise<Ack>;
  openModal(id: string): Promise<Ack>; closeModal(): Promise<Ack>;
  simulate(action: 'bookQuick15' | 'bookQuick30' | 'addToCart' | 'checkoutDemo'): Promise<Ack>;
  reset(): Promise<Ack>;
  enterPresentation(): Promise<Ack>; exitPresentation(): Promise<Ack>;
}
```
`postMessage` envelope: `{ source: "cs", v: 1, id, type, payload }`, origin allow-list on both sides, schema validation, ack with the same `id`, 500 ms-order-independent (idempotent: re-sending the same command yields the same state). Presentation mode blocks every network side effect.

## 8. Image ↔ normalized ↔ world coordinates

```
u = x / W,  v = 1 − y / H                        (image px → normalized, v up)
local.x = (u − 0.5) · surfaceW
local.y = (v − 0.5) · surfaceH
world   = surface.matrixWorld · (local.x, local.y, z_layer)
```
`surfaceW/H` come from the display surface (device screen mesh or board), not from the viewport, so resize cannot shift layers. Layers with a bbox use `u,v` of the bbox centre and size `bboxW/W · surfaceW`. Annotation anchors store layer-relative normalized points and are projected each frame: `screen = project(world)`; keep a screen-space fallback for the stepper.

## 9. 2.5D vs true 3D decision

| Condition | Representation |
|---|---|
| Single viewpoint, flat artwork, need faithful pixels | plane / multi-plane parallax (default) |
| Single viewpoint, volumetric subject, small camera move | depthDisplacement with low amplitude |
| Simple geometric shapes (pedestal, slabs, frames) | extruded / procedural geometry textured from the artwork |
| Verified 3D model or multi-angle reference exists | model |
| Flat image + wish for 360° | not supported; limit rotation, never expose rear sides |
Choose per layer; record in the manifest.

## 10. Background reconstruction strategy

Mask = object + dilation (8–24 px) + contact shadow. Small simple area: Telea/NS inpaint or gradient continuation. Large/complex: authorized generative inpainting on a padded crop, composite back through a feathered mask, match grain, verify outside-mask pixels are identical. Shadows/reflections of the object become their own layers. Mark the region `reconstructed`. Hidden pixels are plausible, not factual.

## 11. Asset validation methodology

Alpha: mode RGBA, `min(alpha)=0`, `max(alpha)=255`, semi-transparent edge pixels exist, no checkerboard pattern (detect periodic alpha=255 tiles). Geometry: equal canvas size, bbox matches mask. Edge halo: compare luma in a 2-px ring outside the mask edge vs a 6-px ring inside; flag large offsets. Recomposition: composite over background; mean/max abs diff, SSIM outside reconstructed mask; produce a visual diff heatmap. Targets (not guarantees): mean abs diff ≤ 1/255 untouched, SSIM ≥ 0.995. Always include visual inspection (checkerboard contact sheet). Report `PASS/FAIL/NOT RUN`.

## 12. Camera orchestration

Camera pose = interpolation of chapter keyframes (position, target, fov) with named easings; rotation via slerp of look-at quaternions; progress smoothed by a critically damped spring (ω ≈ 8–12) so scrub feels weighty but responsive; chapter jumps animate `p` with the same spring rather than snapping; clamp pitch/yaw per project; recompute projection on resize; always derive from `p`, never accumulate.

## 13. Application synchronization

Chapters name screens and states, never coordinates. Adapter calls are triggered when the chapter's *target state changes* (diffed from `stateAt(p)`), debounced to the latest target; acks reconcile actual vs wanted state; if the adapter lags, the scene waits visually (screen shows last good frame) instead of tearing. Backward scroll sends the previous target state. Internal scroll uses `setScroll(localProgress)`.

## 14. Performance strategy

On-demand init per project · asset budgets (texture memory, file size) · WebP/AVIF where supported, responsive sizes · DPR ≤ 2 (≤ 1.5 mobile) · adaptive quality from frame-time EMA (drop bloom → shadows → DPR) · single rAF loop · pause on `visibilitychange` · `webglcontextlost/restored` handling · dispose geometries/materials/textures/listeners on exit · measure with documented conditions (browser, headless vs GPU, viewport, throttle); headless software-GL numbers are not representative.

## 15. Responsive strategy

Desktop/laptop: full 3D with side annotations. Tablet: reduced layer spacing, annotations in a side sheet. Phone: simplified scene, one chapter at a time, compact bottom panel, chapter dots; portrait/landscape pose sets; touch via native scroll only; very small/low-power: static layer cards or Stepper mode.

## 16. Accessibility strategy

Parallel semantic `<article>` per case study (heading, chapter sections, alt text per layer/annotation, text equivalents for architecture flows) · keyboard: Tab/Shift-Tab, Arrow chapter navigation, Esc exit, visible focus · focus trap-free, focus restoration to the trigger · `prefers-reduced-motion` → Stepper mode · no hover-only interaction · contrast checks · WebGL-independent content · automated scan (e.g. axe) reported as *automated only*, manual keyboard/screen-reader pass listed separately.

## 17. Security strategy

Origin allow-list + schema validation for `postMessage`; presentation mode isolates network side effects and uses seeded fake data; no credentials/tokens/hostnames in repo or bundles (scan build output); iframe `sandbox`/`allow` reviewed; strip EXIF/private metadata from assets; never expose private infrastructure identifiers in architecture visuals.

## 18. Integration risks

Demo apps hosted elsewhere and not editable → recorded-frame fallback · iframe cannot be a WebGL texture → CSS3D/overlay or frames · alpha fringes in WebGL (premultiplied alpha) · layer misalignment on resize · memory growth from repeated open/close · mobile GPU limits · scroll-pin quirks with ancestor `overflow` · conflicts with the showroom's own scroll/camera handlers · earlier explainer pages duplicating data · claims that outrun evidence.

## 19. Project onboarding procedure

1. Add originals (prefer layered). 2. Run the asset pipeline (or handoff) → validated `manifest.json`. 3. Author `timeline.json` and `annotations.json`. 4. For apps: implement/choose an adapter, build `architecture.json` and `CLAIMS_LEDGER` entries. 5. Add project entry to the showroom config (slug, surface, `published:false`). 6. Run the test suite; fix. 7. Owner review; flip `published:true`.

## 20. Recommended implementation sequence

Phase 0 audit → Phase 1 engine → JBL assets → JBL case study → review (Gate 1) → Tom Ford → Earth Hour (Gate 2) → Tsero → MeeTab (Gate 3) → integration → QA → final report (Gate 4). Keep the engine small; extend only when a second project needs it.
