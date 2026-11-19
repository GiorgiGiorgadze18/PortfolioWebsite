# Repository workflow

For every significant product, interaction, graphics, performance, or deployment change:

- Update `CHANGELOG.md` with the release/date, concrete behavior changed, and relevant validation. Add the actual pull-request link once created.
- Give the pull request a description of the problem, final behavior, verification, and material limits. Keep the changelog and PR consistent with the final implementation.
- Preserve existing backup refs. Verify the tested source is pushed before publishing through the existing GitHub Pages configuration.
- Record meaningful browser/rendering checks and distinguish emulation from physical-device testing; do not claim physical iPhone/Android validation from viewport emulation.
- Evidence-only follow-up commits may update the existing release entry rather than creating a new product release.
