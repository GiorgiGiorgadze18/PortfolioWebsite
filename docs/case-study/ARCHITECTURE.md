# Architecture audit and proposal
## Existing implementation
Static HTML/CSS/vanilla ES modules; no package manifest or framework build required. `tools/sync-projects.mjs` maintains static project data; `tools/build_styles.py` builds Home styles. GitHub Pages deployment is platform-managed: no repository .github/workflows files were found.
`data/projects.mjs` is the canonical project catalogue. Three.js r180 is vendored at `showroom/vendor/three.js`. `showroom/showroom.js` owns two WebGLRenderers (gallery/focus), PerspectiveCamera 42°, procedural models/materials, shelf assembly with apps/graphics groups rotated 180°, project spots and floor/contact shadows. Gallery DPR cap 1.4, focus cap 1.65; mobile shadow reduction. render() skips work when hidden/offscreen/grid/static mobile preview, but schedules its rAF callback continuously. Existing focus/open/close tween and wheel handlers must be preserved.
Graphics are `device:poster` mounted panels/boards built by deviceFactory, not app tablets. `displayItems` records group, screen mesh, dimensions, home transforms. No explain.html, explain-app.html or explainer data found in tracked working tree (inventory.json).
MeeTab is a local single-file HTML demo, sandbox allow-scripts (opaque origin), existing ready/gesture messaging; provenance in showroom/SOURCE.json. Tsero is local same-origin HTML/CSS/JS modules plus catalogue, bundled maps, images and licensed fonts. Both use DOM portals; arbitrary iframe-to-WebGL capture is not assumed.
## Proposed boundaries, not implemented
DisplaySurface wraps screen mesh/dimensions/world matrix and home transforms for both deviceScreen and artworkBoard. A board lifts toward camera; reconstructed background stays on board. Keep IDs jbl-artwork (graphic) and meetab (public slug) distinct from legacy jbl (MeeTab internal ID).
Shared engine: lifecycle/disposer, pure timeline stateAt(p), camera rig, native-scroll ProgressSource with critically damped spring, layer stage, DOM/SVG annotations, quality manager, semantic A11yShell/Stepper. Lazy per-project data/assets. caseStudies.enabled=false and published=false until tested and approved.
Adapters are isolated presentation modules in local demo exports, not upstream product changes. Review opaque-origin protocol separately; recorded-frame fallback if secure control cannot be guaranteed. Architecture claims require source proof beyond a demo README.

## Gate1 checkpoint
Implemented showroom-bridge and surface-transition provide real board/camera entry and exit, driven by existing rAF. State snapshots include position/rotation/scale and camera pose/zoom. Active dialogue pauses parent drawing. The layer stage uses CSS3D, own semantic chapters and spring-smoothed native scroll. Per-project keyframes/offsets/annotation targets live in presentation.json.

## Live scene / Grid integration
Implemented live-surface variant: lazy webgl-layers builds six MeshBasicMaterial alpha planes attached to selected display; JSON state controls device quaternion and per-plane local offsets. Existing render loop refreshes only when dirty. Projection view offset centers the visual stage and is restored with FOV/aspect/camera pose. Grid uses isolated CSS3D without initializing WebGL. Shared chapters/progress with validated same-origin bridge; actual projected anchors feed SVG overlay.

## Tom Ford extension — 2026-11-27
Registry defines project title/shortTitle/preview; entry routes selected project to the same shared shell. Optional layerWindows provides deterministic staggered separation, falling back to existing state.spread for projects without it. Grid and WebGL both use this function. Source canvas ratio controls CSS board and fitted WebGL geometry. Optional original image plane supplies exact owner-composite endpoints and is disposed with its textures/material. Original showroom renderer and lifecycle remain shared. No framework or runtime dependency added.

## Button-driven graphic progress2026-11-27
reference.mjs now imports createButtonProgress rather than observeProgress. seek updates a target; the existing exact spring advances pure timeline progress on one owned on-demand rAF, retaining velocity during interrupted/reverse transitions. It stops at rest, pauses hidden, refreshes on resize and disposes listeners/frames. Selected chapter and aria-current update directly from buttons rather than intermediate animation frames. Native page reading scroll remains available outside the embedded interactive stage and for static fallback, but never selects chapters. A reusable case-action component exposes artwork accent through --action-accent. This owner request supersedes the earlier graphic pinned-scroll proposal; app architecture is not changed.

## Earth2026-11-27
Earth adds only registry/data/assets/preview and scoped leader colors. Existing engine/adapter handles4planes without changes. Character-first windows differ from Tom Ford; panel45, shadow135, character250 source-pixel depth offsets.

## Holographic frames2026-11-27
Manifest frame config feeds shared resolveFrame. DOM uses one decorative Canvas2D sheet per existing plane, alpha-mask composition and resize-only rasterization. WebGL uses one shared ShaderMaterial and padded quad geometry per presentation; onBeforeRender swaps the existing layer alpha map, no new grid textures. Derivative-based grid/border, short-side edge normalization, phone density/bloom settings. Existing timeline spread drives opacity; all poses remain unchanged.
