export class Node<T> {
    value: T;
    next: Node<T> | null = null;
    constructor(value: T) {
        this.value = value;
    }
}

export class LinkedList<T> {
    private head: Node<T> | null = null
    private tail: Node<T> | null = null
    private length = 0

    append(value: T): void {
        const node = new Node(value)
        if (!this.tail) { // Si tail no existe, es el primer nodo y tiene que ser head y tail a la vez
            this.head = node
            this.tail = node
        } else {
            this.tail.next = node // Actualizamos el tail actual para que apunte al nuevo
            this.tail = node // reescribimos tail
        }
        this.length++
    }

    toArray(): T[] {
        const result: T[] = []
        let current = this.head
        while (current) {
            result.push(current.value)
            current = current.next
        }
        return result
    }

    size(): number {
        return this.length
    }
}