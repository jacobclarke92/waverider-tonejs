import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'
import base64toBlob from 'b64-to-blob'
import { getFileByHash } from './db'
import { getBlobUrl } from '../utils/blobUtils'
import { FileType } from '../types'

const defaultOptions: WaveSurferOptions = {
	waveColor: '#FFF',
	minPxPerSec: 3000,
	normalize: false,
	splitChannels: true,
}

const waveforms: { [k: string]: string } = {}

export function getWaveformFromBlob(blob: Blob, options, hash?: string): Promise<string> {
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

export function getWaveformFromFile(file: FileType, options: WaveSurferOptions = {}): string | Promise<string> {
	return file.hash in waveforms ? waveforms[file.hash] : getWaveformFromBlob(file.blob, options, file.hash)
}

export function getWaveformFromFileHash(hash: string, options: WaveSurferOptions = {}): Promise<string> {
	return getFileByHash(hash).then(file => file && getWaveformFromFile(file, options))
}
