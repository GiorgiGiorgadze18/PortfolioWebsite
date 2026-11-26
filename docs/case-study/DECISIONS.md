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
