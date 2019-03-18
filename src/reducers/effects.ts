import { Effect, DeskItemType, EffectType, ThunkDispatchType } from '../types'
import { Action } from 'redux'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import effectLibrary from '../effectLibrary'
import { getWiresRoutedTo } from '../deskController'
import { deskItemTypeDefaults, EFFECT } from '../constants/deskItemTypes'
import { add, getAll, getFirstWhere, updateById, removeById, truncate, bulkPut } from '../api/db'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'
import { disconnectWire, State as DeskStore } from './desk'

export type State = Effect[]

export interface ActionObj extends Action {
	id?: number
	updates?: any
	effects?: Effect[]
	effect?: Effect
	deskItem?: DeskItemType
	deadConnections?: DeskItemType[]
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

export const loadEffects = () => (dispatch: ThunkDispatchType) =>
	getAll<Effect>('effects')
		.then(effects => (effects.length > 0 ? effects : []))
		.then(effects => defer(() => dispatch({ type: LOAD_EFFECTS, effects } as ActionObj)))
		.catch(e => console.warn('Unable to load effects', e))

export const overwriteEffects = (effects: Effect[]) => (dispatch: ThunkDispatchType) =>
	truncate('effects')
		.then(() => bulkPut<Effect>('effects', effects))
		.then(() => getAll<Effect>('effects'))
		.then(effects => defer(() => dispatch({ type: LOAD_EFFECTS, effects } as ActionObj)))

export const addEffect = (type: string, position: PointObj = { x: 0, y: 0 }) => {
	const effectDef: EffectType = effectLibrary[type]
	if (!effectDef) return null

	const newEffect: Effect = {
		type,
		enabled: true,
		midiChannel: null,
		midiDeviceId: null,
		..._cloneDeep(effectDef.defaultValue),
	}
	return (dispatch: ThunkDispatchType) =>
		add<Effect>('effects', newEffect)
			.then(effect => {
				const newDeskItem: DeskItemType = {
					name: effectDef.name,
					slug: effectDef.slug,
					ownerType: type,
					ownerId: effect.id,
					type: EFFECT,
					position,
					...deskItemTypeDefaults[EFFECT],
				}
				return add<DeskItemType>('desk', newDeskItem)
					.then(deskItem => defer(() => dispatch({ type: ADD_EFFECT, effect, deskItem } as ActionObj)))
					.catch(e => console.warn('Unable to add desk item for effect', newDeskItem, newEffect))
			})
			.catch(e => console.warn('Unable to add effect', newEffect))
}

export const updateEffect = (id, updates) => ({ type: UPDATE_EFFECT, id, updates } as ActionObj)

export const removeEffect = (desk: DeskStore, deskItem: DeskItemType) => (dispatch: ThunkDispatchType) =>
	removeById('effects', deskItem.ownerId)
		.then(() =>
			removeById('desk', deskItem.id)
				.then(() => {
					const deadConnections = getWiresRoutedTo(deskItem)
					console.log('STRAY CONNECTIONS', deadConnections)
					defer(() => {
						if (deadConnections.length > 0)
							deadConnections.forEach(deadConnection => dispatch(disconnectWire(desk, deadConnection)))
						dispatch({ type: REMOVE_EFFECT, id: deskItem.ownerId } as ActionObj)
					})
				})
				.catch(e => console.warn('Unable to remove desk item for effect', deskItem, e))
		)
		.catch(e => console.warn('Unable to remove effect', deskItem, e))
