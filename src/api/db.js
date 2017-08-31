import Dexie from 'dexie'
import { readBlobAsText, readBlobAsArrayBuffer, getHashFromBlob, getBlobUrl } from '../utils/blobUtils'

const db = new Dexie('TimbreSandpit')
db.version(1).stores({
	files: '++id,filename,size,type,date,&hash,blob',
})

db.open().catch(e => console.error('Opening DB failed', e.stack))

let fileId = 0
db.files.orderBy('id').last().then(item => fileId = item ? item.id : fileId)

const filesDB = db.files.defineClass({
	id: Number,
	filename: String,
	size: Number,
	type: String,
	date: String,
	hash: String,
	data: Blob,
})

addUrlBehavior(filesDB, 'blob')

function addUrlBehavior(tableDB, blobKey) {
	tableDB.prototype.url = ''
	tableDB.prototype.disposed = false
	tableDB.prototype.readAsText = function() { return readBlobAsText(this[blobKey]) }
	tableDB.prototype.readAsArrayBuffer = function() { return readBlobAsArrayBuffer(this[blobKey]) }
	tableDB.prototype.getUrl = function() {
		if(this.url !== '' && !this.disposed) {
			return this.url
		}else if(!this.disposed) {
			this.url = getBlobUrl(this[blobKey])
			return this.url
		}else{
			throw 'File disposed!'
		}
	}
	tableDB.prototype.revokeObjectUrl = function() {
		URL.revokeObjectURL(this.url)
		this.url = ''
	}
	tableDB.prototype.disposeData = function () {
		URL.revokeObjectURL(this.url);
		this.url = ''
		this.data = null
		this.disposed = true
	}
}


export default db

export const addFile = blob => getHashFromBlob(blob).then(hash => 
	getFileByHash(hash)
		.then(existingFile => existingFile)
		.catch(error => {
			const file = {
				id: ++fileId,
				filename: blob.name,
				size: blob.size,
				type: blob.type,
				date: blob.lastModified,
				hash,
				blob,
			}
			return db.files.add(file).then(id => db.files.get(id))
		})
)

export const getBy = (key, value) => new Promise((resolve, reject) => 
	db.files.where(key).equals(value).first().then(file => {
		if(file) resolve(file)
		else reject('File not found')
	})
)

export const getFileById = id => getBy('id', id)
export const getFileByHash = hash => getBy('hash', hash)