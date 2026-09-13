import { Ledger } from "./ledger";
import { TransactionType } from './types/types';
import { LedgerError } from './errors';

const [, , cmd, ...args] = process.argv
const ledger = new Ledger()

try {
    if (cmd === 'record') {
        const [account, type, amountStr, ...descParts] = args

        const record = ledger.record({
            date: new Date().toISOString().slice(0,10),
            account: account,
            type : type === TransactionType.CREDIT.toString() ?TransactionType.CREDIT : TransactionType.DEBIT,
            amount: Number(amountStr),
            description: descParts.join(' ')
        })
    } else if (cmd === 'balance') {
        console.log(`balance of ${args[0]}: ${ledger.balanceOf(args[0])}`)
    } else if (cmd === 'find') {
        const results = ledger.findByDate(args[0])

        if (results.length === 0) {
            console.log('No transactions for the specified date')
        }
        results.forEach((tx) => console.log(`#${tx.id} ${tx.account} ${tx.type} ${tx.amount} - ${tx.description}`))
    } else if (cmd === 'history') {
        const entries = ledger.history(args[0])

        if (entries.length === 0) {
            console.log('No transactions for the specified account')
        }
        entries.forEach(({ transaction, balance }) => console.log(`${transaction.date} #${transaction.id} ${transaction.type} ${transaction.amount} - ${transaction.description} | balance: ${balance}`))
    } else if (cmd === 'void') {
        const reversal = ledger.void(Number(args[0]))
        console.log(`#${reversal.id} voids #${reversal.voidsId} - ${reversal.account} ${reversal.type} ${reversal.amount}`)
    } else if (cmd === 'transfer') {
        const [source, destination, amountStr] = args
        const { debit, credit } = ledger.transfer(source, destination, Number(amountStr))
        console.log(`#${debit.id} ${debit.account} -> #${credit.id} ${credit.account} - ${debit.amount} (transferId ${debit.transferId})`)
    } else {
        console.log('Usage: record <account> <credit|debit> <amount> <desc> | balance <account> | find <date> | history <account> | void <id> | transfer <source> <destination> <amount>')
    }
} catch (error) {
    if (error instanceof LedgerError) {
        console.error(error.message)
        process.exitCode = 1
    } else {
        throw error
    }
}
