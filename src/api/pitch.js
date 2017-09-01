import { Player, Analyser } from 'tone'
import { noteStrings } from '../constants/noteStrings'

export const getPitch = soundUrl => new Promise((resolve, reject) => {
	let analysing = true
	const analyser = new Analyser('waveform', 1024)
	analyser.type = 'waveform'
	analyser.returnType = 'float'

	const noteStore = {}
	let mostReoccuring = 0
	let mostLikelyNote = null

	const rafFunction = () => {
		const buffer = analyser.analyse()
		const pitch = autoCorrelate(buffer, 1024)
		if(pitch !== -1) {
			const note = noteFromPitch(pitch)
			noteStore[note] = (noteStore[note] || 0) + 1
			if(noteStore[note] > mostReoccuring) {
				mostReoccuring = noteStore[note]
				mostLikelyNote = note
			}
			// console.log(note, noteStrings[note%12], pitch+'hz')
		}
		if(analysing) requestAnimationFrame(rafFunction)
	}

	const player = new Player(soundUrl, () => {
		console.log(analyser)
		player.start()
		requestAnimationFrame(rafFunction)
		setTimeout(() => {
			analysing = false
			console.log(mostLikelyNote, noteStrings[mostLikelyNote%12])
		}, (player.buffer.duration || 0)*1000)
	}).connect(analyser)//.toMaster()
})


const MIN_SAMPLES = 0
const GOOD_ENOUGH_CORRELATION = 0.9

// borrowed from https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
const autoCorrelate = (buf, sampleRate) => {
	const SIZE = buf.length
	const MAX_SAMPLES = Math.floor(SIZE/2)
	let best_offset = -1
	let best_correlation = 0
	let rms = 0
	let foundGoodCorrelation = false
	let correlations = new Array(MAX_SAMPLES)

	for (var i=0; i<SIZE; i++) {
		var val = buf[i]
		rms += val*val
	}
	rms = Math.sqrt(rms/SIZE)
	if (rms < 0.01) return -1

	let lastCorrelation = 1
	for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		let correlation = 0

		for (let i = 0; i < MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]))
		}
		correlation = 1 - (correlation/MAX_SAMPLES)
		correlations[offset] = correlation // store it, for the tweaking we need to do below.
		if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true
			if (correlation > best_correlation) {
				best_correlation = correlation
				best_offset = offset
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			const shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset]  
			return sampleRate/(best_offset+(8*shift))
		}
		lastCorrelation = correlation
	}

	if (best_correlation > 0.01) return sampleRate/best_offset
	return -1
}

const noteFromPitch = frequency => {
	const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
	return Math.round( noteNum ) + 69;
}

const frequencyFromNoteNumber = note => 440 * Math.pow(2, (note - 69) / 12)

const centsOffFromPitch = (frequency, note) => Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2))

