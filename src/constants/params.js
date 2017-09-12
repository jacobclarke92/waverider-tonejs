
export const defaultEnvelope = {
	attack: 0.01,
	decay: 0,
	sustain: 1,
	release: 0.2,
}

export const allInstrumentDefaults = {
	midiDeviceId: null,
	midiChannel: null,
}

export const voicesParam = {
	label: 'Voices',
	path: 'voices',
	defaultValue: 1,
	min: 1,
	max: 12,
	step: 1,
}

export const oscTypeParam = {
	label: 'Osc. Type',
	path: 'oscillator.type',
	defaultValue: 'sine',
	options: ['sine', 'triangle', 'square', 'sawtooth'],
}

export const envelopeParams = [
	{
		label: 'Attack',
		path: 'envelope.attack',
		defaulValue: 0.01,
		min: 0,
		max: 5,
		step: 0.01,
	},
	{
		label: 'Decay',
		path: 'envelope.decay',
		defaulValue: 0,
		min: 0,
		max: 5,
		step: 0.01,
	},
	{
		label: 'Sustain',
		path: 'envelope.sustain',
		defaulValue: 1,
		min: 0,
		max: 1,
		step: 0.01,
	},
	{
		label: 'Release',
		path: 'envelope.release',
		defaulValue: 0.2,
		min: 0,
		max: 5,
		step: 0.01,
	},
]