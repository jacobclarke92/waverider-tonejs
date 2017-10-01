import BaseEffect from './BaseEffect'
import { AutoPanner } from 'tone'
import { oscTypeParam } from '../constants/params'

export class AutoPannerEffect extends BaseEffect {

	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if(this.instance) this.instance.dispose()
		this.instance = new AutoPanner()
		this.instance.connect(this.meter)
		callback()
	}
}

export const params = [
	{
		label: 'Frequency',
		path: 'frequency',
		description: 'How fast the panner modulates between left and right.',
		defaultValue: 1,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		...oscTypeParam, 
		path: 'type'
	},
	{
		label: 'Depth',
		path: 'depth',
		description: 'The amount of panning between left and right.',
		defaultValue: 1,
		min: 0,
		max: 1,
		step: 0.01,
	}
]

export const defaultValue = {
	effect: params.reduce((obj, {path, defaultValue}) => ({...obj, [path]: defaultValue}), {}),
}

export default {
	name: 'Auto Panner',
	slug: 'autoPanner',
	Effect: AutoPannerEffect,
	Editor: () => null,
	defaultValue,
	params,
}