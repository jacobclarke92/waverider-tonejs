import Crypto from 'crypto-js'
import 'crypto-js/sha1'
import 'crypto-js/lib-typedarrays'

export function readBlobAsText(blob) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(e.target.result)
		fileReader.onerror = reject
		fileReader.readAsText(this[blobKey])
	})
}

export function readBlobAsArrayBuffer(blob) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(e.target.result)
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(blob)
	})
}

export function getHashFromBlob(blob) {
	return new Promise((resolve, reject) => {
		readBlobAsArrayBuffer(blob)
			.then(data => resolve(Crypto.SHA1(Crypto.lib.WordArray.create(data)).toString()))
			.catch(error => reject(error))
	})
}

export function getBlobUrl(blob) {
	return URL.createObjectURL(blob)
}