import BaseEffect from './BaseEffect'
import { BitCrusher } from 'tone'
import { EffectType, ParamsType, EffectDefaultValueType } from '../types'

export const params: ParamsType = [
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

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class BitCrusherEffect extends BaseEffect {
	constructor(value = {}, dispatch, params) {
		super(value, dispatch, params)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new BitCrusher(defaultValue.effect.bits)
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Bit Crusher',
	slug: 'bitCrusher',
	Effect: BitCrusherEffect,
	Editor: null,
	defaultValue,
	params,
}

export default effect
