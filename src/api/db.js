import Dexie from 'dexie'
import Crypto from 'crypto-js'
import 'crypto-js/sha1'
import 'crypto-js/lib-typedarrays'

const db = new Dexie('TimbreSandpit')
db.version(1).stores({
	files: '++id,filename,size,type,date,&hash,data',
})

export default db


db.open().catch(e => console.error('Opening DB failed', e.stack))

let fileId = 0
db.files.orderBy('id').last().then(item => fileId = item ? item.id : fileId)

db.files.toArray().then(files => console.log(files))

/*
export const filesDB = db.files.defineClass({
	id: Number,
	filename: String,
	size: Number,
	type: String,
	date: String,
	hash: String,
	data: Blob,
})

filesDB.prototype.url = ''
filesDB.prototype.disposed = false

filesDB.prototype.getUrl = function() {
	if(this.url !== '' && !this.disposed) {
		return this.url
	}else if(!this.disposed) {
		this.url = URL.createObjectURL(this.data)
		return this.url
	}else{
		console.log('File disposed!')
		throw 'File disposed!'
	}
}

filesDB.prototype.revokeObjectUrl = function() {
	URL.revokeObjectURL(this.url)
	this.url = ''
}

filesDB.prototype.readAsText = function() {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(e.target.result)
		fileReader.onerror = reject
		fileReader.readAsText(this.data)
	})
}

filesDB.prototype.readAsArrayBuffer = function() {
	return readAsArrayBuffer(this.data)
}

filesDB.prototype.disposeData = function () {
	URL.revokeObjectURL(this.url);
	this.url = ''
	this.data = null
	this.disposed = true
}
*/

function readAsArrayBuffer(blob) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = e => resolve(e.target.result)
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(blob)
	})
}

function getHashFromBlob(blob) {
	return new Promise((resolve, reject) => {
		readAsArrayBuffer(blob)
			.then(data => resolve(Crypto.SHA1(Crypto.lib.WordArray.create(data)).toString()))
			.catch(error => reject(error))
	})
}

export function addFile(blob) {
	return getHashFromBlob(blob).then(hash => {
		return db.files.where('hash').equals(hash).first().then(existingFile => {
			if(existingFile) {
				return existingFile
			}else{
				console.log('new file')
				return db.files.add({
					id: ++fileId,
					filename: blob.name,
					size: blob.size,
					type: blob.type,
					date: blob.lastModified,
					hash,
				})
			}
		})
	})
}