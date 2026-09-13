# Session Handoff: ledger-004 (Session A -> Session B)

This file is a one-time bridge for a feature deliberately split across two
implementer dispatches. Session B should be able to continue from **only**
this file, `harness/sprint-contracts/ledger-004-validation-errors.md`, and
`harness/feature_list.json` -- not from any other memory of Session A's work.

## Status

Feature `ledger-004` is `in_progress`. Session A is done. Session B has not
started.

## What Session A built

- **`src/errors.ts`** (new file): the full error hierarchy required by the
  contract --
  - `LedgerError extends Error` (base class, not thrown directly)
  - `InvalidAmountError extends LedgerError`
  - `SameAccountError extends LedgerError`
  - `InsufficientFundsError extends LedgerError`
  - `TransactionNotFoundError extends LedgerError`

  Each subclass has a constructor that takes a `message: string`, calls
  `super(message)`, and sets `this.name` to its own class name (e.g.
  `this.name = 'InvalidAmountError'`). Use `instanceof` to distinguish error
  types -- there is no `code` field.

- **`Ledger.record()` amount guard** (`src/ledger.ts`): at the top of
  `record()`, before `this.load()` is called, throws
  `new InvalidAmountError(...)` if `tx.amount <= 0`. This proves the
  mechanism end-to-end: the guard runs before any load/save, so a rejected
  `record()` call never touches `ledger.json`.

- **Tests** (`src/ledger.test.ts`): two new tests, "rejects recording a
  transaction with a zero amount" and "rejects recording a transaction with
  a negative amount". Both assert `toThrow(InvalidAmountError)` and that
  `ledger.json` was never created (`fs.existsSync(FILE)` is `false`,
  relying on the existing `beforeEach` that deletes the file).

## What Session A explicitly did NOT touch

- `Ledger.transfer()` -- still has zero validation (same-account,
  zero/negative amount, insufficient funds all unguarded).
- `Ledger.void()` -- still uses `findById(id)!` (non-null assertion), which
  crashes with a raw `TypeError` on an unknown id.
- `src/index.ts` -- no try/catch around command dispatch yet. Calling
  `record` from the CLI with a bad amount will currently crash with an
  uncaught-exception stack trace (this is expected at this stage; the
  contract assigns the CLI try/catch to Session B).

## What Session B must do

Per the contract's Delivery Plan ("Session B"):

1. **`transfer(source, destination, amount)`** in `src/ledger.ts`, all three
   checks running *before* any `load()`/`save()` (a rejected transfer must
   not touch `ledger.json` at all):
   - `source === destination` -> throw `SameAccountError`.
   - `amount <= 0` -> throw `InvalidAmountError`.
   - `balanceOf(source) < amount` -> throw `InsufficientFundsError`.
2. **`void(id)`** in `src/ledger.ts`: replace the `findById(id)!` non-null
   assertion with an explicit check that throws `TransactionNotFoundError`
   when the transaction doesn't exist.
3. **`src/index.ts`**: wrap command dispatch in a try/catch. On a
   `LedgerError` (use `instanceof LedgerError` -- the base class -- to catch
   all four subclasses in one branch), print `error.message` and exit with a
   non-zero exit code (`process.exitCode = 1` or `process.exit(1)`) instead
   of letting the stack trace crash the CLI. Non-`LedgerError` exceptions
   should still crash normally -- do not add a catch-all.
4. Reuse the classes in `src/errors.ts` exactly as they are. Do not redesign
   them, rename them, or add a `code` field.
5. Follow TDD: write failing tests for each of the three `transfer()` checks
   and the one `void()` check before implementing (see the Verification
   Standards section of the contract for exactly what each test must assert,
   including the "ledger.json left completely unchanged" requirement for all
   three transfer rejection cases).
6. Write `harness/claude-progress.md` as normal for this session (the
   handoff file is not a replacement for the progress log). Leave the
   feature status as `in_progress` -- only the evaluator agent may move it to
   `passing`.
7. Delete this file (`harness/session-handoff.md`) is NOT your job to do
   manually one way or the other -- per `CLAUDE.md`, it is deleted once the
   feature it covers reaches `passing`, which happens after the evaluator's
   pass, not after Session B.

## Verified state as of end of Session A

- `npm run check && npm test`: tsc clean, 15/15 tests passing.
- `./init.sh` was run at the start of this session and completed cleanly
  (install, check+test, build) before any changes were made.
- Working tree has uncommitted changes: `src/errors.ts` (new),
  `src/ledger.ts` (record() guard), `src/ledger.test.ts` (2 new tests),
  `harness/feature_list.json` (ledger-004 status -> in_progress), this file.
- Per implementer role rules, Session A did not commit. The working tree is
  left as-is for Session B / the evaluator to build on.
