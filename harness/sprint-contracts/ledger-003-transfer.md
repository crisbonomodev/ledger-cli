# Sprint Contract: ledger-003 — Transfer between accounts

## Scope

- Add `transferId?: number` to the `Transaction` interface in `src/types/types.ts`.
  Present only on the two transactions created by a transfer; `undefined` on
  ordinary `record()`/`void()` transactions.
- Add `Ledger.transfer(source: string, destination: string, amount: number): TransferResult`.
  It must:
  - Perform exactly **one** `load()` and **one** `save()` for the whole operation
    — both the debit and the credit are appended to the same in-memory list
    before it is written once. Do not call `record()` twice (that would be two
    separate load/save cycles and reopen the atomicity problem this contract
    exists to close).
  - Create a debit transaction on `source` and a credit transaction on
    `destination`, same `amount`, both dated today.
  - The debit transaction gets the lower id (assigned first); the credit gets
    the next sequential id. Both carry `transferId` equal to the **debit's id**.
  - Never modify or remove any existing transaction (append-only, per
    CONVENTIONS.md).
- Add `TransferResult` to `src/types/types.ts`:
  ```ts
  interface TransferResult {
    debit: Transaction
    credit: Transaction
  }
  ```
  (Per CONVENTIONS.md: complex return types live in types.ts, not inline.)
- Wire `transfer <source> <destination> <amount>` into the `src/index.ts` CLI
  command switch.

## Verification Standards

- `npm run check && npm test` passes.
- New test: after `transfer('cash', 'savings', 50)`, `balanceOf('cash')` drops
  by 50 and `balanceOf('savings')` rises by 50.
- New test: the returned `TransferResult` has `debit.transferId === debit.id`
  and `credit.transferId === debit.id` (same shared value).
- New test: `ledger.json` on disk ends up with **both** the debit and credit
  entries after a single `transfer()` call — inspect the file, not just the
  in-memory return value, to confirm they were written together.
- New test: calling `transfer()` does not touch or reorder any transaction
  that existed before it.
- Manual CLI check: `transfer cash savings 50` against a real `ledger.json`,
  confirm both balances and `history` on each account reflect it.

## Exclusions (explicitly out of scope for this sprint)

- Process crashing mid-write at the OS/filesystem level (e.g. `writeFileSync`
  interrupted partway) — not handled, not tested. This contract only
  guarantees atomicity at the application-logic level (one `save()` call), not
  at the filesystem level.
- Transferring to the same account as the source — undefined, not tested.
- Zero or negative `amount` — undefined, not tested.
- Insufficient-funds checks (blocking a transfer that would take a balance
  negative) — undefined, not tested. `ledger-cli` currently allows any account
  to go negative; this sprint does not change that.
- These may become their own feature later; do not add speculative handling
  for them now.
