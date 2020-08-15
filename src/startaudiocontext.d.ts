declare module 'startaudiocontext' {
	import { BaseContext } from 'tone'
	export = StartAudioContext

	function StartAudioContext<Context extends BaseAudioContext | BaseContext, Element extends HTMLElement>(
		context: Context,
		element?: Element | Element[] | string | string[],
		callback?: () => void
	): Promise<any>
}
