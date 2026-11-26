# Decisions — Phase 0
- Preserve the static stack and original application repositories; add no dependencies now.
- Use the existing mounted artwork board for JBL rather than replacing it with a tablet. This follows the current showroom; owner may choose a different creative direction at Gate 0.
- Use jbl-artwork as the graphic case-study slug. Preserve legacy MeeTab ID jbl and slug meetab.
- Prefer source layers; absent those, investigate deterministic mask/compositing after Gate 0. Do not run image generation or spend paid credits in Phase 0.
- Keep all public case studies unpublished until evidence and asset validation pass. No product feature or flag added during audit.
- Read-only browser baseline uses local exact tracked production source. Public HTTPS reachability is measured separately. Software-rAF cadence is not real GPU FPS.

- 2026-11-26: Group 32 source PNGs into7 meaningful candidate layers, preserving glass between rear/front headphone portions. Reject candidate recomposition for animation until fidelity resolved. No image generation needed/invoked so far. py7zr used only as temporary extraction tooling, not a site dependency.

- Reference rendering uses actual CSS3D planes, not Three.js scene mutation, to isolate the review from the expensive existing renderers. This does not yet satisfy the final in-scene camera choreography.
- Source Screen/Overlay/Color Dodge looks are baked at assembly; separated surfaces retain that appearance. Original source pixels unchanged. Original full image crossfade at endpoints handles residual glow differences. Manifest validated means mean-fidelity gate only, NOT complete public approval; published stays false.
- Entry is review-only behind caseStudyPreview=1, uses an iframe dialog with checked same-origin/source close messages. Parent camera/selection remain untouched; render work paused during preview.

## Gate1 checkpoint
Physical showroom transitions run inside the original render loop, with a pose snapshot and no accumulated transforms. The isolated CSS3D layer renderer remains the review representation. New project choreography and annotations come from JSON. Gate1 is a reference review, not final release certification.

Standalone delivery is a generated13.97MB HTML with embedded fonts/images/JSON and an esbuild ESM bundle. esbuild used via temporary npx tooling only, no runtime dependency. Rebuild: npx --yes esbuild case-studies/shared/reference.mjs --bundle --format=esm --outfile=/tmp/jbl-reference-bundle.mjs; then python3 tools/case-study/package_preview.py /desired/output.html.

Owner requested near-horizontal poster and45° upward layer rise. At70° X rotation, localY=localZ*tan25° produces equal-magnitude up/depth components before the small yaw. This is real CSS perspective projection of flat layers, not reconstructed volume. Project JSON separates recline from spread to ensure ordering.

## Owner-requested recline revision
Poster reclines70° before any separation; layer offsets yield45° upward rise before the slight yaw. CSS3D pose is applied to each plane directly with perspective on the board, avoiding nested image composition. Layers paint as individually decoded alpha backgrounds. Original start/end image and static/reduced-motion chapters preserved. Updated browser screenshots require visual review in addition to matrix checks; matrix checks alone do not certify actual compositing.

Owner found70° too flat; revised to48° with-6° screen-diagonal roll. Render pose now separates Z roll from Y yaw and X recline, applied consistently to all layers and original image. localY=localZ*tan3° retains45° rise before the slight yaw/roll.

Owner perceived bending in the multi-axis motion. Use a single constant rotation axis with eased angle and gentler perspective rather than independently interpolated Euler angles. This changes perceived projection/motion, not the source artwork. Same pose applies to all planes and original.

Leader handoffs crossfade two independently anchored paths across a0.07 progress band, using smoothstep driven by existing spring-smoothed scroll. This keeps source dots attached to real layers while avoiding teleports. Caption-side port stays at a fixed viewport-relative position to avoid jumps from heading reflow. Text micro-transitions use cancellable WAAPI, skipped/cancelled for reduced motion. Shadows are modest CSS alpha drop shadows, not a claim of physical lighting.

## Live scene / Grid integration
Owner supplied isometric reference; target orientation equivalent pitch60/yaw22/roll−10 encoded as a single axis-angle. Scene keeps original device model; only poster support visibility temporarily suppressed. Transparent HUD requires normal color-scheme on iframe root. Static/short view pauses rendering. Resource counts distinguish renderer bookkeeping from physical GPU RAM. No actual WebGL Safari/iPhone claim.

## Tom Ford — 2026-11-27
- Owner Drive folder and notes authorize Tom Ford completion now; Earth Hour deferred. Preserve all sources, use supplied PSD instead of reconstructing hidden pixels or spending generation credits.
- Export layer.composite with force=True and full viewport so PSD DropShadow and opacity115 survive. Raw-layer export failed fidelity; corrected output passes mean≤1/255 and SSIM≥.995. Retain original saved composite for endpoints.
- Keep JBL presentation bytes unchanged. A combined refactor was stopped by automatic review for JBL-regression risk; the accepted implementation writes Tom-only JSON and adds optional shared behavior. No blocked mutation was executed.
- Keep real showroom models; artwork fits original aspect within device screen. Dedicated gold accents are scoped to Tom Ford. Source PSD remains outside public Git delivery; lossless PNG masters and provenance hashes are versioned.
- User requested no intermediate stops. Complete tests/docs/commit on isolated branch; no production publication or unrelated phases inferred.
