declare module 'regression' {
	type Point = [number, number]
	interface RegressionResult {
		equation: number[]
		points: Point[]
		string: string
	}
	export default function(type: string, points: Point[], length: number): RegressionResult
}
