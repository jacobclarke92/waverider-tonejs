import { InstrumentDefaultValueType, ParamsType, InstrumentType } from '../types'
import { PluckSynth, PolySynth, Meter, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, defaultEnvelope, voicesParam } from '../constants/params'
import PluckSynthEditor from '../components/instruments/PluckSynth'
import PluckSynthDeskItem from '../components/desk/PluckSynth'
import BaseInstrument from './BaseInstrument'

export class PluckSynthInstrument extends BaseInstrument {
	synth: PolySynth

	constructor(value = {}, dispatch) {
		super()
		console.log('Mounting pluckSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.reinitSynth = _debounce(this.initSynth, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.meter = new Meter(0.5)
		this.initSynth(() => {
			this.mounted = true
			console.log('pluckSynth mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		if (checkDifferenceAny(value.instrument, oldValue.instrument, 'voices')) {
			this.reinitSynth()
			return
		}
		if (checkDifferenceAny(value.instrument, oldValue.instrument, ['attackNoise', 'resonance', 'dampening'])) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if (this.synth) this.synth.dispose()
		this.synth = new PolySynth(voices, PluckSynth)
		this.synth.set('volume', -39)
		this.synth.connect(this.meter)
		this.updateVoiceParams()
		callback()
	}

	updateVoiceParams() {
		if (!this.synth) return
		const { attackNoise, resonance, dampening } = this.instrument
		this.synth.set({ attackNoise, resonance, dampening })
	}

	noteDown(note, velocity) {
		if (this.mounted && this.synth) this.synth.triggerAttack(note, now(), velocity / 2)
	}

	noteUp(note) {
		if (this.mounted && this.synth) this.synth.triggerRelease(note, now())
	}

	getToneSource() {
		return this.mounted && this.synth ? this.synth : false
	}
}

export const defaultValue: InstrumentDefaultValueType = {
	...allInstrumentDefaults,
	instrument: {
		voices: 4,
		attackNoise: 1,
		dampening: 4000,
		resonance: 0.9,
	},
}

export const params: ParamsType = [
	voicesParam,
	{
		label: 'Attack Noise',
		path: 'attackNoise',
		defaultValue: 1,
		min: 0.1,
		max: 20,
		step: 0.1,
	},
	{
		label: 'Dampening',
		path: 'dampening',
		defaultValue: 100,
		min: 100,
		max: 8000,
		step: 10,
	},
	{
		label: 'Resonance',
		path: 'resonance',
		defaultValue: 1,
		min: 0.1,
		max: 20,
		step: 0.1,
	},
]

const instrument: InstrumentType = {
	name: 'Pluck Synth',
	slug: 'pluckSynth',
	Editor: PluckSynthEditor,
	Instrument: PluckSynthInstrument,
	DeskItem: PluckSynthDeskItem,
	defaultValue,
	params,
}

export default instrument
