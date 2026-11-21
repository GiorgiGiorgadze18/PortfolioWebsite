# Repository workflow

For every significant product, interaction, graphics, performance, or deployment change:

- Update `CHANGELOG.md` with the release/date, concrete behavior changed, and relevant validation. Add the actual pull-request link once created.
- Give the pull request a description of the problem, final behavior, verification, and material limits. Keep the changelog and PR consistent with the final implementation.
- Preserve existing backup refs. Verify the tested source is pushed before publishing through the existing GitHub Pages configuration.
- Record meaningful browser/rendering checks and distinguish emulation from physical-device testing; do not claim physical iPhone/Android validation from viewport emulation.
- Evidence-only follow-up commits may update the existing release entry rather than creating a new product release.

## Mobile policy for embedded apps

Apply this pattern to every app added to the Projects showroom. On touch-first devices and compact layouts, show a still screenshot of the app's actual desktop home screen on the 3D device. Turn Try Now into a preview that opens the project HUD and places a 55% black overlay with readable white text directly over that screen. Tell visitors to try the interactive demo on a computer. Load the live app only on desktop and leave the screenshot and notice inside the showroom. Test portrait and landscape and verify that a fresh mobile visit makes no request for the live app.
