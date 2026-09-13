export interface Transaction {
    id: number,
    date: string,
    account: string,
    type: TransactionType,
    amount: number,
    description: string,
    voidsId?: number,
    transferId?: number,
}

export interface TransferResult {
    debit: Transaction,
    credit: Transaction,
}

export enum TransactionType {
    DEBIT,
    CREDIT,
}