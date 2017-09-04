import Dexie from 'dexie'
import prettySize from 'prettysize'
import { getStorageQuota, requestStorage } from '../utils/localStorageUtils'
import { readBlobAsText, readBlobAsArrayBuffer, getHashFromBlob, getBlobUrl } from '../utils/blobUtils'

import { instrumentSchema } from '../instrumentLibrary'

const localStorageBytes = 1024*1024*128
getStorageQuota().then(({usedBytes, grantedBytes}) => {
	console.log(prettySize(usedBytes)+' used', prettySize(grantedBytes)+' granted')
	// if(grantedBytes < localStorageBytes) {
	// 	requestStorage(localStorageBytes).then(grantedBytes => console.log(prettySize(grantedBytes)+' granted'))
	// }
})

const db = new Dexie('TimbreSandpit')
db.version(1).stores({
	files: '++id,filename,size,type,date,&hash,blob',
	instruments: instrumentSchema,
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
	note: Number,
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

export const add = (table, entity) => db.table(table).add(entity).then(id => db[table].get(id))

export const getAll = table => db.table(table).toArray()

export const getBy = (table, key, value) => new Promise((resolve, reject) => 
	db.table(table).where(key).equals(value).first()
		.then(entity => entity ? resolve(entity) : reject('Entity not found'))
		.catch(reject)	
)
export const getById = (table, id) => db.table(table).get(id)

export const updateBy = (table, key, value, updates = {}) => new Promise((resolve, reject) => 
	db.table(table).where(key).equals(value).first()
		.then(entity => {
			if(!entity) reject('Entity not found')
			else {
				db.table(table).update(entity.id, update)
					.then(updated => updated ? resolve(getBy(table, key, value)) : reject('Failed to update entity'))
			}
		}).catch(reject)
)

export const updateById = (table, id, updates = {}) => new Promise((resolve, reject) => 
	db.table(table).update(id, updates)
		.then(updated => updated ? resolve(getById(table, id)) : reject('Entity not found after updating'))
		.catch(reject)
)

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

export const getFileBy = (key, value) => getBy('files', key, value)
export const getFileById = id => getFileBy('id', id)
export const getFileByHash = hash => getFileBy('hash', hash)
export const updateFileBy = (key, value, updates = {}) => updateBy('files', key, value, updates)
export const updateFileById = (id, updates) => updateById('files', id, updates)
export const updateFileByHash = (hash, updates) => updateBy('files', 'hash', hash, updates)