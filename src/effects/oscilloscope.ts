import BaseEffect from './BaseEffect'
import { FeedbackEffect, Gain, FFT, Waveform } from 'tone'
import { EffectDefaultValueType, ParamsType, EffectType } from '../types'
import OscilloscopeDeskItem from '../components/desk/OscilloscopeEffect'

export const params: ParamsType = [
	{
		label: 'Gain',
		path: 'gain',
		description: '',
		defaultValue: 1,
		min: 0,
		max: 99,
		step: 0.05,
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class OscilloscopeEffect extends BaseEffect {
	constructor(value = {}, dispatch) {
		super(value, dispatch)
		this.initEffect.bind(this)
		// this.analyser = new Waveform(1024)
		console.log('~~~1', this)
	}

	initEffect(callback = () => {}) {
		console.log('~~~2', this)
		console.info('!!! initing oscilloscope effect')

		if (!this.analyser) this.analyser = new Waveform(32768 / 16)
		if (this.instance) this.instance.dispose()
		this.instance = new Gain(1)
		// this.instance.connect(this.meter)
		// console.log(this.instance.connect)
		console.log(this.analyser)
		// this.analyser.connect(this.instance)
		this.instance.connect(this.analyser)
		callback()
	}
}

const effect: EffectType = {
	name: 'Oscilloscope',
	slug: 'oscilloscope',
	Effect: OscilloscopeEffect,
	Editor: () => null,
	DeskItem: OscilloscopeDeskItem,
	defaultValue,
	params,
}

export default effect
