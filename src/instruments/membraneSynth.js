import { MembraneSynth, PolySynth, Meter, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, defaultEnvelope, envelopeParams, voicesParam, oscTypeParam } from '../constants/params'
import { noteNumberToName } from '../utils/noteUtils'
import MembraneSynthEditor from '../components/instruments/MembraneSynth'
import MembraneSynthDeskItem from '../components/desk/MembraneSynth'

export class MembraneSynthInstrument {

	constructor(value = {}, dispatch) {
		console.log('Mounting membraneSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.reinitSynth = _debounce(this.initSynth, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.meter = new Meter()
		this.initSynth(() => {
			this.mounted = true
			console.log('membraneSynth mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['voices'])) {
			this.reinitSynth()
			return
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['pitchDecay', 'octaves', 'oscillator.type', 'envelope.attack', 'envelope.decay', 'envelope.sustain', 'envelope.release'])) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if(this.synth) this.synth.dispose()
		this.synth = new PolySynth(voices, MembraneSynth).toMaster()
		this.synth.set('volume', -12)
		this.synth.connect(this.meter)
		this.updateVoiceParams()
		callback()
	}

	updateVoiceParams() {
		if(!this.synth) return
		const { pitchDecay, octaves, envelope, oscillator } = this.instrument
		this.synth.set({pitchDecay, octaves, envelope, oscillator})
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
		pitchDecay: 0.05,
		octaves: 6,
		oscillator: {type: 'sine'},
		envelope: {
			attack: 0.001,
			decay: 0.4,
			sustain: 0.01,
			release: 1.4,
			attackCurve: 'exponential',
		}
	},
}

export const params = [
	voicesParam,
	oscTypeParam,
	{
		label: 'Pitch Decay',
		path: 'pitchDecay',
		defaultValue: 0.05,
		min: 0,
		max: 1,
		step: 0.02,
	},
	{
		label: 'Octaves',
		path: 'octaves',
		defaultValue: 6,
		min: 0,
		max: 12,
		step: 1,
	},
	...envelopeParams,
]

export default {
	name: 'Membrane Synth',
	slug: 'membraneSynth',
	Editor: MembraneSynthEditor,
	Instrument: MembraneSynthInstrument,
	DeskItem: MembraneSynthDeskItem,
	defaultValue,
	params,
}