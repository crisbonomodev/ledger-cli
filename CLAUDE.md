# CLAUDE.md

You are working in a repository designed for long-running implementation work. Prioritize reliable completion, continuity across sessions, and explicit verification over speed.

## Operating Loop

At the start of every session:

1. Run `pwd` and confirm that you are in the expected repository root
2. Read `harness/claude-progress.md`
3. Read `harness/feature_list.json`
4. Review recent commits with `git log --oneline -5`
5. Run `./init.sh`
6. Run `npm run check && npm test` to confirm the baseline is green.

Then, select one unfinished feature and work only on that feature until you either verify it or document why it is blocked

## Rules

- One active feature at a time.
- Do not claim completion without runnable evidence.
- Do not rewrite the feature list to hide unfinished work.
- Do not remove or weaken tests just to make the task look complete.
- Use repository artifacts as the system of record.


## Required Files

- harness/feature_list.json
- harness/claude-progress.md
- init.sh
- session-handoff.md when a compact handoff is useful

## Completion Gate

A feature can move to passing only after the required verification succeeds and the result is recorded.

## Before You Stop
- Update the progress log.
- Update the feature state.
- Record what is still broken or unverified.
- Commit once the repository is safe to resume.
- Leave a clean restart path for the next session.

## Commands

```bash
npm install       # install deps
npm run check     # tsc --noEmit — type-check only, no output files
npm run build     # tsc — compiles src/ -> dist/
npm test          # vitest run — runs the full suite once
npm start         # node dist/index.js — runs the built CLI (run `build` first)
```

Run a single test file or case with vitest directly:

```bash
npx vitest run src/ledger.test.ts
npx vitest run -t "encuentra la primera"   # filter by test name
```

There is no lint script configured. Always run `npm run check && npm test` before considering a change done — that pairing is the project's own definition of "green" (see harness/claude-progress.md).

## Links

- ARCHITECTURE.md - Explains the project architecture.
