import _debounce from 'lodash/throttle'
import { MembraneSynth, PolySynth, now } from 'tone'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, defaultEnvelope } from '../instrumentLibrary'
import { noteNumberToName } from '../utils/noteUtils'
import MembraneSynthEditor from '../components/instruments/MembraneSynth'

export class MembraneSynthInstrument {

	constructor(value = {}, dispatch) {
		console.log('Mounting membraneSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.reinitSynth = _debounce(this.initSynth, 1500)
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
			this.updateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if(this.synth) this.synth.dispose()
		this.synth = new PolySynth(voices, MembraneSynth).toMaster()
		this.synth.set('volume', -12)
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

}

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {
		voices: 1,
		pitchDecay: 0.05,
		octaves: 10,
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

export default {
	name: 'Membrane Synth',
	slug: 'membraneSynth',
	Editor: MembraneSynthEditor,
	Instrument: MembraneSynthInstrument,
	defaultValue,	
}