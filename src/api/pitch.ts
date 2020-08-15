import { Player, Analyser } from 'tone'
import { updateFileById, FileEntity } from './db'

export const getNote = (soundUrl: string): Promise<number> =>
	new Promise((resolve, reject) => {
		let analyzing = true
		const analyser = new Analyser('waveform', 1024)
		analyser.type = 'waveform'

		const noteStore: { [k: number]: number } = {}
		let mostReoccurring = 0
		let mostLikelyNote: number

		const analyserFrame = () => {
			const buffer = analyser.getValue()
			const pitch = autoCorrelate(buffer instanceof Array ? buffer[0] : buffer, 1024)
			if (pitch !== -1) {
				const note = noteFromPitch(pitch)
				noteStore[note] = (noteStore[note] || 0) + 1
				if (noteStore[note] > mostReoccurring) {
					mostReoccurring = noteStore[note]
					mostLikelyNote = note
				}
			}
			if (analyzing) window.requestAnimationFrame(analyserFrame)
		}

		const player = new Player(soundUrl, () => {
			player.start()
			window.requestAnimationFrame(analyserFrame)
			setTimeout(() => {
				analyzing = false
				if (mostLikelyNote) resolve(mostLikelyNote)
				else reject()
			}, (player.buffer.duration || 0) * 1000)
		}).connect(analyser)
	})

export const getNoteByFile = (file: FileEntity): Promise<number> =>
	new Promise((resolve, reject) => {
		if (file.note) resolve(file.note)
		else
			getNote(file.url)
				.then(note => {
					if (file.id)
						return updateFileById(file.id, { note })
							.then(() => resolve(note))
							.catch(reject)
					else reject()
				})
				.catch(reject)
	})

export const noteFromPitch = (frequency: number): number => {
	const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2))
	return Math.round(noteNum) + 110
}

export const frequencyFromNoteNumber = (note: number): number => 440 * Math.pow(2, (note - 110) / 12)

export const centsOffFromPitch = (frequency: number, note: number) =>
	Math.floor((1200 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2))

// borrowed from https://github.com/cwilso/PitchDetect/blob/master/js/pitchdetect.js
const minSamples = 0
const goodEnoughCorrelation = 0.9
const autoCorrelate = (buf: Float32Array, sampleRate: number): number => {
	const size = buf.length
	const maxSamples = Math.floor(size / 2)
	let bestOffset = -1
	let bestCorrelation = 0
	let rms = 0
	let foundGoodCorrelation = false
	let correlations = new Array(maxSamples)

	for (let i = 0; i < size; i++) {
		const val = buf[i]
		rms += val * val
	}
	rms = Math.sqrt(rms / size)
	if (rms < 0.01) return -1

	let lastCorrelation = 1
	for (let offset = minSamples; offset < maxSamples; offset++) {
		let correlation = 0

		for (let i = 0; i < maxSamples; i++) {
			correlation += Math.abs(buf[i] - buf[i + offset])
		}
		correlation = 1 - correlation / maxSamples
		correlations[offset] = correlation // store it, for the tweaking we need to do below.
		if (correlation > goodEnoughCorrelation && correlation > lastCorrelation) {
			foundGoodCorrelation = true
			if (correlation > bestCorrelation) {
				bestCorrelation = correlation
				bestOffset = offset
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around bestOffset in order to better determine precise
			// (anti-aliased) offset.

			// we know bestOffset >=1,
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
			// we can't drop into this clause until the following pass (else if).
			const shift = (correlations[bestOffset + 1] - correlations[bestOffset - 1]) / correlations[bestOffset]
			return sampleRate / (bestOffset + 8 * shift)
		}
		lastCorrelation = correlation
	}

	if (bestCorrelation > 0.01) return sampleRate / bestOffset
	return -1
}
