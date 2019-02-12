import WaveSurfer from 'wavesurfer'
import base64toBlob from 'b64-to-blob'
import { getFile } from './db'
import { getBlobUrl } from '../utils/blobUtils'

const defaultOptions = {
	waveColor: '#FFF',
	minPxPerSec: 3000,
	normalize: false,
	splitChannels: true,
}

const waveforms = {}

export function getWaveformFromBlob(blob, options, hash = null) {
	return new Promise((resolve, reject) => {
		const container = document.createElement('div')
		container.setAttribute('id', 'waveform-renderer')
		document.body.appendChild(container)
		const WS = new WaveSurfer({
			...defaultOptions,
			...options,
			container,
		})
		WS.init()
		WS.on('ready', () => {
			const waveformUri = WS.exportImage()
			document.body.removeChild(container)
			WS.destroy()
			if (waveformUri) {
				const waveformBlob = base64toBlob(waveformUri.slice('data:image/png;base64,'.length), 'image/png')
				const waveformUrl = getBlobUrl(waveformBlob)
				if (hash) waveforms[hash] = waveformUrl
				resolve(waveformUrl)
			} else {
				reject('Could not generate waveform')
			}
		})
		WS.loadBlob(blob)
	})
}

export function getWaveformFromFile(file, options = {}) {
	return file.hash in waveforms ? waveforms[file.hash] : getWaveformFromBlob(file.blob, options, file.hash)
}

export function getWaveformFromFileHash(hash, options = {}) {
	return getFile(hash).then(file => file && getWaveformFromFile(file, options))
}
