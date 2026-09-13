# Clean State Checklist

Run this as the last step before ending any session (implementer, evaluator,
or you working by hand). Order matters — commit first, then run this, so the
progress log check reflects reality instead of a plan.

- [ ] `./init.sh` still completes end to end (`rm -rf dist && ./init.sh` if build output changed).
- [ ] `npm run check && npm test` passes.
- [ ] `harness/feature_list.json` status reflects what's actually verified — not what's in progress or hoped for.
- [ ] `harness/claude-progress.md` is updated for this session, **and its "Commits" field lists the real commit hash(es) — checked after committing, not before.**
- [ ] No stray debug files, `console.log`s, or commented-out code left in `src/`.
- [ ] The next session could run `./init.sh` right now and continue without asking you anything.
