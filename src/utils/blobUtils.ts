import Crypto from 'crypto-js'
import 'crypto-js/sha1'
import 'crypto-js/lib-typedarrays'

export function readBlobAsText(blob: Blob) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e: Event) => resolve(fileReader.result)
		fileReader.onerror = reject
		fileReader.readAsText(blob)
	})
}

export function readBlobAsArrayBuffer(blob: Blob) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(fileReader.result)
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(blob)
	})
}

export function getHashFromBlob(blob: Blob) {
	return new Promise((resolve, reject) => {
		readBlobAsArrayBuffer(blob)
			.then(data => resolve(Crypto.SHA1(Crypto.lib.WordArray.create(data)).toString()))
			.catch(error => reject(error))
	})
}

export function getBlobUrl(blob: Blob) {
	return URL.createObjectURL(blob)
}
