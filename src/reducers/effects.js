import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import effectLibrary from '../effectLibrary'
import { deskItemTypeDefaults, EFFECT } from '../constants/deskItemTypes'
import { add, getAll, updateById } from '../api/db'

const initialState = []

export const LOAD_EFFECTS = 'LOAD_EFFECTS'
export const ADD_EFFECT = 'ADD_EFFECT'
export const REMOVE_EFFECT = 'REMOVE_EFFECT'
export const UPDATE_EFFECT = 'UPDATE_EFFECT'

export default function(state = initialState, action) {
	switch(action.type) {
		case LOAD_EFFECTS: return action.effects || []
		case ADD_EFFECT: return [...state, action.effect]
		case UPDATE_EFFECT: return state.map(effect => effect.id === action.id
			? _merge(_cloneDeep(effect), action.updates)
			: effect)
		case REMOVE_EFFECT: return state.filter(effect => effect.id !== action.id)
	}
	return state
}

export const loadEffects = () => dispatch => 
	getAll('effects')
		.then(effects => {
			if(effects.length > 0) return effects
			else return []
		})
		.then(effects => dispatch({type: LOAD_EFFECTS, effects}))
		.catch(e => console.warn('Unable to load effects', e))

export const addEffect = (type, position = {x: 0, y: 0}) => {
	const effectDef = effectLibrary[type]
	if(!effectDef) return null
	const newEffect = {enabled: true, type, ..._cloneDeep(effectDef.defaultValue)}
	const newDeskItem = {name: effectDef.name, ownerType: type, type: EFFECT, position, ...deskItemTypeDefaults[EFFECT]}
	return dispatch => 
		add('effects', newEffect)
			.then(effect => 
				add('desk', {...newDeskItem, ownerId: effect.id})
					.then(deskItem => dispatch({type: ADD_EFFECT, effect, deskItem})) 
					.catch(e => console.warn('Unable to add desk item for effect', deskItem, newEffect))
			)
			.catch(e => console.warn('Unable to add effect', newEffect))
}

export const updateEffect = (id, updates) => ({type: UPDATE_EFFECT, id, updates})

export const removeEffect = id => dispatch => 
	removeById('effects', id).then(() => 
		getBy('desk', 'ownerId', id).then(deskItem => 
			removeById('desk', deskItem.id).then(() =>
				dispatch({type: REMOVE_EFFECT, id})
			).catch(e => console.warn('Unable to remove desk item for effect', id, e))
		).catch(e => console.warn('Unable to find desk item for effect', id, e))
	).catch(e => console.warn('Unable to remove effect', id, e))
