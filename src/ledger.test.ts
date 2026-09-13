import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import { Ledger } from './ledger';
import { TransactionType } from './types/types';

const FILE = './ledger.json';

describe('ledger-cli', () => {
  beforeEach(() => {
    if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
    
  });

  it('records transactions as an append-only log and computes balance', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'initial deposit' });
    ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.DEBIT, amount: 30, description: 'purchase' });
    expect(ledger.balanceOf('cash')).toBe(70);
  });

  it('keeps balances separated per account using a hash map', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 50, description: 'a' });
    ledger.record({ date: '2026-01-01', account: 'revenue', type: TransactionType.CREDIT, amount: 200, description: 'b' });
    expect(ledger.balanceOf('cash')).toBe(50);
    expect(ledger.balanceOf('revenue')).toBe(200);
  });

  it('finds the first and subsequent transactions for a date with duplicates', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'x' });
    ledger.record({ date: '2026-01-03', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'y' });
    ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.DEBIT, amount: 5, description: 'z' });
    const found = ledger.findByDate('2026-01-02');
    expect(found).toHaveLength(1);
    expect(found[0].description).toBe('z');
  });

  it('returns empty when there are no transactions on that date', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'x' });
    expect(ledger.findByDate('2099-01-01')).toEqual([]);
  });

  it('returns an account history in chronological order with a running balance', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-03', account: 'cash', type: TransactionType.DEBIT, amount: 20, description: 'third' });
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'first' });
    ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.CREDIT, amount: 50, description: 'second' });

    const history = ledger.history('cash');

    expect(history.map(h => h.transaction.description)).toEqual(['first', 'second', 'third']);
    expect(history.map(h => h.balance)).toEqual([100, 150, 130]);
  });

  it('excludes transactions belonging to other accounts', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'cash tx' });
    ledger.record({ date: '2026-01-01', account: 'savings', type: TransactionType.CREDIT, amount: 999, description: 'savings tx' });

    const history = ledger.history('cash');

    expect(history).toHaveLength(1);
    expect(history[0].transaction.description).toBe('cash tx');
  });

  it('voiding a transaction appends a reversal with flipped type, same amount, and voidsId equal to the original id', () => {
    const ledger = new Ledger()
    const original = ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'initial deposit' });

    const reversal = ledger.void(original.id);

    expect(reversal.account).toBe(original.account);
    expect(reversal.amount).toBe(original.amount);
    expect(reversal.type).toBe(TransactionType.DEBIT);
    expect(reversal.voidsId).toBe(original.id);
  });

  it('returns the balance to its pre-original-transaction value after voiding', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 50, description: 'unrelated' });
    const original = ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'to be voided' });

    expect(ledger.balanceOf('cash')).toBe(150);

    ledger.void(original.id);

    expect(ledger.balanceOf('cash')).toBe(50);
  });

  it('leaves the original transaction unchanged in history after voiding', () => {
    const ledger = new Ledger()
    const original = ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'initial deposit' });

    ledger.void(original.id);

    const history = ledger.history('cash');
    const originalEntry = history.find((h) => h.transaction.id === original.id);
    expect(originalEntry?.transaction).toEqual(original);
    expect(history).toHaveLength(2);
  });
});