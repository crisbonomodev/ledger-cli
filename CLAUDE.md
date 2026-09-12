# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A small TypeScript CLI implementing an append-only ledger (double-entry-style account balances.
Code favors explicit, from-scratch implementations over library helpers (e.g. a hand-rolled `LinkedList` instead of a plain array) — preserve that style when extending it.

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

There is no lint script configured. Always run `npm run check && npm test` before considering a change done — that pairing is the project's own definition of "green" (see PROGRESS.md).

## Architecture

**Data flow:** `src/index.ts` parses `process.argv` directly (no CLI framework) into three commands — `record`, `balance`, `find` — and delegates to `src/ledger.ts`. There is no in-memory session state: every `Ledger` method reads the on-disk JSON file fresh at the start and (for writes) rewrites it whole at the end. This is intentional, not an oversight — it guarantees the file is always the source of truth even if something else wrote to it between calls. Don't introduce caching without preserving that guarantee.

**Storage:** transactions persist as a flat JSON array in `./ledger.json` (path hardcoded as `FILE` in `ledger.ts`). Both `ledger.json` and `PROGRESS.md` are gitignored — they're local runtime/session state, not project source.

**Internal structures, and why:**
- `src/linkedList.ts` — `LinkedList<T>` (singly linked, tracks `head`/`tail`/`length`) is used instead of a plain array to load transactions in `Ledger.load()`. Only `append` (O(1) via the `tail` pointer) and full traversal (`toArray`) are needed — the ledger is append-only and never needs random access, so a linked list is the deliberate choice here, not an array-in-disguise.
- `src/binarySearch.ts` — `binarySearchFirst` implements the "leftmost occurrence" binary search variant (keeps searching left after a match instead of stopping), because `findByDate` in `ledger.ts` sorts transactions by date and multiple transactions can share the same date — a plain binary search would only guarantee finding *a* match, not the first one.
- `src/types/types.ts` — `Transaction` interface and `TransactionType` enum (`DEBIT`/`CREDIT`); `balanceOf` sums `+amount` for `CREDIT` and `-amount` for `DEBIT` per account into a `Map<string, number>`.

**CLI surface** (`src/index.ts`):
- `record <account> <credit|debit> <amount> <desc...>` — appends a transaction dated today.
- `balance <account>` — prints the net balance for an account.
- `find <date>` — prints all transactions on a given date (YYYY-MM-DD), using the binary-search path above.

## Project notes

- `tsconfig.json` compiles `src/` to `dist/` targeting `es2022`/`commonjs`, `strict` mode on, and excludes `**/*.test.ts` from the build.
- `PROGRESS.md` is a session/progress log the project keeps by convention (analogous to a `claude-progress.md` harness pattern) — check it for the current state and next-step plan before starting work, and keep it updated as you go.
