import Dexie, { IndexableType } from 'dexie'
import prettySize from 'prettysize'
import _get from 'lodash/get'
import { getStorageQuota, requestStorage } from '../utils/localStorageUtils'
import { readBlobAsText, readBlobAsArrayBuffer, getHashFromBlob, getBlobUrl } from '../utils/blobUtils'

import { deviceSchema } from './midi'
import { effectSchema } from '../effectLibrary'
import { instrumentSchema } from '../instrumentLibrary'
import { deskSchema } from '../reducers/desk'
import { FileType, InstrumentType, EffectType } from '../types'
import { PointObj } from '../utils/Point'

getStorageQuota()
	.then(({ usedBytes, grantedBytes }) => {
		console.log(prettySize(usedBytes) + ' used', prettySize(grantedBytes) + ' granted')
		// const localStorageBytes = 1024*1024*128
		// if(grantedBytes < localStorageBytes) {
		// 	requestStorage(localStorageBytes).then(grantedBytes => console.log(prettySize(grantedBytes)+' granted'))
		// }
	})
	.catch(e => console.warn(e))

type FilesTableSchema = FileType
type InstrumentsTableSchema = {
	id?: number
	enabled: boolean
	type: string
	midiChannel: null | number
	midiDeviceId: null | number
	instrument: InstrumentType
}
type EffectsTableSchema = {
	id?: number
	enabled: boolean
	type: string
	effect: EffectType
}
type DevicesTableSchema = {
	id?: number
	type: string
	name: string
	manufacturer: string
	version: string
	disconnected: boolean
}
type DeskTableSchema = {
	id?: number
	name: string
	ownerId: number
	ownerType: string
	type: string
	position: PointObj
}

export class FileEntity {
	id: number
	filename: string
	size: number
	type: string
	date: string
	note: number
	hash: string
	data: Blob
	blob: Blob

	disposed: boolean
	_url: string

	constructor(value: FileType) {
		this.disposed = false
		for (let key in value) {
			this[key] = value
		}
	}

	readAsText(): null | Promise<string> {
		return this.blob ? readBlobAsText(this.blob) : null
	}

	readAsArrayBuffer(): null | Promise<ArrayBuffer> {
		return this.blob ? readBlobAsArrayBuffer(this.blob) : null
	}

	revokeObjectUrl = function() {
		URL.revokeObjectURL(this._url)
		this._url = ''
	}

	disposeData = function() {
		URL.revokeObjectURL(this._url)
		this._url = ''
		this.data = null
		this.disposed = true
	}

	get url(): string {
		if (this._url !== '' && !this.disposed) {
			return this._url
		} else if (!this.disposed) {
			this._url = getBlobUrl(this.blob)
			return this._url
		} else {
			throw 'File disposed!'
		}
	}
}

class AppDB extends Dexie {
	files: Dexie.Table<FilesTableSchema, number>
	instruments: Dexie.Table<InstrumentsTableSchema, number>
	effects: Dexie.Table<EffectsTableSchema, number>
	devices: Dexie.Table<DevicesTableSchema, number>
	desk: Dexie.Table<DeskTableSchema, number>

	constructor() {
		super('AppDB')
		this.version(1).stores({
			files: '++id,filename,size,type,date,&hash,blob',
			instruments: instrumentSchema,
			effects: effectSchema,
			devices: deviceSchema,
			desk: deskSchema,
		})
		this.table('files').mapToClass(FileEntity)
	}
}

const db = new AppDB()
;(window as any).logAllTables = () => {
	getAll('files').then(files => console.log('files', files))
	getAll('instruments').then(instruments => console.log('instruments', instruments))
	getAll('devices').then(devices => console.log('devices', devices))
	getAll('desk').then(desk => console.log('desk', desk))
}

db.open().catch(e => console.error('Opening DB failed', e.stack))

let fileId = 0
db.table('files')
	.orderBy('id')
	.last()
	.then(item => (fileId = item ? item.id : fileId))

