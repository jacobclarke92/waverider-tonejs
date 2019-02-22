import { EnvelopeType, OptionsParamType, NumberParamType } from '../types'

export const defaultEnvelope: EnvelopeType = {
	attack: 0.01,
	decay: 0,
	sustain: 1,
	release: 0.2,
}

export const allInstrumentDefaults = {
	midiDeviceId: null,
	midiChannel: null,
}

export const voicesParam: NumberParamType = {
	label: 'Voices',
	path: 'voices',
	defaultValue: 1,
	min: 1,
	max: 12,
	step: 1,
}

export const oscTypeParam: OptionsParamType = {
	label: 'Osc. Type',
	path: 'oscillator.type',
	defaultValue: 'sine',
	options: ['sine', 'triangle', 'square', 'sawtooth'],
}

export const envelopeParams: NumberParamType[] = [
	{
		label: 'Attack',
		path: 'envelope.attack',
		defaultValue: 0.01,
		min: 0,
		max: 5,
		step: 0.01,
	},
	{
		label: 'Decay',
		path: 'envelope.decay',
		defaultValue: 0,
		min: 0,
		max: 5,
		step: 0.01,
	},
	{
		label: 'Sustain',
		path: 'envelope.sustain',
		defaultValue: 1,
		min: 0,
		max: 1,
		step: 0.01,
	},
	{
		label: 'Release',
		path: 'envelope.release',
		defaultValue: 0.2,
		min: 0,
		max: 5,
		step: 0.01,
	},
]
