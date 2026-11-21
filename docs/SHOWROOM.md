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
- `assets/meetab-preview.jpg`: the original embedded MeeTab cover used in the collection.
- `assets/meetab-desktop-home.webp`: a 1280×800 capture of the desktop MeeTab demo home screen, used as the tablet texture.
- `showroom/SOURCE.json`: supplied MeeTab provenance.
- `showroom/tsero/`: TseroApp's complete `web/` export at commit `3946431684af3553f575cdd7213be607db992b1e`, including font and map attribution. Run `showroom/tsero/index.html?start=home` inside a 375×811 viewport to see the reference layout.
- `assets/tsero-desktop-home.webp`: a capture of the Tsero web demo home screen at 375×811.
- `assets/project-tsero.jpg`: preserved original poster. The collection and View Original Artwork still use this file.

Home, About, Contact, their assets, and their shared JavaScript are unchanged. Projects uses its own module to avoid duplicate event handlers.

## Integration decisions

Navigation uses relative `index.html`, `projects.html`, `about.html`, and `contact.html` links so GitHub Pages' `/PortfolioWebsite/` prefix is retained. The prototype's incorrect root-domain links and preview-only footer label were updated for production.

The four-device exhibition retains the supplied camera transitions, lighting, project inspectors, drag rotation, scene zoom, and state-preserving MeeTab preview. The original JBL campaign remains available as a fifth collection card; MeeTab is grouped under UI/UX. Original project artwork is served from the existing repository assets.

The 5 MB embedded app is moved into a separate sandboxed iframe document, keeping the initial Projects HTML about 9 KB. Three.js loads after checking WebGL support. Phones now start the same real 3D showroom when WebGL is available. At widths of 600 px or less, the camera fits the full exhibit, four project controls form a touch target grid, and project details use a bottom inspector. Phones use the desktop home screenshot and skip loading the app. A fallback collection is reserved for unavailable graphics or context loss; viewport width never disables 3D. The iframe remains the same instance across preview exit/reentry. State is retained during the current page visit, not promised across page reloads.

The iframe retains `sandbox="allow-scripts"`, no same-origin capability, a restrictive CSP, local sample data, and disabled account/backend operations. The parent accepts preview messages only from that iframe. Projects uses local artwork and fonts; no CDN fallback is needed. The iframe is a portfolio demonstration, not the production booking service.

The Try now / Exit preview control stays anchored while the camera animates, so repeated pointer activation remains reliable; iframe interaction updates immediately with the control state. Selecting a collection card scrolls the 3D exhibit into view. On phones, dragging rotates the selected device and two-finger gestures zoom the scene; a gallery swipe scrolls the page instead of accidentally opening an exhibit. Try Now on touch devices opens the demo HUD and places the computer prompt over the static screen. The tablet faces the camera for legibility. On desktop, Try Now waits for the embedded app to announce readiness before enabling interaction. Wheel zoom is limited to the showroom surface, leaving the inspector and the rest of the page scrollable. Closing the inspector restores keyboard focus to a project control. Reduced motion retains the supplied behavior. If WebGL is unavailable, project details still work; with scripting disabled, original artwork links remain visible.

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

Browser checks require Python Playwright and `/usr/bin/chromium`. The script accepts a base URL, including a repository path prefix. It exercises desktop and tablet WebGL, project inspectors, filters, the retained JBL artwork, MeeTab booking navigation and iframe state, repeated preview toggles, reduced motion, gallery cleanup, mobile 3D, the desktop-only notice, bottom inspectors, orientation changes, WebGL failure, and disabled JavaScript. It records fresh results and screenshots in `tests/artifacts/`.

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

## v0.14.5 — static app previews on phones

MeeTab's still image comes from the desktop demo at its 1280×800 screen size. Try Now opens the existing HUD and renders a 55% black overlay and white message on the tablet screen in mobile and compact layouts. Portrait and landscape touch devices rely on the screenshot. Exit preview removes the overlay. The one-pass neon animation follows the outer body on entry. Desktop uses the live demo and retains its state between openings.

Use the same pattern for future integrated apps. See [repository instructions](../AGENTS.md). Run `python3 tests/tablet_mobile.py --phone-only` to test the mobile HUD, the overlay and the absence of an app iframe. The `--desktop-only` profile checks live booking navigation and the outer outline.

## v0.15.0 — Tsero in the 3D phone

The showroom uses the exported Tsero web app as published by the TseroApp repository. Only the web export was copied. The reference app starts on Home, with its status bar and navigation. Try Now mounts the app in the 3D phone on desktop. The frame stays alive between preview sessions, so the cart and demo order history survive closing the preview. Scroll inside the phone to browse. The embedded view uses Tsero's own content security policy and loads its modules and bundled map from GitHub Pages. The supplied demo simulates sign-in, payment and delivery locally.

Mobile follows the same screenshot and desktop notice policy as MeeTab. The original design poster stays in the collection and can be reused later. The published v0.14.6 build is preserved at `backup/pre-tsero-showroom-2026-11-22`.

Run `python3 tests/tsero_showroom.py --mode desktop` to check the demo ordering and MeeTab switching. Run `python3 tests/tsero_showroom.py --mode phone --engine webkit` for the mobile screenshot and portrait/landscape checks.

[Patch notes](../CHANGELOG.md) must be updated for every significant change; the repository workflow is recorded in `AGENTS.md`.
