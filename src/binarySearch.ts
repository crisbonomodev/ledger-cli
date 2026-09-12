export function binarySearchFirst(sorted: string[], target: string): number {
    let low = 0;
    let high = sorted.length - 1;
    let result = -1;

    while (low <= high) {
        const mid = Math.floor((low + high)/2)

        if (sorted[mid] === target) {
            result = mid
            high = mid - 1
        } else if (sorted[mid] < target) {
            low = mid + 1
        } else {
            high = mid -1
        }
    }
    return result
}