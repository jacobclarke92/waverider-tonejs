import BaseEffect from './BaseEffect'
import { Chorus } from 'tone'

export class ChorusEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new Chorus()
		this.instance.connect(this.meter)
		callback()
	}
}

export const params = [
	{
		label: 'Frequency',
		path: 'frequency',
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
	},
]

export const defaultValue = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export default {
	name: 'Chorus',
	slug: 'chorus',
	Effect: ChorusEffect,
	Editor: () => null,
	defaultValue,
	params,
}
