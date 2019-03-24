import BaseEffect from './BaseEffect'
import { Chorus } from 'tone'
import { EffectType, EffectDefaultValueType, ParamsType } from '../types'
import { checkDifferenceAny, getDeepDiff } from '../utils/lifecycleUtils'
import _set from 'lodash/set'

export const params: ParamsType = [
	{
		label: 'Frequency',
		path: 'frequency',
		pathHasValue: true,
		description: 'The frequency of the LFO',
		defaultValue: 1.5,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		label: 'Delay Time',
		path: 'delayTime',
		description: 'The delay of the chorus effect in ms',
		defaultValue: 2,
		min: 1,
		max: 50,
		step: 0.5,
	},
	{
		label: 'Depth',
		path: 'depth',
		description: 'The depth of the chorus',
		defaultValue: 0.7,
		min: 0,
		max: 1,
		step: 0.05,
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class ChorusEffect extends BaseEffect {
	constructor(value = {}, dispatch, params) {
		super(value, dispatch, params)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new Chorus()
		this.instance.connect(this.meter)
		callback()
	}

	// update(value, oldValue) {
	// 	Object.keys(value).forEach(key => (this[key] = value[key]))
	// 	if (checkDifferenceAny(value.effect, oldValue.effect, params.map(({ path }) => path))) {
	// 		this.updateParams(getDeepDiff(value.effect, oldValue.effect))
	// 	}
	// }

	// updateParams(changes) {
	// 	Object.keys(changes).forEach(key => {
	// 		if (key === 'frequency') this.instance.frequency.value = changes[key]
	// 		else this.instance[key] = changes[key]
	// 	})
	// }
}

const effect: EffectType = {
	name: 'Chorus',
	slug: 'chorus',
	Effect: ChorusEffect,
	Editor: null,
	defaultValue,
	params,
}

export default effect
