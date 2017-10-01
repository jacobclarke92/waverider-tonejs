import BaseEffect from './BaseEffect'
import { FeedbackDelay } from 'tone'

export class FeedbackDelayEffect extends BaseEffect {

	constructor(value = {}, dispatch) {
		super(value, dispatch)
	}

	initEffect(callback = () => {}) {
		if(this.instance) this.instance.dispose()
		this.instance = new FeedbackDelay()
		this.instance.connect(this.meter)
		callback()
	}
}

export const params = [
	{
		label: 'Delay Time',
		path: 'delayTime',
		description: 'The delay applied to the incoming signal',
		defaultValue: 0.25,
	},
	{
		label: 'Feedback',
		path: 'feedback',
		description: 'The amount of the effected signal which is fed back through the delay',
		defaultValue: 0.5,
	}
]

export const defaultValue = {
	effect: params.reduce((obj, {path, defaultValue}) => ({...obj, [path]: defaultValue}), {}),
}

export default {
	name: 'Feedback Delay',
	slug: 'feedbackDelay',
	Effect: FeedbackDelayEffect,
	Editor: () => null,
	defaultValue,
	params,
}