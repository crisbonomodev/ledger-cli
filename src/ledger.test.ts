import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import { Ledger } from './ledger';
import { TransactionType } from './types/types';

const FILE = './ledger.json';

describe('ledger-cli', () => {
  beforeEach(() => {
    if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
    
  });

  it('registra transacciones como log append-only y calcula balance', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 100, description: 'depósito inicial' }); 
    ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.DEBIT, amount: 30, description: 'compra' });
    expect(ledger.balanceOf('cash')).toBe(70);
  });

  it('mantiene balances separados por cuenta usando un hash map', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 50, description: 'a' });
    ledger.record({ date: '2026-01-01', account: 'revenue', type: TransactionType.CREDIT, amount: 200, description: 'b' });
    expect(ledger.balanceOf('cash')).toBe(50);
    expect(ledger.balanceOf('revenue')).toBe(200);
  });

  it('encuentra la primera y demás transacciones de una fecha con duplicados', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'x' });
    ledger.record({ date: '2026-01-03', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'y' });
    ledger.record({ date: '2026-01-02', account: 'cash', type: TransactionType.DEBIT, amount: 5, description: 'z' });
    const found = ledger.findByDate('2026-01-02');
    expect(found).toHaveLength(1);
    expect(found[0].description).toBe('z');
  });

  it('devuelve vacío si no hay transacciones en esa fecha', () => {
    const ledger = new Ledger()
    ledger.record({ date: '2026-01-01', account: 'cash', type: TransactionType.CREDIT, amount: 10, description: 'x' });
    expect(ledger.findByDate('2099-01-01')).toEqual([]);
  });
});