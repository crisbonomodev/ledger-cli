import { Ledger } from "./ledger";
import { TransactionType } from './types/types';

const [, , cmd, ...args] = process.argv
const ledger = new Ledger()

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
} else {
    console.log('Usage: record <account> <credit|debit> <amount> <desc> | balance <account> | find <date>')
}