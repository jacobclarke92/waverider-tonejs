import { Sampler, PolySynth, Meter, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'

import { getFileByHash, FileEntity } from '../api/db'
import { getNoteByFile } from '../api/pitch'
import { noteStrings } from '../constants/noteStrings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { updateInstrument } from '../reducers/instruments'

import SimplerEditor from '../components/instruments/Simpler'
import { allInstrumentDefaults, defaultEnvelope, envelopeParams, voicesParam } from '../constants/params'
import BaseInstrument from './BaseInstrument'
import { ParamsType, InstrumentType } from '../types'

export class SimplerInstrument extends BaseInstrument {
	sampler: PolySynth
	reinitSampler: () => void
	file: null | FileEntity

	constructor(value = {}, dispatch) {
		super()
		console.log('Mounting simpler...')
		this.mounted = false
		this.file = null
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.reinitSampler = _debounce(this.initSampler, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.meter = new Meter(0.5)
		this.initSampler(() => {
			this.mounted = true
			console.log('Simpler mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		if (checkDifferenceAny(value.instrument, oldValue.instrument, ['voices', 'reverse'])) {
			this.reinitSampler()
			return
		}
		if (checkDifferenceAny(value.instrument, oldValue.instrument, ['trim'])) {
			if (this.file)
				this.updateAudioFile(this.file.url, () => {
					this.triggerUpdateVoiceParams()
				})
		}
		if (checkDifferenceAny(value, oldValue, 'instrument.fileHash')) {
			this.loadAudioFile(value.instrument.fileHash as string, file => {
				this.updateAudioFile(file.url, () => {
					this.triggerUpdateVoiceParams()
				})
			})
		}
		if (
			checkDifferenceAny(value.instrument, oldValue.instrument, [
				'loop',
				'envelope.attack',
				'envelope.decay',
				'envelope.sustain',
				'envelope.release',
			])
		) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSampler(callback = () => {}) {
		const { voices, fileHash, reverse, loop, trim } = this.instrument

		if (this.sampler) this.sampler.dispose()
		// @ts-ignore
		this.sampler = new PolySynth(voices, Sampler)
		this.sampler.set('volume', -39)
		this.sampler.connect(this.meter)

		if (!fileHash) return callback()
		this.loadAudioFile(fileHash, file => {
			this.updateAudioFile(file.url, () => {
				this.updateVoiceParams()
				callback()
			})
		})
	}

	loadAudioFile(fileHash: string, callback: (file?: FileEntity) => void) {
		if (!fileHash) return callback()

		getFileByHash(fileHash)
			.then(file => {
				console.log('Found audio for simpler', file)
				this.file = file

				// do something with this i guess
				getNoteByFile(file)
					.then(note => {
						console.log(`Average note = ${note} (${noteStrings[note % 12]})`)
						const { baseNote } = this.instrument
						if (this.instrument.baseNote == defaultValue.instrument.baseNote) {
							this.dispatch(
								updateInstrument(this.id, {
									instrument: {
										...this.instrument,
										calculatedBaseNote: note,
										baseNote: baseNote == defaultValue.instrument.baseNote ? note : baseNote,
										cents: 0,
									},
								})
							)
						}
					})
					.catch(e => console.log('Could not get pitch of sample'))

				callback(file)
			})
			.catch(e => console.warn('Unable to load audio for simpler', fileHash, e))
	}

	updateAudioFile(url: string, callback: () => void) {
		if (!url) return
		if (!this.sampler) return this.initSampler()

		let voicesLoaded = 0
		const { voices, trim, reverse } = this.instrument
		this.sampler.voices.forEach(voice => {
			// @ts-ignore
			voice.player.load(url, () => {
				// @ts-ignore
				const duration = voice.buffer.duration
				if (!(trim.start === 0 && trim.end === 1)) {
					// @ts-ignore
					voice.buffer = voice.buffer.slice(
						duration * (reverse ? 1 - trim.end : trim.start),
						duration * (reverse ? 1 - trim.start : trim.end)
					)
				}
				if (++voicesLoaded >= voices) callback()
			})
		})
	}

	updateVoiceParams() {
		if (!this.sampler) return this.initSampler()

		const { reverse, loop, envelope } = this.instrument
		this.sampler.set({
			reverse,
			loop,
			envelope,
		})
	}

	noteDown(note, velocity) {
		if (this.mounted && this.sampler && this.file) {
			// @ts-ignore
			this.sampler.triggerAttack(note - this.instrument.baseNote, now(), velocity / 2)
		}
	}

	noteUp(note) {
		if (this.mounted && this.sampler && this.file) {
			// @ts-ignore
			this.sampler.triggerRelease(note - this.instrument.baseNote, now())
		}
	}

	getPlaybackPositions() {
		if (!this.mounted || !this.sampler || !this.sampler.voices) return []
		const positions = []
		this.sampler.voices.forEach(voice => {
			// @ts-ignore
			if (voice.player.state == 'started') {
				// @ts-ignore
				const startedEvents = voice.player._state._timeline.filter(event => event.state == 'started')
				if (startedEvents.length) {
					const lastStartedEvent = startedEvents.pop()
					// @ts-ignore
					const duration = voice.player.buffer.duration
					// @ts-ignore
					const playbackRate = voice.player.playbackRate
					const elapsedTime = now() - lastStartedEvent.time
					let durationPercent = elapsedTime / (duration / playbackRate)
					if (this.instrument.loop) durationPercent = durationPercent % 1
					positions.push(durationPercent)
				}
			}
		})
		return positions
	}

	getToneSource() {
		return this.mounted && this.sampler ? this.sampler : false
	}
}

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {
		fileHash: null,
		baseNote: 0,
		calculatedBaseNote: null,
		cents: 0,
		reverse: false,
		loop: false,
		voices: 4,
		trim: {
			start: 0,
			end: 1,
		},
		envelope: { ...defaultEnvelope },
	},
}

export const params: ParamsType = [
	voicesParam,
	{
		label: 'Base Note',
		path: 'baseNote',
		defaultValue: 0,
		min: 0,
		max: 127,
		step: 1,
		type: 'note',
	},
	{
		label: 'Cents',
		path: 'cents',
		defaultValue: 0,
		min: -100,
		max: 100,
		step: 1,
	},
	{
		label: 'Reverse',
		path: 'reverse',
		defaultValue: false,
		type: 'boolean',
	},
	{
		label: 'Loop',
		path: 'loop',
		defaultValue: false,
		type: 'boolean',
	},
	{
		label: 'Trim Start',
		path: 'trim.start',
		defaultValue: 0,
		min: 0,
		max: 1,
		step: 0.001,
	},
	{
		label: 'Trim End',
		path: 'trim.end',
		defaultValue: 1,
		min: 0,
		max: 1,
		step: 0.001,
	},
	...envelopeParams,
]

const instrument: InstrumentType = {
	name: 'Simpler',
	slug: 'simpler',
	Editor: SimplerEditor,
	Instrument: SimplerInstrument,
	DeskItem: () => null,
	defaultValue,
	params,
}

export default instrument
