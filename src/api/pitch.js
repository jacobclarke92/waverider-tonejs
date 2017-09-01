import { Player, Analyser } from 'tone'
import { noteStrings } from '../constants/noteStrings'

export const getPitch = soundUrl => new Promise((resolve, reject) => {
	let analysing = true
	const analyser = new Analyser('waveform', 1024)
	analyser.type = 'waveform'
	analyser.returnType = 'byte'
	const rafFunction = () => {
		// console.log(analyser.analyse()[2])
		const buffer = analyser.analyse()
		const pitch = autoCorrelate(buffer, 1024)
		console.log(buffer[0])
		if(pitch !== -1) {
			const note = noteFromPitch(pitch)
			console.log(note, noteStrings[note%12], pitch+'hz')
		}
		if(analysing) requestAnimationFrame(rafFunction)
	}
	const player = new Player(soundUrl, () => {
		console.log(analyser)
		player.start()
		requestAnimationFrame(rafFunction)
		setTimeout(() => analysing = false, (player.buffer.duration || 0)*1000)
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
	if (rms < 0.01) {
		console.log('not enough signal')
		return -1
	}

	let lastCorrelation = 1
	for (let offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		let correlation = 0

		for (let i = 0; i < MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]))
			// console.log(Math.abs((buf[i])-(buf[i+offset])))
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
	// console.log('best correlation', best_correlation)
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset
	}
	return -1
}

/*
const findFundamentalFreq = (buffer, sampleRate) => {
	// We use Autocorrelation to find the fundamental frequency.
	
	// In order to correlate the signal with itself (hence the name of the algorithm), we will check two points 'k' frames away. 
	// The autocorrelation index will be the average of these products. At the same time, we normalize the values.
	// Source: http://www.phy.mty.edu/~suits/autocorrelation.html
	// Assuming the sample rate is 48000Hz, a 'k' equal to 1000 would correspond to a 48Hz signal (48000/1000 = 48), 
	// while a 'k' equal to 8 would correspond to a 6000Hz one, which is enough to cover most (if not all) 
	// the notes we have in the notes.json file.
	var n = 1024, bestR = 0, bestK = -1;
	for(var k = 8; k <= 1000; k++){
		var sum = 0;
		
		for(var i = 0; i < n; i++){
			sum += ((buffer[i] - 127.5) / 127.5) * ((buffer[i + k] - 127.5) / 127.5);
		}
		
		var r = sum / (n + k);

		if(r > bestR){
			bestR = r;
			bestK = k;
		}

		if(r > 0.9) {
			// Let's assume that this is good enough and stop right here
			break;
		}
	}
	console.log(buffer.length, bestR)
	if(bestR > 0.0025) {
		// The period (in frames) of the fundamental frequency is 'bestK'. Getting the frequency from there is trivial.
		var fundamentalFreq = sampleRate / bestK;
		return fundamentalFreq;
	}
	else {
		// We haven't found a good correlation
		return -1;
	}
}
*/

const noteFromPitch = frequency => {
	const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
	return Math.round( noteNum ) + 69;
}

const frequencyFromNoteNumber = note => 440 * Math.pow(2, (note - 69) / 12)

const centsOffFromPitch = (frequency, note) => Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2))

