import _merge from 'lodash/merge'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import { add, updateById } from './db'
import { dbUpdateDebounce } from '../constants/timings'
import { DESK_ITEM_MOVE } from '../reducers/desk'
import { UPDATE_INSTRUMENT, ADD_INSTRUMENT, REMOVE_INSTRUMENT } from '../reducers/instruments'
import { KeyedObject } from '../types';

type DbUpdateObjects = {[key: number]: KeyedObject}
type DbUpdateFunction = (id: number, updates: KeyedObject) => void
type DbUpdateFunctions = {[key: number]: DbUpdateFunction}

const instrumentUpdates:DbUpdateObjects = {}
const instrumentUpdateFuncs:DbUpdateFunctions = {}

const deskUpdates:DbUpdateObjects = {}
const deskUpdateFuncs:DbUpdateFunctions = {}

function getUpdateFunction(functionsObj:DbUpdateFunctions, table: string, id: number):DbUpdateFunction {
	if (!(id in functionsObj)) {
		functionsObj[id] = _debounce((id: number, updates: KeyedObject) => {
			updateById(table, id, updates)
				.then(entity => {
					console.log(`${table} entity ${id} stored updates successfully`, updates)
					delete functionsObj[id]
				})
				.catch(e => console.warn(`Unable to update ${table} entity ${id}`))
		}, dbUpdateDebounce)
	}
	return functionsObj[id]
}

export default ({ getState }) => next => action => { // TODO
	const state = getState()
	let updateFunction: DbUpdateFunction

	switch (action.type) {
		case UPDATE_INSTRUMENT:
			instrumentUpdates[action.id] = _merge(_cloneDeep(instrumentUpdates[action.id] || {}), action.updates)
			updateFunction = getUpdateFunction(instrumentUpdateFuncs, 'instruments', action.id)
			updateFunction(action.id, instrumentUpdates[action.id])
			break

		case DESK_ITEM_MOVE:
			deskUpdates[action.id] = _merge(_cloneDeep(deskUpdates[action.id] || {}), { position: action.position })
			updateFunction = getUpdateFunction(instrumentUpdateFuncs, 'desk', action.id)
			updateFunction(action.id, deskUpdates[action.id])
			break
	}

	const returnValue = next(action)
	return returnValue
}