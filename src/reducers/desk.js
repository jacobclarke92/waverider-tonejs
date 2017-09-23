import { isArray, isObject } from '../utils/typeUtils'
import { deskItemTypeDefaults, MASTER, BUS, INSTRUMENT, FX, LFO } from '../constants/deskItemTypes'
import { ADD_INSTRUMENT, REMOVE_INSTRUMENT } from './instruments'

import { add, getAll, updateById } from '../api/db'

export const LOAD_DESK = 'LOAD_DESK'
export const DESK_ITEM_MOVE = 'DESK_ITEM_MOVE'
export const DESK_CONNECT_WIRE = 'DESK_CONNECT_WIRE'
export const DESK_DISCONNECT_WIRE = 'DESK_DISCONNECT_WIRE'

export const deskSchema = '++id,name,ownerId,ownerType,type,position'

const initialState = [
	{
		id: 1,
		name: 'Master',
		ownerId: 1,
		ownerType: 'master',
		type: INSTRUMENT,
		slug: 'master',
		position: {
			x: 500,
			y: 0,
		},
		...deskItemTypeDefaults[MASTER],
	},
]

export default function(state = initialState, action) {
	switch(action.type) {
		case LOAD_DESK: 
			return action.desk || []
		case DESK_ITEM_MOVE: 
			return state.map(item => item.id == action.id ? {...item, position: action.position} : item)
		case DESK_CONNECT_WIRE: 
		case DESK_DISCONNECT_WIRE: 
			return state.map(item => item.id == action.deskItem.id ? action.deskItem : item)
		case ADD_INSTRUMENT: return [...state, action.deskItem]
	}
	return state
}

export const loadDesk = () => dispatch => getAll('desk')
	.then(desk => {
		if(desk.length > 0) return desk
		return add('desk', initialState[0])
	})
	.then(desk => dispatch({type: LOAD_DESK, desk: isArray(desk) ? desk : [desk]}))
	.catch(e => console.warn('Unable to load desk state', e))

export const moveDeskItem = (deskItem, position) => ({type: DESK_ITEM_MOVE, id: deskItem.id, position})

export const connectWire = (wireFrom, wireTo, { wireType }) => {
	const outputs = wireFrom.deskItem[wireType+'Outputs'] || {}
	const newDeskItem = {
		[wireType+'Outputs']: {
			...outputs, 
			[wireTo.deskItem.ownerId]: {
				type: wireType,
				id: wireFrom.deskItem.ownerId+'___'+wireTo.deskItem.ownerId,
				wireFrom,
				wireTo,
			}
		}
	}
	return dispatch => 
		updateById('desk', wireFrom.deskItem.id, newDeskItem)
			.then(deskItem => dispatch({type: DESK_CONNECT_WIRE, deskItem}))
			.catch(e => console.warn('Unable to update desk item for wire connection', wireFrom))
}

export const disconnectWire = ({type, wireFrom, wireTo}) => {
	const outputs = wireFrom.deskItem[type+'Outputs'] || {}
	if(wireTo.deskItem.ownerId in outputs) delete outputs[wireTo.deskItem.ownerId]
	const newDeskItem = {[type+'Outputs']: outputs}
	return dispatch => 
		updateById('desk', wireFrom.deskItem.id, newDeskItem)
			.then(deskItem => dispatch({type: DESK_DISCONNECT_WIRE, deskItem}))
			.catch(e => console.warn('Unable to update desk item for wire disconnection', wireFrom))
}