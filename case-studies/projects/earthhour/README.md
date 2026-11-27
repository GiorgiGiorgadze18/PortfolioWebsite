# Earth Hour composition study

Independent2025 poster study; intent, palette and font attribution are owner-confirmed in `docs/case-study/evidence/earth/notes-Earth.md`. The original editable Illustrator source is unavailable. The supplied generated AI differs visibly and is rejected as a fidelity source; its original is retained outside Git and its hash/preview are documented.

## Assets and limitations

`assets/project-earthhour.png` remains untouched. Four presentation planes: original background/lettering/clouds, green text panel, oval shadow, original-pixel character. Original lower typography is retained as image pixels; no font replacement or recreated lettering. The upper dome/gradient and occluded shadow are conventionally reconstructed. Character separation uses color seeds and a bounded ink-edge band; the finger tip hidden by the original EARTH lettering is not historically recovered. This is a limited-angle2.5D presentation, not recovered vector layers or a360-degree character.

The processing mask is conservative and includes the character separation, panel region and shadow. Its untouched region has measured mean pixel difference0/255; full image difference is1.1874979294/255 with SSIM .986795048 because reconstructed regions differ. Do not describe the whole stack as pixel-identical or as passing the full-image .995 target. Start/end use the actual original image; near-original endpoint crossfades conceal residual changes. Master PNGs use1797×2542 canvas; WebP copies bound1400×2000, lossless. Original endpoint retains full resolution.

## Rebuild

Python tooling: Pillow, NumPy, SciPy. No browser/runtime dependency added.

```sh
python3 tools/case-study/export_earth.py
npx --yes esbuild case-studies/shared/reference.mjs --bundle --format=esm --outfile=/tmp/jbl-reference-bundle.mjs
python3 tools/case-study/package_preview.py /tmp/Earth-case-study-preview.html earthhour
```

The exporter measures raw/untouched pixel differences; supplemental SSIM is recorded in evidence/earth/validation.json. Re-export does not recreate the rejected AI or modify the original. Review only: `case-studies/earthhour-preview.html` or Projects with `caseStudyPreview=1`; per-project published:false and global enabled:false.

Choreography: character emerges first, shadow follows below, panel follows beneath shadow. Pure project-specific data; existing shared Previous/Next and vertical dots, keyboard/touch/static fallback. See EARTH_REPORT.md for tests and rollback.
