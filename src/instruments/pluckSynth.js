import { PluckSynth, PolySynth, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, defaultEnvelope } from '../instrumentLibrary'
import PluckSynthEditor from '../components/instruments/PluckSynth'

export class PluckSynthInstrument {

	constructor(value = {}, dispatch) {
		console.log('Mounting pluckSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.reinitSynth = _debounce(this.initSynth, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.initSynth(() => {
			this.mounted = true
			console.log('pluckSynth mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		if(checkDifferenceAny(value.instrument, oldValue.instrument, 'voices')) {
			this.reinitSynth()
			return
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['attackNoise', 'resonance', 'dampening'])) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if(this.synth) this.synth.dispose()
		this.synth = new PolySynth(voices, PluckSynth).toMaster()
		this.synth.set('volume', -12)
		this.updateVoiceParams()
		callback()
	}

	updateVoiceParams() {
		if(!this.synth) return
		const { attackNoise, resonance, dampening } = this.instrument
		this.synth.set({attackNoise, resonance, dampening})
	}

	noteDown(note, velocity) {
		if(this.mounted && this.synth) this.synth.triggerAttack(note, now(), velocity / 2)
	}

	noteUp(note) {
		if(this.mounted && this.synth) this.synth.triggerRelease(note, now())
	}

}

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {
		voices: 4,
		attackNoise: 1,
		dampening: 4000,
		resonance: 0.9,
	},
}

export default {
	name: 'Pluck Synth',
	slug: 'pluckSynth',
	Editor: PluckSynthEditor,
	Instrument: PluckSynthInstrument,
	defaultValue,	
}