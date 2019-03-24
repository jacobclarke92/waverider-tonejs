import BaseEffect from './BaseEffect'
import { AutoFilter } from 'tone'
import { ParamsType, EffectType, EffectDefaultValueType } from '../types'

export const params: ParamsType = [
	{
		label: 'Frequency',
		path: 'frequency',
		pathHasValue: true,
		description: 'The rate of the LFO',
		defaultValue: 1,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		label: 'Base Frequency',
		path: 'baseFrequency',
		description: 'The lower value of the LFOs oscillation',
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
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class AutoFilterEffect extends BaseEffect {
	constructor(value = {}, dispatch, params) {
		super(value, dispatch, params)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new AutoFilter()
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Auto Filter',
	slug: 'autoFilter',
	Effect: AutoFilterEffect,
	Editor: null,
	defaultValue,
	params,
}

export default effect
