import Dexie from 'dexie'
import Crypto from 'crypto'

const db = new Dexie('TimbreSandpit')
db.version(1).stores({
	files: '++id,filename,size,type,date,hash,data',
})

export default db

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
		fileReader.onload = function() { resolve(this.result) }
		fileReader.onerror = reject
		fileReader.readAsText(this.data)
	})
}

filesDB.prototype.readAsArrayBuffer = function() {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = function() { resolve(this.result) }
		fileReader.onerror = reject
		fileReader.readAsArrayBuffer(this.data)
	})
}

filesDB.prototype.disposeData = function () {
	URL.revokeObjectURL(this.url);
	this.url = ''
	this.data = null
	this.disposed = true
}

function getHashFromBlob(blob) {
	return null
}

export function addFile(blob) {
	const row = db.files.put({
		id: null,
		filename: blob.name,
		size: blob.size,
		type: blob.type,
		date: blob.lastModified,
		hash: getHashFromBlob(blob),
	})
	console.log(row)
	return row
}