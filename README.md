# ledger-cli

A small TypeScript ledger CLI — but the CLI isn't really the point. This repo is a
live case study in **harness engineering**: giving AI coding agents a repository
they can operate in reliably, without a human re-explaining context every session.

## What's actually being demonstrated here

The ledger itself is intentionally minimal (record/balance/find/history/void/transfer
on an append-only structure). Every feature past the first one was implemented by
Claude Code subagents, dispatched by me, working from a governance layer built into
the repo instead of from chat context. That layer is the actual subject of this repo:

- **[`CLAUDE.md`](./CLAUDE.md)** — the agent's entry point: operating loop, rules,
  completion gate.
- **[`harness/feature_list.json`](./harness/feature_list.json)** — single source of
  truth for what's done, in progress, or blocked, with evidence required for every
  `passing` status — not just a self-report.
- **[`harness/sprint-contracts/`](./harness/sprint-contracts)** — a contract written
  *before* implementation for each feature, pinning down data shapes, scope, and
  explicit exclusions, so design decisions live in the repo instead of a chat that
  disappears.
- **[`.claude/agents/implementer.md`](./.claude/agents/implementer.md) /
  [`evaluator.md`](./.claude/agents/evaluator.md)** — separate roles with separate
  tool permissions: the implementer never marks work `passing` or commits; only the
  evaluator, working independently against
  **[`harness/evaluator-rubric.md`](./harness/evaluator-rubric.md)**, can accept a
  feature and close out the session.
- **[`harness/clean-state-checklist.md`](./harness/clean-state-checklist.md)** — a
  non-negotiable exit gate (build, tests, accurate progress log, no stray artifacts)
  the evaluator runs before any session is considered done — because passing tests
  isn't the same as a consistent repository.
- **Session handoff** — one feature (`ledger-004`) was deliberately split across two
  agent sessions with no shared chat context, to test whether a handoff file alone
  was enough for the second session to continue without redefining or drifting from
  what the first one built. It was. See
  **[`harness/claude-progress.md`](./harness/claude-progress.md)** for the full
  session-by-session log and evidence trail.

Full write-up: *(link to the post, once published)*

## The ledger itself

Records credit/debit transactions, computes running balances, and supports void
(reversal, never deletion) and atomic transfers between accounts. Built on a singly
linked list (append-only by design) and a map for balance lookups. See
[`ARCHITECTURE.md`](./ARCHITECTURE.md) for the internals and
[`CONVENTIONS.md`](./CONVENTIONS.md) for the coding rules the agents work under.

## Running it

```sh
npm install
npm run build
node dist/index.js record checking 1 500 "Paycheck"
node dist/index.js balance checking
```

```sh
npm run check   # type-check
npm test        # vitest
```
