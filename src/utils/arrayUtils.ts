export function generateArray(len: number): number[]
export function generateArray<T>(len: number, mapper?: (i:number) => T): T[] {
    const arr = []
    for(let i=0; i<len; i ++) {
        arr[i] = mapper ? mapper(i) : i
    }
    return arr
}