export default db

export const add = (table: string, entity: any): Promise<any> =>
	db
		.table(table)
		.add(entity)
		.then(id => db.table(table).get(id))

export const getAll = (table: string): Promise<any[]> => db.table(table).toArray()

export const getBy = (table: string, field: string | string[], value: IndexableType): Promise<any | void> =>
	new Promise((resolve, reject) =>
		db
			.table(table)
			.where(field)
			.equals(value)
			.first()
			.then(entity => (entity ? resolve(entity) : reject('Entity not found')))
			.catch(reject)
	)

export const getById = (table: string, id: number) => db.table(table).get(id)

export const getWhere = (table: string, conditions: { [key: string]: IndexableType } = {}) =>
	db
		.table(table)
		.where(conditions)
		.toArray()

export const getFirstWhere = (table: string, conditions: { [key: string]: IndexableType } = ({} = {})) =>
	db
		.table(table)
		.where(conditions)
		.first()

export const getList = (table: string, fieldPath: string): Promise<any[]> =>
	db
		.table(table)
		.toArray()
		.then((items = []) => items.map(item => _get(item, fieldPath)))

export const updateBy = (
	table: string,
	field: string | string[],
	value: IndexableType,
	updates: { [key: string]: any } = {}
) =>
	new Promise((resolve, reject) =>
		db
			.table(table)
			.where(field)
			.equals(value)
			.first()
			.then(entity => {
				if (!entity) reject('Entity not found')
				else {
					db.table(table)
						.update(entity.id, updates)
						.then(updated => (updated ? resolve(getBy(table, field, value)) : reject('Failed to update entity')))
				}
			})
			.catch(reject)
	)

export const updateById = (table: string, id: number, updates: { [key: string]: any } = {}): Promise<any> =>
	new Promise((resolve, reject) =>
		db
			.table(table)
			.update(id, updates)
			.then(updated => (updated ? resolve(getById(table, id)) : reject('Entity not found after updating')))
			.catch(reject)
	)

export const bulkPut = (table: string, entities: any[]): Promise<any[]> =>
	new Promise((resolve, reject) =>
		db
			.table(table)
			.bulkPut(entities)
			.then(lastKey => resolve(entities))
			.catch(e => {
				const failedIds = e.failures.map(({ id }) => id)
				resolve(entities.filter(({ id }) => failedIds.indexOf(id) < 0))
			})
	)

export const removeById = (table: string, id: number): Promise<void> =>
	new Promise((resolve, reject) =>
		db
			.table(table)
			.delete(id)
			.then(resolve)
			.catch(reject)
	)

export const addFile = (blob: Blob) =>
	getHashFromBlob(blob)
		.then(hash => {
			console.log('FILE HASH', hash)
			return getFileByHash(hash)
				.then(existingFile => {
					console.log('EXISTING FILE', existingFile)
					return existingFile
				})
				.catch(message => {
					const file: FileType = {
						id: ++fileId,
						filename: (blob as any).name,
						size: blob.size,
						type: blob.type,
						date: (blob as any).lastModified,
						hash,
						blob,
					}
					return db
						.table('files')
						.add(file)
						.then(id => db.table('files').get(id))
				})
		})
		.catch(e => console.warn('Unable to get file hash', e))

export const getFileBy = (field: string | string[], value: any): Promise<FileEntity> => getBy('files', field, value)
export const getFileById = (id: number): Promise<FileEntity> => getFileBy('id', id)
export const getFileByHash = (hash: string): Promise<FileEntity> => getFileBy('hash', hash)
export const updateFileBy = (field: string | string[], value: any, updates: { [key: string]: any } = {}) =>
	updateBy('files', field, value, updates)
export const updateFileById = (id: number, updates: { [key: string]: any }) => updateById('files', id, updates)
export const updateFileByHash = (hash: string, updates: { [key: string]: any }) =>
	updateBy('files', 'hash', hash, updates)
