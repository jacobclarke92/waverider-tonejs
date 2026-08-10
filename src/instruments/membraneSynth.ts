import { InstrumentDefaultValueType, ParamsType, InstrumentType, ThunkDispatchType, Instrument } from '../types'
import { MembraneSynth, PolySynth, Meter, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny } from '../utils/lifecycleUtils'
import { allInstrumentDefaults, envelopeParams, voicesParam, oscTypeParam } from '../constants/params'
import { noteNumberToName } from '../utils/noteUtils'
import MembraneSynthEditor from '../components/propertyPanels/instruments/MembraneSynth'
import MembraneSynthDeskItem from '../components/desk/MembraneSynth'
import BaseInstrument from './BaseInstrument'

export class MembraneSynthInstrument extends BaseInstrument {
	synth!: MembraneSynth
	[key: string]: any

	constructor(value: any = {}, dispatch: ThunkDispatchType) {
		super()
		console.log('Mounting membraneSynth...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.reinitSynth = _debounce(this.initSynth, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.meter = new Meter(0.5)
		this.initSynth(() => {
			this.mounted = true
			console.log('membraneSynth mounted', this)
		})
	}

	update(value: Instrument, oldValue: Instrument) {
		const val = value as any
		Object.keys(val).forEach(key => (this[key] = val[key]))
		if (
			checkDifferenceAny(value.instrument, oldValue.instrument, [
				'pitchDecay',
				'octaves',
				'oscillator.type',
				'envelope.attack',
				'envelope.decay',
				'envelope.sustain',
				'envelope.release',
			])
		) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSynth(callback = () => {}) {
		const { voices } = this.instrument
		if (this.synth) {
			this.synth.dispose()
		}
		// this.synth = new PolySynth(voices, MembraneSynth)
		this.synth = new MembraneSynth()
		this.synth.volume.value = -39
		// this.synth.set('volume', -39)
		this.synth.connect(this.meter)
		this.updateVoiceParams()
		callback()
	}

	updateVoiceParams() {
		if (!this.synth) return
		const { pitchDecay, octaves, envelope, oscillator } = this.instrument
		this.synth.pitchDecay = pitchDecay
		this.synth.octaves = octaves
		this.synth.oscillator.type = oscillator.type as any
		Object.keys(envelope).forEach(key => ((this.synth.envelope as any)[key] = envelope[key]))
		// this.synth.set({ pitchDecay, octaves, envelope, oscillator })
	}

	noteDown(note: number, velocity: number) {
		if (this.mounted && this.synth) this.synth.triggerAttack(noteNumberToName(note) || 'C4', now(), velocity / 2)
	}

	noteUp(note: number) {
		if (this.mounted && this.synth) this.synth.triggerRelease(now())
	}

	getToneSource() {
		return this.mounted && this.synth ? this.synth : false
	}
}

export const defaultValue: InstrumentDefaultValueType = {
	...allInstrumentDefaults,
	instrument: {
		// voices: 1,
		pitchDecay: 0.05,
		octaves: 6,
		oscillator: { type: 'sine' },
		envelope: {
			attack: 0.001,
			decay: 0.4,
			sustain: 0.01,
			release: 1.4,
			attackCurve: 'exponential',
		},
	},
}

export const params: ParamsType = [
	// voicesParam,
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

const instrument: InstrumentType = {
	name: 'Membrane Synth',
	slug: 'membraneSynth',
	Editor: MembraneSynthEditor,
	Instrument: MembraneSynthInstrument,
	DeskItem: MembraneSynthDeskItem,
	defaultValue,
	params,
}

export default instrument
