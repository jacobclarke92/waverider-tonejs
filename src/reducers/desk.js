import * as DeskItemTypes  from '../constants/deskItemTypes'
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
		ownerId: 'master',
		ownerType: null,
		type: DeskItemTypes.MASTER,
		slug: 'master',
		position: {
			x: 500,
			y: 0,
		}
	},
]

export default function(state = initialState, action) {
	switch(action.type) {
		case LOAD_DESK: 
			return action.desk || []
		case DESK_ITEM_MOVE: 
			return state.map(item => item.id == action.id ? {...item, position: action.position} : item)
		case DESK_CONNECT_WIRE: 
			return state.map(item => {
				if(item.ownerId === action.output.ownerId) {
					const outputs = item[action.wireType+'Outputs']
					if(!(action.input.ownerId in outputs)) return {
						...item, 
						[action.wireType+'Outputs']: {
							...outputs, 
							[action.input.ownerId]: {
								inputParam: action.inputParam,
								outputPosition: action.outputPosition, 
								inputPosition: action.inputPosition
							}
						}
					}
				}
				return item
			})
		case DESK_DISCONNECT_WIRE:
			return state.map(item => {
				if(item.ownerId === action.outputOwnerId) {
					const outputs = {...item[action.wireType+'Outputs']}
					if(action.inputOwnerId in outputs) {
						delete outputs[action.inputOwnerId]
						return {...item, [action.wireType+'Outputs']: outputs}
					}
				}
				return item
			})

		case ADD_INSTRUMENT: return [...state, action.deskItem]
	}
	return state
}

export const loadDesk = () => dispatch => getAll('desk')
	.then(desk => {
		if(desk.length > 0) return desk
		return add('desk', initialState[0])
	})
	.then(desk => dispatch({type: LOAD_DESK, desk}))
	.catch(e => console.warn('Unable to load desk state', e))

export const moveDeskItem = (deskItem, position) => ({type: DESK_ITEM_MOVE, id: deskItem.id, position})

/**
 * @param  {String} wireType 	- either 'audio' or 'data'
 * @param  {Object} output 		- reference to item in desk store
 * @param  {Object} input 		- reference to item in desk store
 * @param  {PIXI} outputNode 	- reference to PIXI DeskItem wire 'node'
 * @param  {PIXI} inputNode		- reference to PIXI DeskItem wire 'node'
 * @return {Object} 			Returns reducer action
 */
export function connectWire(wireType, output, input, outputNode, inputNode) {
	return {
		type: DESK_CONNECT_WIRE, 
		output, 
		input, 
		wireType,
		outputPosition: outputNode.position,
		inputPosition: inputNode.position,
		inputParam: inputNode.param || null,
	}
}