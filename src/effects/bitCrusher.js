import BaseEffect from './BaseEffect'
import { BitCrusher } from 'tone'

export class BitCrusherEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new BitCrusher()
		this.instance.connect(this.meter)
		callback()
	}
}

export const params = [
	{
		label: 'Bits',
		path: 'bits',
		description: 'The bit depth of the effect.',
		defaultValue: 4,
		min: 1,
		max: 8,
		step: 1,
	},
]

export const defaultValue = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export default {
	name: 'Bit Crusher',
	slug: 'bitCrusher',
	Effect: BitCrusherEffect,
	Editor: () => null,
	defaultValue,
	params,
}
