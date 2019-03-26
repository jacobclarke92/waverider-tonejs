import { ThunkDispatchType, MappingType } from '../types'
import { Action } from 'redux'
import { REMOVE_INSTRUMENT } from './instruments'
import { REMOVE_EFFECT } from './effects'
import _find from 'lodash/find'

import { getAll, truncate, bulkPut } from '../api/db'
import { defer } from '../utils/lifecycleUtils'

export const LOAD_MAPPINGS: string = 'LOAD_MAPPINGS'
export const RELOAD_MAPPINGS: string = 'RELOAD_MAPPINGS'
export const ADD_MAPPING: string = 'ADD_MAPPING'
export const REMOVE_MAPPING: string = 'REMOVE_MAPPING'

export const mappingsSchema = '++id,ownerId,ownerType,paramPath,min,max,[ownerId+ownerType]'

export type State = MappingType[]

export interface ActionObj extends Action {
	id?: number
	mappings?: State
	mapping?: MappingType
}

const initialState: State = []

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case RELOAD_MAPPINGS:
		case LOAD_MAPPINGS:
			return action.mappings || []
		case ADD_MAPPING:
			return [...state, action.mapping]
		case REMOVE_MAPPING:
			return state.filter(mapping => mapping.id !== action.id)
		case REMOVE_EFFECT:
		case REMOVE_INSTRUMENT:
			return state
	}
	return state
}

export const loadMappings = () => (dispatch: ThunkDispatchType) =>
	getAll<MappingType>('mappings')
		.then(mappings => {
			if (mappings.length > 0) return mappings
			return []
		})
		.then((mappings: MappingType[]) => defer(() => dispatch({ type: LOAD_MAPPINGS, mappings } as ActionObj)))
		.catch(e => console.warn('Unable to load desk state', e))

export const overwriteMappings = (mappings: MappingType[]) => (dispatch: ThunkDispatchType) =>
	truncate('mappings')
		.then(() => bulkPut<MappingType>('mappings', mappings))
		.then(() => getAll<MappingType>('mappings'))
		.then(mappings => defer(() => dispatch({ type: RELOAD_MAPPINGS, mappings } as ActionObj)))
