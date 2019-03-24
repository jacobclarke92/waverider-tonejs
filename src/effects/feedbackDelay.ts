import BaseEffect from './BaseEffect'
import { FeedbackDelay, Time } from 'tone'
import { EffectType, EffectDefaultValueType, ParamsType } from '../types'

export const params: ParamsType = [
	{
		label: 'Delay Time',
		path: 'delayTime',
		pathHasValue: true,
		description: 'The delay applied to the incoming signal',
		defaultValue: 0.25,
		min: 0.01,
		max: 1,
		step: 0.01,
	},
	{
		label: 'Feedback',
		path: 'feedback',
		pathHasValue: true,
		description: 'The amount of the effected signal which is fed back through the delay',
		defaultValue: 0.5,
		min: 0,
		max: 1,
		step: 0.05,
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class FeedbackDelayEffect extends BaseEffect {
	constructor(value = {}, dispatch, params) {
		super(value, dispatch, params)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new FeedbackDelay()
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Feedback Delay',
	slug: 'feedbackDelay',
	Effect: FeedbackDelayEffect,
	Editor: null,
	defaultValue,
	params,
}
export default effect
