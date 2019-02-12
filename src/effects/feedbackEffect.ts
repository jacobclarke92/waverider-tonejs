import BaseEffect from './BaseEffect'
import { FeedbackEffect } from 'tone'
import { EffectDefaultValueType, ParamsType, EffectType } from '../types'

export const params: ParamsType = [
	{
		label: 'Feedback',
		path: 'feedback',
		description: 'The amount of signal which is fed back into the effect input',
		defaultValue: 0.125,
		min: 0,
		max: 1,
		step: 0.05,
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class FeedbackEffectEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		this.instance = new FeedbackEffect()
		this.instance.connect(this.meter)
		callback()
	}
}

const effect: EffectType = {
	name: 'Feedback Effect',
	slug: 'feedbackEffect',
	Effect: FeedbackEffectEffect,
	Editor: () => null,
	defaultValue,
	params,
}

export default effect
