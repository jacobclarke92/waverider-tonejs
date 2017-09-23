import { Synth, PolySynth, Meter, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, defaultEnvelope, envelopeParams, voicesParam, oscTypeParam } from '../constants/params'
import { noteNumberToName } from '../utils/noteUtils'
import BasicSynthDeskItem from '../components/desk/BasicSynth'
import BasicSynthEditor from '../components/instruments/BasicSynth'

export class BasicSynthInstrument {

	constructor(value = {}, dispatch) {
		console.log('Mounting basicSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.reinitSynth = _debounce(this.initSynth, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.meter = new Meter()
		this.initSynth(() => {
			this.mounted = true
			console.log('basicSynth mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['voices'])) {
			this.reinitSynth()
			return
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['portamento', 'oscillator.type', 'envelope.attack', 'envelope.decay', 'envelope.sustain', 'envelope.release'])) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if(this.synth) this.synth.dispose()
		this.synth = new PolySynth(voices, Synth).toMaster()
		this.synth.set('volume', -12)
		this.synth.connect(this.meter)
		this.updateVoiceParams()
		callback()
	}

	updateVoiceParams() {
		if(!this.synth) return
		const { portamento, envelope, oscillator } = this.instrument
		this.synth.set({portamento, envelope, oscillator})
	}

	noteDown(note, velocity) {
		if(this.mounted && this.synth) this.synth.triggerAttack(noteNumberToName(note), now(), velocity / 2)
	}

	noteUp(note) {
		if(this.mounted && this.synth) this.synth.triggerRelease(noteNumberToName(note), now())
	}

	getToneSource() {
		return (this.mounted && this.synth) ? this.synth : false
	}
}

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {
		voices: 1,
		portamento: 0,
		envelope: {...defaultEnvelope},
		oscillator: {type: 'sine'},
	},
}

export const params = [
	voicesParam,
	oscTypeParam,
	{
		label: 'Portamento',
		path: 'portamento',
		defaultValue: 1,
		min: 0,
		max: 1,
		step: 0.02,
	},
	...envelopeParams,
]

export default {
	name: 'Basic Synth',
	slug: 'basicSynth',
	Instrument: BasicSynthInstrument,
	Editor: BasicSynthEditor,
	DeskItem: BasicSynthDeskItem,
	defaultValue,
	params,
}