import { allInstrumentDefaults } from '../constants/params'

export class SamplerInstrument {
	constructor(value = {}, dispatch) {
		console.log('Mounting sampler...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.meter = new Meter()
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
		if (this.mounted && this.synth) this.synth.triggerAttack(note, now(), velocity / 2)
	}

	noteUp(note) {
		if (this.mounted && this.synth) this.synth.triggerRelease(note, now())
	}

	getToneSource() {
		return this.mounted && this.sampler ? this.sampler : false
	}
}

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {},
}

export const params = []

export default {
	name: 'Sampler',
	slug: 'sampler',
	Editor: null,
	defaultValue,
	params,
}
