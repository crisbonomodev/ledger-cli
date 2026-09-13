export class LedgerError extends Error {}

export class InvalidAmountError extends LedgerError {
    constructor(message: string) {
        super(message)
        this.name = 'InvalidAmountError'
    }
}

export class SameAccountError extends LedgerError {
    constructor(message: string) {
        super(message)
        this.name = 'SameAccountError'
    }
}

export class InsufficientFundsError extends LedgerError {
    constructor(message: string) {
        super(message)
        this.name = 'InsufficientFundsError'
    }
}

export class TransactionNotFoundError extends LedgerError {
    constructor(message: string) {
        super(message)
        this.name = 'TransactionNotFoundError'
    }
}
