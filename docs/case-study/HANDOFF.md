> Update 2026-11-26: Gate 0 approved; Phase 1 started, Gate 1 pending. See PROGRESS.md for current attachment blocker. Earlier pending-Gate-0 wording below is historical.

# Resume
Read MASTER.md completely, then PLAN.md, PROGRESS.md, ARCHITECTURE.md, DECISIONS.md, QUESTIONS.md and TEST_REPORT.md.
Current branch: `feat/case-study-phase0-audit`; source baseline `7cd45c57d3177f015efccf42c9c1933b613dd46c`. Gate 0 is pending: do not start Phase 1 without explicit owner approval.
Before edits, git status must be clean; preserve backup/before-case-studies at c60d7cb2bdfb24cd26e0e01c531ddb8771da24ed. Create the next phase branch from the approved audit HEAD.
Evidence lives in evidence/. Original image hashes are in ASSET_MANIFEST.json. No extracted/validated layer assets exist yet. Do not interpret RGB/RGBA file mode as alpha-quality validation.
Rollback: this phase only adds audit docs/evidence and an AGENTS.md pointer; production source unchanged. Switching to main restores the pre-audit worktree. Do not reset other worktrees or remove backup refs.
