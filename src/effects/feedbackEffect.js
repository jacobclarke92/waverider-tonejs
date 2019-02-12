import BaseEffect from './BaseEffect'
import { FeedbackEffect } from 'tone'

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

export const params = [
	{
		label: 'Feedback',
		path: 'feedback',
		description: 'The amount of signal which is fed back into the effect input',
		defaultValue: 0.125,
	},
]

export const defaultValue = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export default {
	name: 'Feedback Effect',
	slug: 'feedbackEffect',
	Effect: FeedbackEffectEffect,
	Editor: () => null,
	defaultValue,
	params,
}
