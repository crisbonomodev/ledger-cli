export interface Transaction {
    id: number,
    date: string,
    account: string,
    type: TransactionType,
    amount: number,
    description: string,
}

export enum TransactionType {
    DEBIT,
    CREDIT,
}