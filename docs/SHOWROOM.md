# Projects showroom v0.14

Production: https://giorgigiorgadze18.github.io/PortfolioWebsite/projects.html

The supplied v0.14 showroom is integrated directly into `projects.html`. The repository stays a static GitHub Pages site; no package installation or build service is required.

## Files and provenance

- `portfolio-3d-showroom-test-v14.zip`: the exact user-uploaded source archive, retained unchanged from upload commit `ad239da`.
- `projects.html`: Projects markup, same-site navigation, showroom, collection, and fallback artwork links.
- `showroom/showroom.js` and `showroom/showroom.css`: editable code extracted from the supplied index.
- `showroom/meetab-demo.html`: derived from the embedded `MEETAB_DEMO` document in the supplied index, with a portfolio touch bridge and responsive home/calendar/booking adapter added in v0.14.3. The unchanged original remains in the uploaded ZIP. It differs from the ZIP's separate demo HTML.
- `showroom/vendor/three.js` and its license: the supplied local 3D engine.
- `showroom/assets/`: local font files, font CSS, and font licenses.
- `assets/meetab-preview.jpg`: the original embedded MeeTab cover decoded without recompression.
- `showroom/SOURCE.json`: supplied MeeTab provenance. Upstream MeeTab was not changed.

Home, About, Contact, their assets, and their shared JavaScript are unchanged. Projects uses its own module to avoid duplicate event handlers.

## Integration decisions

Navigation uses relative `index.html`, `projects.html`, `about.html`, and `contact.html` links so GitHub Pages' `/PortfolioWebsite/` prefix is retained. The prototype's incorrect root-domain links and preview-only footer label were updated for production.

The four-device exhibition retains the supplied camera transitions, lighting, project inspectors, drag rotation, scene zoom, and state-preserving MeeTab preview. The original JBL campaign remains available as a fifth collection card; MeeTab is grouped under UI/UX. Original project artwork is served from the existing repository assets.

The 5 MB embedded app is moved into a separate sandboxed iframe document, keeping the initial Projects HTML about 9 KB. Three.js loads after checking WebGL support. Phones now start the same real 3D showroom when WebGL is available. At widths of 600 px or less, the camera fits the full exhibit, four project controls form a touch target grid, and project details use a bottom inspector. On phones, the app is loaded only after selecting MeeTab. A fallback collection is reserved for unavailable graphics or context loss; viewport width never disables 3D. The iframe remains the same instance across preview exit/reentry. State is retained during the current page visit, not promised across page reloads.

The iframe retains `sandbox="allow-scripts"`, no same-origin capability, a restrictive CSP, local sample data, and disabled account/backend operations. The parent accepts preview messages only from that iframe. Projects uses local artwork and fonts; no CDN fallback is needed. The iframe is a portfolio demonstration, not the production booking service.

The Try now / Exit preview control stays anchored while the camera animates, so repeated pointer activation remains reliable; iframe interaction updates immediately with the control state. Selecting a collection card scrolls the 3D exhibit into view. On phones, dragging rotates the selected device and two-finger gestures zoom the scene; a gallery swipe scrolls the page instead of accidentally opening an exhibit. Try now opens the same embedded tablet on touch devices. In this mode the model faces the camera and its projected screen determines the live app viewport. The Try now button waits for the embedded app to announce readiness before enabling interaction. Wheel zoom is limited to the showroom surface, leaving the inspector and the rest of the page scrollable. Closing the inspector restores keyboard focus to a project control. Reduced motion retains the supplied behavior. If WebGL is unavailable, project details still work; with scripting disabled, original artwork links remain visible.

## Run locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000/projects.html. Use HTTP rather than opening module files directly with `file://`.

## Verify

