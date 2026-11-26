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
