# Sprint Contract: ledger-004 — Validation errors across record/transfer/void

## Why this is split across two sessions

This feature is deliberately delivered in two implementer sessions instead of
one, to give `harness/session-handoff.md` a real job: Session A builds the
shared error mechanism and proves it on one flow, then stops and hands off.
Session B must be able to continue using **only** `harness/session-handoff.md`
(plus this contract and `harness/feature_list.json`) — not any other record of
what Session A did. If Session B has to guess or re-derive a design decision,
the handoff failed.

## Data Shape (decided up front)

New file `src/errors.ts`:

```ts
export class LedgerError extends Error {}

export class InvalidAmountError extends LedgerError {}
export class SameAccountError extends LedgerError {}
export class InsufficientFundsError extends LedgerError {}
export class TransactionNotFoundError extends LedgerError {}
```

Each subclass should set `this.name` to its own class name in its constructor
(standard practice so `error.name` isn't just `"Error"`). Distinguish error
types with `instanceof`, not a `code` string field.

## Scope (both sessions combined)

- `record(tx)`: reject `tx.amount <= 0` by throwing `InvalidAmountError`, checked
  before the existing load/save logic runs.
- `transfer(source, destination, amount)`:
  - `source === destination` → throw `SameAccountError`.
  - `amount <= 0` → throw `InvalidAmountError`.
  - `balanceOf(source) < amount` → throw `InsufficientFundsError`.
  - All three checks run before any `load()`/`save()` — a rejected transfer
    must not touch `ledger.json` at all.
- `void(id)`: replace the current `findById(id)!` non-null assertion (which
  crashes with a raw `TypeError` on an unknown id) with an explicit check that
  throws `TransactionNotFoundError` instead. This closes the exclusion left
  open in `ledger-002`'s contract.
- `src/index.ts`: wrap command dispatch in a try/catch; on a `LedgerError`,
  print `error.message` and exit with a non-zero code instead of letting a
  stack trace crash the CLI. Non-`LedgerError` exceptions may still crash
  normally — only `LedgerError` and its subclasses get the friendly path.

## Delivery plan

**Session A (implementer, first dispatch):**
- Create `src/errors.ts` with the full class hierarchy above.
- Implement and test **only** the `record()` amount guard, as the proof that
  the mechanism works end-to-end (class thrown, caught by the CLI, tests pass).
- Do **not** touch `transfer()` or `void()`.
- Do **not** write `harness/claude-progress.md` for this session. Instead,
  write `harness/session-handoff.md` covering: what's built (the error
  hierarchy + record's guard), what's explicitly left for the next session
  (transfer's 3 checks, void's not-found check, the CLI try/catch), and where
  to find the design decisions (this contract). Leave the feature `in_progress`.

**Session B (implementer, second dispatch, fresh context):**
- Start from `harness/session-handoff.md` — do not assume any other context
  about Session A's work.
- Implement the remaining scope: `transfer()`'s three checks, `void()`'s
  `TransactionNotFoundError`, and the CLI try/catch in `index.ts`.
- Reuse the classes from `src/errors.ts` as they are — do not redesign them.
- Write `harness/claude-progress.md` as normal (the handoff file is a one-time
  bridge between these two sessions, not a replacement for the progress log).
  Leave the feature `in_progress`.

**Evaluator (after Session B):** review both sessions' work together against
this whole contract — including whether Session B's code is actually
consistent with Session A's error classes (no drift, no redefinition).

## Verification Standards

- `npm run check && npm test` passes.
- New tests: `record()` throws `InvalidAmountError` for `amount === 0` and for
  a negative amount; the transaction is not written to `ledger.json`.
- New tests: `transfer()` throws `SameAccountError` when source equals
  destination; throws `InvalidAmountError` for a zero/negative amount; throws
  `InsufficientFundsError` when the source balance is less than the amount —
  and in all three cases, `ledger.json` is left completely unchanged (no
  partial write).
- New test: `void()` throws `TransactionNotFoundError` for an id that doesn't
  exist, instead of crashing with a raw `TypeError`.
- Manual CLI check: trigger each of the four error cases from the command
  line and confirm a readable message is printed instead of a stack trace.

## Exclusions (explicitly out of scope for this sprint)

- Any validation beyond the four cases listed above (e.g. non-numeric amount
  strings from the CLI, unknown account names) — not handled, not tested.
- Localizing or customizing error messages beyond a clear English sentence.
- These may become their own feature later; do not add speculative handling
  for them now.
