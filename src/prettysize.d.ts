declare module 'prettysize' {
	export = PrettySize
	function PrettySize(size: number, noSpace?: boolean, one?: boolean, places?: number, numOnly?: boolean): string
}
