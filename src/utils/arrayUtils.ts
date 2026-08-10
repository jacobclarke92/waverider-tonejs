export function generateArray(len: number): number[]
export function generateArray<T>(len: number, mapper: (i: number) => T): T[]
export function generateArray<T>(len: number, mapper?: (i: number) => T): (number | T)[] {
	const arr: (number | T)[] = []
	for (let i = 0; i < len; i++) {
		arr[i] = mapper ? mapper(i) : i
	}
	return arr
}
