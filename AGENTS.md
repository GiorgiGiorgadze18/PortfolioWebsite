# Repository workflow

For every significant product, interaction, graphics, performance, or deployment change:

- Update `CHANGELOG.md` with the release/date, concrete behavior changed, and relevant validation. Add the actual pull-request link once created.
- Give the pull request a description of the problem, final behavior, verification, and material limits. Keep the changelog and PR consistent with the final implementation.
- Preserve existing backup refs. Verify the tested source is pushed before publishing through the existing GitHub Pages configuration.
- Record meaningful browser/rendering checks and distinguish emulation from physical-device testing; do not claim physical iPhone/Android validation from viewport emulation.
- Evidence-only follow-up commits may update the existing release entry rather than creating a new product release.

## Mobile policy for embedded apps

Apply this pattern to every app added to the Projects showroom. On touch-first devices and compact layouts, show a still screenshot of the app's actual desktop home screen on the 3D device. Turn Try Now into a preview that opens the project HUD and places a 55% black overlay with readable white text directly over that screen. Tell visitors to try the interactive demo on a computer. Load the live app only on desktop and leave the screenshot and notice inside the showroom. Test portrait and landscape and verify that a fresh mobile visit makes no request for the live app.

## Case Study System

Read `docs/case-study/MASTER.md` before case-study work. Resume from `PROGRESS.md` and `HANDOFF.md`; use PLAN, ARCHITECTURE, DECISIONS, TEST_REPORT, ASSET_MANIFEST, CLAIMS_LEDGER and QUESTIONS in that directory. Respect review gates. Gate 0 was approved on 2026-11-26; the owner subsequently authorized JBL scene integration and, on 2026-11-27, completion of Tom Ford like JBL without intermediate stops. Tom Ford is the current Phase 4 scope; Earth Hour and application case studies remain outside that authorization. No merge or production deployment without explicit approval.

## Current graphic case-study navigation
Owner request2026-11-27 replaces scroll progression with Previous/Next and vertical project-colored dots for JBL/Tom Ford. This explicitly supersedes MASTER.md native-scroll wording for these graphic presentations. Keep the pure timeline and smooth reversible interpolation. Reusable button styling is prepared; a site-wide rollout and Earth Hour extraction are not part of this navigation task. Earth owner notes are pending.
