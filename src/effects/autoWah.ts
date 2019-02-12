import BaseEffect from './BaseEffect'
import { AutoWah } from 'tone'
import { ParamsType, EffectType, ParamDefaultValueType } from '../types'

export const params: ParamsType = [
	{
		label: 'Base Frequency',
		path: 'baseFrequency',
		description: 'The frequency the filter is set to at the low point of the wah',
		defaultValue: 200,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		label: 'Octaves',
		path: 'octaves',
		description: 'The number of octaves above the baseFrequency',
		defaultValue: 2.6,
		min: 0,
		max: 10,
		step: 0.2,
	},
	{
		label: 'Sensitivity',
		path: 'sensitivity',
		description: 'The decibel threshold sensitivity for the incoming signal',
		defaultValue: 0,
		min: -40,
		max: 0,
		step: 0.5,
	},
]

export const defaultValue: ParamDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class AutoWahEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new AutoWah()
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Auto Wah',
	slug: 'autoWah',
	Effect: AutoWahEffect,
	Editor: () => null,
	defaultValue,
	params,
}

export default effect
