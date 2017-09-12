import _merge from 'lodash/merge'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import { add, updateById } from './db'
import { dbUpdateDebounce } from '../constants/timings'
import { DESK_ITEM_MOVE } from '../reducers/desk'
import { UPDATE_INSTRUMENT, ADD_INSTRUMENT, REMOVE_INSTRUMENT } from '../reducers/instruments'

const instrumentUpdates = {}
const instrumentUpdateFuncs = {}

const deskUpdates = {}
const deskUpdateFuncs = {}

function getUpdateFunction(functionsObj, table, id) {
	if(!(id in functionsObj)) {
		functionsObj[id] = _debounce((id, updates) => {
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

export default ({getState}) => next => action => {

	const state = getState()
	let updateFunction = null

	switch(action.type) {
		case UPDATE_INSTRUMENT:
			instrumentUpdates[action.id] = _merge(_cloneDeep(instrumentUpdates[action.id] || {}), action.updates)
			updateFunction = getUpdateFunction(instrumentUpdateFuncs, 'instruments', action.id)
			updateFunction(action.id, instrumentUpdates[action.id])
			break

		case DESK_ITEM_MOVE:
			deskUpdates[action.id] = _merge(_cloneDeep(deskUpdates[action.id] || {}), {position: action.position})
			updateFunction = getUpdateFunction(instrumentUpdateFuncs, 'desk', action.id)
			updateFunction(action.id, deskUpdates[action.id])
			break
	}

	const returnValue = next(action)
	return returnValue
}