```sh
node --check showroom/showroom.js
python3 tests/showroom-browser.py http://localhost:8000/
# After merging: wait for Pages and verify the deployed source (requires gh)
python3 tests/check-deployment.py MERGE_COMMIT_SHA
# Then run the shorter desktop/mobile production check
python3 tests/showroom-browser.py https://giorgigiorgadze18.github.io/PortfolioWebsite/ --smoke
```

Browser checks require Python Playwright and `/usr/bin/chromium`. The script accepts a base URL, including a repository path prefix. It exercises desktop and tablet WebGL, project inspectors, filters, the retained JBL artwork, MeeTab booking navigation and iframe state, repeated preview toggles, reduced motion, gallery cleanup, mobile 3D, touch booking, bottom inspectors, pinch zoom, orientation changes, WebGL failure, and disabled JavaScript. It records fresh results and screenshots in `tests/artifacts/`.

The local preview used `/PortfolioWebsite/` to match production URL resolution. Phone checks are also available with `python3 tests/mobile_showroom.py --engine chromium` and `python3 tests/mobile_showroom.py --engine webkit` (requires Playwright WebKit and its system libraries; an optional `SHOWROOM_WEBKIT_EXECUTABLE` selects a custom test launcher). `--smoke` checks the representative 390 px phone; the full phone check covers 360, 390, 412, and 600 px.

Phone rendering uses capped 1.25× canvas resolution, 512 px artwork textures, standard materials, no real-time shadows or exhibit spotlights, and a 30 fps limit. Idle rendering pauses when the showroom is offscreen or the document is hidden. These are rendering limits, not a measured physical-device performance guarantee.

Screenshots are visual evidence; software WebGL and emulated touch do not establish performance on physical devices.

## Backup and restore

Original production/source commit: `9f9d437bc049b2277bc7ad697c7a69c37833f4b8`.

- Exact old source/history: https://github.com/GiorgiGiorgadze18/PortfolioWebsite/tree/backup/pre-showroom-2026-11-16
- Complete verified backup kit: https://github.com/GiorgiGiorgadze18/PortfolioWebsite/tree/backup/archive-pre-showroom-2026-11-16/backups/pre-showroom-2026-11-16

The backup includes all 39 tracked source files/assets, a byte-for-byte matching published snapshot, a source ZIP, a complete Git history bundle, checksums, a verifier, and restore instructions. Third-party Google Fonts hosting and Formspree backend services used by the old site are external services, outside this static-site backup.

For rollback without rewriting shared history, restore `projects.html` from the original commit in a new commit on `main`, then push and wait for the GitHub Pages build. The added showroom resources can remain inert during rollback; remove them in a reviewed follow-up if desired.

```sh
git restore --source=9f9d437bc049b2277bc7ad697c7a69c37833f4b8 -- projects.html
git add projects.html
git commit -m "Restore Projects page before showroom"
git push origin main
```

## Publish

GitHub Pages already deploys `main` from the repository root using its legacy build. Commit and push the exact tested source to the working branch, then integrate that commit into `main` and push. No hosting migration or new domain is needed. Verify the Pages build, fetch production assets, and rerun browser checks against the production URL. Do not force-push or change the backup refs.

## v0.14.4 — one neon sweep and embedded touch demo

Try now runs one pass around the projected body outline. The light goes out automatically. Reduced motion skips the sweep.

Touch mode aligns the tablet to the camera and sizes the iframe from the projected screen corners. The responsive MeeTab layout keeps touch scrolling and form controls within the tablet. While the tablet stays still, only a resize triggers another 3D draw. Exiting hides the iframe while retaining its state and restores scene gestures. Desktop keeps the perspective view.

Run `python3 tests/tablet_mobile.py --phone-only`, `python3 tests/tablet_mobile.py --desktop-only`, or `python3 tests/tablet_mobile.py --engine webkit --phone-only`. Each accepts an optional base URL. The tests check the sweep, projected bounds and native touch booking flow.

[Patch notes](../CHANGELOG.md) must be updated for every significant change; the repository workflow is recorded in `AGENTS.md`.
