import BaseEffect from './BaseEffect'
import { Distortion } from 'tone'

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

export const params = [
	{
		label: 'Distortion',
		path: 'distortion',
		defaultValue: 0.4,
	},
	{
		label: 'Oversample',
		path: 'oversample',
		defaultValue: 'none',
		options: ['none', '2x', '4x'],
	},
]

export const defaultValue = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export default {
	name: 'Distortion',
	slug: 'distortion',
	Effect: DistortionEffect,
	Editor: () => null,
	defaultValue,
	params,
}
