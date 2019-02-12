import { allInstrumentDefaults } from '../constants/params'
import { Meter } from 'tone'
import BaseInstrument from './BaseInstrument'
import { InstrumentDefaultValueType, ParamsType, InstrumentType } from '../types'

export class SamplerInstrument extends BaseInstrument {
	sampler: any

	constructor(value = {}, dispatch) {
		super()
		console.log('Mounting sampler...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.meter = new Meter(0.5)
		this.initSynth(() => {
			this.mounted = true
			console.log('Sampler mounted', this)
		})
	}

	initSynth(callback = () => {}) {
		if (this.sampler) this.sampler.dispose()
		// init stuff pls
		callback()
	}

	noteDown(note, velocity) {
		// if (this.mounted && this.synth) this.synth.triggerAttack(note, now(), velocity / 2)
	}

	noteUp(note) {
		// if (this.mounted && this.synth) this.synth.triggerRelease(note, now())
	}

	getToneSource() {
		return this.mounted && this.sampler ? this.sampler : false
	}
}

export const defaultValue: InstrumentDefaultValueType = {
	...allInstrumentDefaults,
	instrument: {},
}

export const params: ParamsType = []

const instrument: InstrumentType = {
	name: 'Sampler',
	slug: 'sampler',
	Editor: null,
	Instrument: null,
	DeskItem: null,
	defaultValue,
	params,
}

export default instrument
