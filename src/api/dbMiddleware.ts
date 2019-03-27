import _merge from 'lodash/merge'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import { add, updateById } from './db'
import { dbUpdateDebounce } from '../constants/timings'
import { DESK_ITEM_MOVE } from '../reducers/desk'
import { UPDATE_INSTRUMENT, ADD_INSTRUMENT, REMOVE_INSTRUMENT } from '../reducers/instruments'
import { KeyedObject, DeskItemType, Instrument, ReduxStoreType, Effect, MappingType } from '../types'
import { UPDATE_EFFECT } from '../reducers/effects'
import { UPDATE_MAPPING } from '../reducers/mappings'

type DbUpdateObjects = { [key: number]: KeyedObject }
type DbUpdateFunction = (id: number, updates: KeyedObject) => void
type DbUpdateFunctions = { [key: number]: DbUpdateFunction }

const instrumentUpdates: DbUpdateObjects = {}
const instrumentUpdateFuncs: DbUpdateFunctions = {}

const effectUpdates: DbUpdateObjects = {}
const effectUpdateFuncs: DbUpdateFunctions = {}

const deskUpdates: DbUpdateObjects = {}
const deskUpdateFuncs: DbUpdateFunctions = {}

const mappingUpdates: DbUpdateObjects = {}
const mappingUpdateFuncs: DbUpdateFunctions = {}

function getUpdateFunction<T>(functionsObj: DbUpdateFunctions, table: string, id: number): DbUpdateFunction {
	if (!(id in functionsObj)) {
		functionsObj[id] = _debounce((id: number, updates: KeyedObject) => {
			updateById<T>(table, id, updates)
				.then(entity => {
					console.log(`${table} entity ${id} stored updates successfully`, updates)
					delete functionsObj[id]
				})
				.catch(e => console.warn(`Unable to update ${table} entity ${id}`))
		}, dbUpdateDebounce)
	}
	return functionsObj[id]
}

// TODO types for redux middleware
// export default ({ getState }: MiddlewareAPI): Middleware<ThunkDispatchType> => (next: ThunkDispatch) => (action) => {
export default ({ getState }) => next => action => {
	const state: ReduxStoreType = getState()
	let updateFunction: DbUpdateFunction

	switch (action.type) {
		case UPDATE_INSTRUMENT:
			instrumentUpdates[action.id] = _merge(_cloneDeep(instrumentUpdates[action.id] || {}), action.updates)
			updateFunction = getUpdateFunction<Instrument>(instrumentUpdateFuncs, 'instruments', action.id)
			updateFunction(action.id, instrumentUpdates[action.id])
			break

		case UPDATE_EFFECT:
			effectUpdates[action.id] = _merge(_cloneDeep(effectUpdates[action.id] || {}), action.updates)
			updateFunction = getUpdateFunction<Effect>(effectUpdateFuncs, 'effects', action.id)
			updateFunction(action.id, effectUpdates[action.id])
			break

		case DESK_ITEM_MOVE:
			deskUpdates[action.id] = _merge(_cloneDeep(deskUpdates[action.id] || {}), { position: action.position })
			updateFunction = getUpdateFunction<DeskItemType>(deskUpdateFuncs, 'desk', action.id)
			updateFunction(action.id, deskUpdates[action.id])
			break

		case UPDATE_MAPPING:
			mappingUpdates[action.id] = _merge(_cloneDeep(mappingUpdates[action.id] || {}), action.updates)
			updateFunction = getUpdateFunction<MappingType>(mappingUpdateFuncs, 'mappings', action.id)
			updateFunction(action.id, mappingUpdates[action.id])
			break
	}

	const returnValue = next(action)
	return returnValue
}
