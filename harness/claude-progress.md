# Progress Log

<!--
This filename is kept for compatibility with the course examples. The file is
agent-agnostic: Codex, Claude Code, OpenHands, and other coding agents can use
it. Read it at session startup and update it before handoff through the
repository's agent instructions; no agent updates it automatically.
-->

This is a generic repository-local session progress log. The
`claude-progress.md` filename is a historical course convention, not a
Claude Code requirement. Any coding agent can use it when the repository's
instructions tell it to read the file at startup and update it before handoff;
agents do not update it automatically.

## Current Verified State

- Repository root: /Users/cbonomo/Code/ledger-cli
- Standard startup path: ./init.sh
- Standard verification path: npm run check && npm test
- Current highest-priority unfinished feature: ledger-001 (View an account's history)
- Current blocker: none

## Session Log

### Session 001

- Date: 2026-09-11
- Goal: Implement the base ledger (LinkedList, binary search, Ledger, CLI).
- Completed: LinkedList<T>, binarySearchFirst, Ledger (record/balanceOf/findByDate), index.ts with record/balance/find commands, vitest test suite.
- Verification run: npm run check && npm test
- Evidence captured: src/ledger.test.ts (4 tests passing)
- Commits: 5214bd8 feat: initial commit
- Files or artifacts updated: src/linkedList.ts, src/binarySearch.ts, src/ledger.ts, src/index.ts, src/ledger.test.ts, src/types/types.ts
- Known risk or unresolved issue: none blocking — the app is green.
- Next best step: set up the project's harness files (CLAUDE.md, init.sh, feature_list.json, claude-progress.md).

### Session 002

- Date: 2026-09-12
- Goal: Build the project's harness files by hand.
- Completed: CLAUDE.md (adapted to ledger-cli), init.sh (install → verify → clean build → start), harness/feature_list.json (3 new features: history, void, transfer).
- Verification run: npm run check && npm test (via init.sh); RUN_START_COMMAND=1 ./init.sh run end-to-end with dist/ removed to validate the real build.
- Evidence captured: init.sh ran end-to-end without errors after fixing the eval bug.
- Commits:
    - e0cb08c chore: basic CLAUDE.md file
    - 7ef78c1 refactor: rewrite claude.md for harness setup
    - bed7160 feat: add init.sh script
    - 50fdc57 feat: add feature_list.json file
    - 977b5b1 refactor: add claude-progress.md plus english translation
- Files or artifacts updated: CLAUDE.md, init.sh, harness/feature_list.json, harness/claude-progress.md
- Known risk or unresolved issue: transfer (ledger-003) will need a way to keep save() from leaving the file half-written on failure — not designed yet.
- Next best step: implement ledger-001 (history).
