import Crypto from 'crypto-js'
import 'crypto-js/sha1'
import 'crypto-js/lib-typedarrays'

export function readBlobAsText(blob: Blob): Promise<string> {
	console.log('getting hash for', blob)
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e: ProgressEvent) => resolve(fileReader.result as string)
		fileReader.onerror = reject
		fileReader.readAsText(blob)
	})
}

export function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(fileReader.result as ArrayBuffer)
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(blob)
	})
}

export function getHashFromBlob(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		readBlobAsArrayBuffer(blob)
			.then(data => resolve(Crypto.SHA1(Crypto.lib.WordArray.create(data)).toString()))
			.catch(error => reject(error))
	})
}

export function getBlobUrl(blob: Blob): string {
	return URL.createObjectURL(blob)
}
