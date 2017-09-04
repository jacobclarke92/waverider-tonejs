import { Sampler, PolySynth, now } from 'tone'

import { getFileByHash } from '../api/db'
import { getNoteByFile } from '../api/pitch'
import { noteStrings } from '../constants/noteStrings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { updateInstrument } from '../reducers/instruments'

import Simpler from '../components/instruments/Simpler'
import { allInstrumentDefaults, defaultEnvelope } from '../instrumentLibrary'

export class SimplerInstrument {
	constructor(value = {}, dispatch) {
		console.log('Mounting simpler...')
		this.mounted = false
		this.file = null
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.initSampler(() => {
			this.mounted = true
			console.log('Simpler mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		if(checkDifferenceAny(value, oldValue, 'instrument.trim')) {
			if(this.file) this.updateAudioFile(this.file.getUrl(), () => {
				this.updateVoiceParams()
			})
		}
		if(checkDifferenceAny(value, oldValue, 'instrument.fileHash')) {
			this.loadAudioFile(value.instrument.fileHash, file => {
				this.updateAudioFile(file.getUrl(), () => {
					this.updateVoiceParams()
				})
			})
		}
		if(checkDifferenceAny(value.instrument, oldValue.instrument, ['reverse', 'loop'])) {
			this.updateVoiceParams()
		}
	}

	initSampler(callback = () => {}) {
		console.log()
		const { voices, fileHash, reverse, loop, trim } = this.instrument
		if(!fileHash) return callback()
		if(this.sampler) this.sampler.dispose();
		this.loadAudioFile(fileHash, file => {
			this.sampler = new PolySynth(voices, Sampler).toMaster()
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
					if(this.instrument.baseNote != note) {
						this.dispatch(updateInstrument(this.id, {instrument: {
							...this.instrument, 
							baseNote: note, 
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
			voice.reverse = false
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

		const { reverse, loop } = this.instrument
		this.sampler.voices.forEach(voice => {
			voice.reverse = reverse
			voice.loop = loop
		})
	}

	noteDown(note, velocity) {
		if(this.mounted) this.sampler.triggerAttack(note - this.instrument.baseNote, now(), velocity / 2)
	}

	noteUp(note) {
		if(this.mounted) this.sampler.triggerRelease(note, now())
	}
}

export default {
	name: 'Simpler',
	slug: 'simpler',
	Editor: Simpler,
	Instrument: SimplerInstrument,
	defaultValue: {
		...allInstrumentDefaults,
		instrument: {
			fileHash: null,
			baseNote: 60,
			cents: 0,
			envelope: defaultEnvelope,
			reverse: false,
			loop: false,
			voices: 4,
			trim: {
				start: 0,
				end: 1,
			},
		},
	},
}