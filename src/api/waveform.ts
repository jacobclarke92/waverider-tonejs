import WaveSurfer, { WaveSurferParams } from 'wavesurfer.js'
import base64toBlob from 'b64-to-blob'
import { getFileByHash, FileEntity } from './db'
import { getBlobUrl } from '../utils/blobUtils'
import { FileType } from '../types'

const defaultOptions: Omit<WaveSurferParams, 'container'> = {
	waveColor: '#FFF',
	minPxPerSec: 3000,
	normalize: false,
	splitChannels: true,
}

const waveforms: { [k: string]: string } = {}

export function getWaveformFromBlob(
	blob: Blob,
	options: Omit<WaveSurferParams, 'container'>,
	hash?: string
): Promise<string> {
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
			const waveformUri = WS.exportImage() as string // will be string because we're giving it blob
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

export function getWaveformFromFile(
	file: FileEntity,
	options: Omit<WaveSurferParams, 'container'> = {}
): string | Promise<string> | false {
	return file.hash && file.hash in waveforms
		? waveforms[file.hash]
		: file.blob
		? getWaveformFromBlob(file.blob, options, file.hash)
		: false
}

export function getWaveformFromFileHash(
	hash: string,
	options: Omit<WaveSurferParams, 'container'> = {}
): Promise<string | false> {
	return getFileByHash(hash).then(file => getWaveformFromFile(file, options))
}
