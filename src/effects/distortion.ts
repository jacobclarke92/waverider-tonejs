import BaseEffect from './BaseEffect'
import { Distortion, OversamplingType } from 'tone'
import { EffectType, EffectDefaultValueType, ParamsType } from '../types'

export const params: ParamsType = [
	{
		label: 'Distortion',
		path: 'distortion',
		defaultValue: 0.4,
		min: 0,
		max: 1,
		step: 0.05,
	},
	{
		label: 'Oversample',
		path: 'oversample',
		defaultValue: 'none' as OversamplingType,
		options: ['none', '2x', '4x'] as OversamplingType[],
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class DistortionEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new Distortion()
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Distortion',
	slug: 'distortion',
	Effect: DistortionEffect,
	Editor: () => null,
	defaultValue,
	params,
}

export default effect
