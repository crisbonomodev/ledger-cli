# Sprint Contract: ledger-002 — Void a transaction

## Scope

- Add `voidsId?: number` to the `Transaction` interface in `src/types/types.ts`.
  Present only on reversal entries; `undefined` on ordinary transactions.
- Add a way to look up a transaction by `id` within `Ledger` (private helper is
  fine — this lookup is part of this feature's scope, not a separate one).
- Add `Ledger.void(id: number): Transaction` — appends a new transaction that
  reverses the original: same `account`, same `amount`, flipped `type`
  (CREDIT↔DEBIT), `voidsId: id`, dated today. The original transaction is
  never modified or removed (append-only — see CONVENTIONS.md once it exists).
- Wire `void <id>` into the `src/index.ts` CLI command switch.

## Data Shape (decided up front — do not rename or restructure without updating this file)

```ts
interface Transaction {
  id: number
  date: string
  account: string
  type: TransactionType
  amount: number
  description: string
  voidsId?: number   // present only on reversal entries; points back to the original id
}
```

## Verification Standards

- `npm run check && npm test` passes.
- New test: voiding a transaction appends a reversal with flipped type, same
  amount, and `voidsId` equal to the original id.
- New test: after voiding, `balanceOf(account)` returns to its pre-original-transaction value.
- New test: the original transaction still appears unchanged in `history(account)`.
- Manual CLI check: `void <id>` on a real `ledger.json`, confirm balance and
  history reflect the reversal.

## Exclusions (explicitly out of scope for this sprint)

- Behavior when `id` does not exist — undefined, not required, not tested.
- Preventing or detecting double-voiding the same transaction — undefined, not
  required, not tested.
- These may become their own feature later; do not add speculative handling
  for them now.
