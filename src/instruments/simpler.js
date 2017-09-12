import { Sampler, PolySynth, now } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'

import { getFileByHash } from '../api/db'
import { getNoteByFile } from '../api/pitch'
import { noteStrings } from '../constants/noteStrings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { updateInstrument } from '../reducers/instruments'

import SimplerEditor from '../components/instruments/Simpler'
import { allInstrumentDefaults, defaultEnvelope, envelopeParams, voicesParam } from '../constants/params'

export class SimplerInstrument {
	constructor(value = {}, dispatch) {
		console.log('Mounting simpler...')
		this.mounted = false
		this.file = null
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.reinitSampler = _debounce(this.initSampler, voicesUpdateDebounce)
		this.triggerUpdateVoiceParams = _debounce(this.updateVoiceParams, paramUpdateDebounce)
		this.initSampler(() => {
			this.mounted = true
			console.log('Simpler mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['voices', 'reverse'])) {
			this.reinitSampler()
			return
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['trim'])) {
			if(this.file) this.updateAudioFile(this.file.getUrl(), () => {
				this.triggerUpdateVoiceParams()
			})
		}
		if(checkDifferenceAny(value, oldValue, 'instrument.fileHash')) {
			this.loadAudioFile(value.instrument.fileHash, file => {
				this.updateAudioFile(file.getUrl(), () => {
					this.triggerUpdateVoiceParams()
				})
			})
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['loop', 'envelope.attack', 'envelope.decay', 'envelope.sustain', 'envelope.release'])) {
			this.triggerUpdateVoiceParams()
		}
	}

	initSampler(callback = () => {}) {
		const { voices, fileHash, reverse, loop, trim } = this.instrument
		if(!fileHash) return callback()
		if(this.sampler) this.sampler.dispose();
		this.loadAudioFile(fileHash, file => {
			this.sampler = new PolySynth(voices, Sampler).toMaster()
			this.sampler.set('volume', -12)
			this.updateAudioFile(file.getUrl(), () => {
				this.updateVoiceParams()
				callback()
			})
		})
	}

	loadAudioFile(fileHash, callback = () => {}) {
		if(!fileHash) return callback()

		getFileByHash(fileHash).then(file => {
			console.log('Found audio for simpler', file)
			this.file = file

			// do something with this i guess
			getNoteByFile(file)
				.then(note => {
					console.log(`Average note = ${note} (${noteStrings[note%12]})`)
					const { baseNote } = this.instrument
					if(this.instrument.baseNote == defaultValue.instrument.baseNote) {
						this.dispatch(updateInstrument(this.id, {instrument: {
							...this.instrument, 
							calculatedBaseNote: note, 
							baseNote: (baseNote == defaultValue.instrument.baseNote) ? note : baseNote,
							cents: 0,
						}}))
					}
				})
				.catch(e => console.log('Could not get pitch of sample'))

			callback(file)
		}).catch(e => console.warn('Unable to load audio for simpler', fileHash, e))
	}

	updateAudioFile(url, callback = () => {}) {
		if(!url) return
		if(!this.sampler) return this.initSampler()

		let voicesLoaded = 0
		const { voices, trim, reverse } = this.instrument
		this.sampler.voices.forEach(voice => {
			voice.player.load(url, () => {
				const duration = voice.buffer.duration
				if(!(trim.start === 0 && trim.end === 1)) {
					voice.buffer = voice.buffer.slice(
						duration * (reverse ? 1 - trim.end : trim.start), 
						duration * (reverse ? 1 - trim.start : trim.end)
					)
				}
				if(++voicesLoaded >= voices) callback()
			})
		})
	}

	updateVoiceParams() {
		if(!this.sampler) return this.initSampler()

		const { reverse, loop, envelope } = this.instrument
		this.sampler.set({
			reverse,
			loop,
			envelope,
		})
	}

	noteDown(note, velocity) {
		if(this.mounted && this.sampler) this.sampler.triggerAttack(note - this.instrument.baseNote, now(), velocity / 2)
	}

	noteUp(note) {
		if(this.mounted && this.sampler) this.sampler.triggerRelease(note - this.instrument.baseNote, now())
	}

	getPlaybackPositions() {
		if(!this.mounted || !this.sampler || !this.sampler.voices) return []
		const positions = []
		this.sampler.voices.forEach(voice => {
			if(voice.player.state == 'started') {
				const startedEvents = voice.player._state._timeline.filter(event => event.state == 'started')
				if(startedEvents.length) {
					const lastStartedEvent = startedEvents.pop()
					const duration = voice.player.buffer.duration
					const playbackRate = voice.player.playbackRate
					const elapsedTime = now() - lastStartedEvent.time
					let durationPercent = elapsedTime / (duration/playbackRate)
					if(this.instrument.loop) durationPercent = durationPercent%1
					positions.push(durationPercent)
				}
			}
		})
		return positions
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
		envelope: {...defaultEnvelope},
	},
}

export const params = [
	voicesParam,
	{
		label: 'Base Note',
		path: 'baseNote',
		defaultValue: 0,
		min: 0,
		max: 128,
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

export default {
	name: 'Simpler',
	slug: 'simpler',
	Editor: SimplerEditor,
	Instrument: SimplerInstrument,
	defaultValue,
	params,
}