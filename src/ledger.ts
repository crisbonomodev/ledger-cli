import * as fs from 'node:fs';
import { LinkedList } from "./linkedList";
import { Transaction, TransactionType } from './types/types';
import { binarySearchFirst } from './binarySearch';




const FILE = './ledger.json'

export class Ledger {
    private load(): LinkedList<Transaction> {
        const list = new LinkedList<Transaction>()

        const raw: Transaction[] = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE,'utf8')) : []
        raw.forEach((t) => {
            list.append(t)
        });
        return list
    }

    private save(list: LinkedList<Transaction>): void {
        fs.writeFileSync(FILE, JSON.stringify(list.toArray(),null,2))
    }

    record(tx: Omit<Transaction, 'id'>) {
        const list = this.load()
        const full : Transaction = {id: list.size() + 1, ...tx}
        list.append(full)
        this.save(list);
        return full
    }

    balanceOf(account: string) : number {
        const transactions = this.load().toArray()
        const balances = new Map<string, number>()

        for (const tx of transactions) {
            const current = balances.get(tx.account) ?? 0
            const delta = tx.type === TransactionType.CREDIT ? tx.amount : -tx.amount
            balances.set(tx.account, current + delta)
        }

        return balances.get(account) ?? 0
    }

    history(account: string): { transaction: Transaction, balance: number }[] {
        const transactions = this.load().toArray()
            .filter((tx) => tx.account === account)
            .sort((a, b) => a.date.localeCompare(b.date))

        let balance = 0
        return transactions.map((transaction) => {
            balance += transaction.type === TransactionType.CREDIT ? transaction.amount : -transaction.amount
            return { transaction, balance }
        })
    }

    private findById(id: number): Transaction | undefined {
        return this.load().toArray().find((tx) => tx.id === id)
    }

    void(id: number): Transaction {
        const original = this.findById(id)!
        return this.record({
            date: new Date().toISOString().slice(0, 10),
            account: original.account,
            type: original.type === TransactionType.CREDIT ? TransactionType.DEBIT : TransactionType.CREDIT,
            amount: original.amount,
            description: `Void of #${original.id}: ${original.description}`,
            voidsId: original.id,
        })
    }

    findByDate(date: string): Transaction[] {
        const sorted = [...this.load().toArray()].sort((a,b) => a.date.localeCompare(b.date))
        const dates = sorted.map((t)=> t.date)
        const startIndex = binarySearchFirst(dates,date)
        if (startIndex === -1) return []
        
        const results: Transaction[] = []
        let i = startIndex
        while (i < dates.length && dates[i] === date) {
            results.push(sorted[i])
            i++
        }
        return results
    }
}