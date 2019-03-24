import BaseEffect from './BaseEffect'
import { Gain, Waveform } from 'tone'
import { EffectDefaultValueType, ParamsType, EffectType } from '../types'
import OscilloscopeDeskItem from '../components/desk/OscilloscopeEffect'

export const params: ParamsType = [
	{
		label: 'Gain',
		path: 'gain',
		pathHasValue: true,
		description: '',
		defaultValue: 1,
		min: 0,
		max: 99,
		step: 0.05,
	},
	{
		label: 'Zero Crossing',
		path: 'zeroCrossing',
		description: 'Snap to zero-crossing point',
		defaultValue: false,
		type: 'boolean',
	},
]

export const defaultValue: EffectDefaultValueType = {
	effect: params.reduce((obj, { path, defaultValue }) => ({ ...obj, [path]: defaultValue }), {}),
}

export class OscilloscopeEffect extends BaseEffect {
	constructor(value = {}, dispatch, params) {
		super(value, dispatch, params)
		this.initEffect.bind(this)
	}

	initEffect(callback = () => {}) {
		if (!this.analyser) this.analyser = new Waveform(32768 / 16)
		if (this.instance) this.instance.dispose()
		this.instance = new Gain(1)
		this.instance.connect(this.analyser)
		callback()
	}
}

const effect: EffectType = {
	name: 'Oscilloscope',
	slug: 'oscilloscope',
	Effect: OscilloscopeEffect,
	Editor: null,
	DeskItem: OscilloscopeDeskItem,
	defaultValue,
	params,
}

export default effect
