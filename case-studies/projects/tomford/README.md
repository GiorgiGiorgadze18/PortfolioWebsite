# Tom Ford composition study

Owner-supplied 2025 independent artwork, not an official campaign or brand affiliation. Intent and palette come from `docs/case-study/evidence/tomford/notes-TomFord.md`.

The five original PSD layers are Sand, Leaf, Grey Smoke, Tom Ford Fragrance and Grey Smoke2. Export uses full-canvas layer compositing, including the bottle DropShadow and foreground smoke opacity115. No generated or inferred hidden imagery. Lossless PNG masters retain1524×2784; lossless WebP planes are bounded by1200×1800. The original endpoint retains1524×2784. Old public project assets are unchanged.

Source checksums: `docs/case-study/evidence/tomford/validation.json`. Original PSD and loose PNGs remain in the owner's Drive and `/workspace/portfolio-work/case-study-sources/TomFord`; signed download URLs must never be committed. Derived masters are tracked here for restoration.

## Rebuild

From repository root, with Pillow, NumPy, psd-tools and scikit-image installed in an isolated tooling environment:

```sh
python3 tools/case-study/export_tomford.py /path/to/TomFord
npx --yes esbuild case-studies/shared/reference.mjs --bundle --format=esm --outfile=/tmp/jbl-reference-bundle.mjs
python3 tools/case-study/package_preview.py /tmp/TomFord-case-study-preview.html tomford
```

The standalone packager uses esbuild only as temporary development tooling. No site runtime dependency added. Master recomposition: mean difference0.1503806277/255, SSIM0.9992640880; this is near-identical, not exact pixel identity. Exact saved-original endpoint is displayed separately. These metrics are for PNG master recomposition, not an upscaled legacy thumbnail or resized WebP stack.

## Review

Serve the repository via HTTP. Open `case-studies/tomford-preview.html`, or `projects.html?view=3d&caseStudyPreview=1` → Graphic Design → Tom Ford → Explore case study. Grid entry uses `?view=grid&caseStudyPreview=1`. Default production entry remains disabled and `published:false` pending release approval.

Read `docs/case-study/TOMFORD_REPORT.md` for executed tests, known limits and rollback. Keep JBL project JSON untouched.
