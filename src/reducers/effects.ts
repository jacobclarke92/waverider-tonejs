import { Effect, DeskItemType } from '../types'
import { Action } from 'redux'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import effectLibrary from '../effectLibrary'
import { getDeskItemsConnectedTo } from '../deskController'
import { deskItemTypeDefaults, EFFECT } from '../constants/deskItemTypes'
import { add, getAll, getFirstWhere, updateById, removeById } from '../api/db'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'

export type State = Effect[]

export interface ActionObj extends Action {
	id?: number
	updates?: any
	effects?: Effect[]
	effect?: Effect
	deskItem?: DeskItemType
}

const initialState: State = []

export const LOAD_EFFECTS = 'LOAD_EFFECTS'
export const ADD_EFFECT = 'ADD_EFFECT'
export const REMOVE_EFFECT = 'REMOVE_EFFECT'
export const UPDATE_EFFECT = 'UPDATE_EFFECT'

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case LOAD_EFFECTS:
			return action.effects || []
		case ADD_EFFECT:
			return [...state, action.effect]
		case UPDATE_EFFECT:
			return state.map(effect => (effect.id === action.id ? _merge(_cloneDeep(effect), action.updates) : effect))
		case REMOVE_EFFECT:
			return state.filter(effect => effect.id !== action.id)
	}
	return state
}

export const loadEffects = () => dispatch =>
	getAll('effects')
		.then(effects => {
			if (effects.length > 0) return effects
			else return []
		})
		.then(effects => defer(() => dispatch({ type: LOAD_EFFECTS, effects } as ActionObj)))
		.catch(e => console.warn('Unable to load effects', e))

export const addEffect = (type, position: PointObj = { x: 0, y: 0 }) => {
	const effectDef = effectLibrary[type]
	if (!effectDef) return null
	const newEffect = { enabled: true, type, ..._cloneDeep(effectDef.defaultValue) }
	const newDeskItem = { name: effectDef.name, ownerType: type, type: EFFECT, position, ...deskItemTypeDefaults[EFFECT] }
	return dispatch =>
		add('effects', newEffect)
			.then(effect =>
				add('desk', { ...newDeskItem, ownerId: effect.id })
					.then(deskItem => defer(() => dispatch({ type: ADD_EFFECT, effect, deskItem } as ActionObj)))
					.catch(e => console.warn('Unable to add desk item for effect', newDeskItem, newEffect))
			)
			.catch(e => console.warn('Unable to add effect', newEffect))
}

export const updateEffect = (id, updates) => ({ type: UPDATE_EFFECT, id, updates } as ActionObj)

export const removeEffect = id => dispatch =>
	removeById('effects', id)
		.then(() =>
			getFirstWhere('desk', { type: EFFECT, ownerId: id })
				.then(deskItem =>
					removeById('desk', deskItem.id)
						.then(() => {
							const connections = getDeskItemsConnectedTo(deskItem)
							console.log('STRAY CONNECTIONS', connections)
							defer(() => dispatch({ type: REMOVE_EFFECT, id } as ActionObj))
						})
						.catch(e => console.warn('Unable to remove desk item for effect', id, e))
				)
				.catch(e => console.warn('Unable to find desk item for effect', id, e))
		)
		.catch(e => console.warn('Unable to remove effect', id, e))
