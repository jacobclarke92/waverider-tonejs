import { Wire, WireType, ThunkDispatchType, DeskItemType } from '../types'
import { Action } from 'redux'
import { isArray } from '../utils/typeUtils'
import { deskItemTypeDefaults, MASTER, BUS, INSTRUMENT, EFFECT, LFO } from '../constants/deskItemTypes'
import { ADD_INSTRUMENT, REMOVE_INSTRUMENT } from './instruments'
import { ADD_EFFECT, REMOVE_EFFECT } from './effects'

import { add, getAll, updateById } from '../api/db'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'

export const LOAD_DESK: string = 'LOAD_DESK'
export const DESK_ITEM_MOVE: string = 'DESK_ITEM_MOVE'
export const DESK_CONNECT_WIRE: string = 'DESK_CONNECT_WIRE'
export const DESK_DISCONNECT_WIRE: string = 'DESK_DISCONNECT_WIRE'

export const deskSchema = '++id,name,ownerId,ownerType,type,position,[type+ownerId]'

export type State = DeskItemType[]

export interface ActionObj extends Action {
	id?: number
	position?: PointObj
	deskItem?: DeskItemType
	desk?: any // TODO
	deadConnections?: DeskItemType[]
}

const initialState: State = [
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

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case LOAD_DESK:
			return action.desk || []
		case DESK_ITEM_MOVE:
			return state.map(item => (item.id == action.id ? { ...item, position: action.position } : item))
		case DESK_CONNECT_WIRE:
		case DESK_DISCONNECT_WIRE:
			return state.map(item => (item.id == action.deskItem.id ? action.deskItem : item))
		case ADD_INSTRUMENT:
		case ADD_EFFECT:
			return [...state, action.deskItem]
		case REMOVE_EFFECT:
			if (action.deadConnections) {
				console.log('removing dead connections')
				state = state.map(deskItem => {
					if (deskItem.audioOutput && action.id in deskItem.audioOutputs) {
						console.log('severing output to deleted effect from', deskItem)
						delete deskItem.audioOutput[action.id]
					}
					return deskItem
				})
			}
		case REMOVE_INSTRUMENT:
			return state.filter(deskItem => deskItem.ownerId !== action.id)
	}
	return state
}

export const loadDesk = () => (dispatch: ThunkDispatchType) =>
	getAll('desk')
		.then(desk => {
			if (desk.length > 0) return desk
			return add('desk', initialState[0])
		})
		.then(desk => defer(() => dispatch({ type: LOAD_DESK, desk: isArray(desk) ? desk : [desk] } as ActionObj)))
		.catch(e => console.warn('Unable to load desk state', e))

export const moveDeskItem = (deskItem: DeskItemType, position: PointObj) =>
	({
		type: DESK_ITEM_MOVE,
		id: deskItem.id,
		position,
	} as ActionObj)

export const connectWire = (wireFrom: Wire, wireTo: Wire, { wireType }: { wireType: WireType }) => {
	const outputs = wireFrom.deskItem[wireType + 'Outputs'] || {}
	const newDeskItem = {
		[wireType + 'Outputs']: {
			...outputs,
			[wireTo.deskItem.ownerId]: {
				type: wireType,
				id: `${wireFrom.deskItem.type + wireFrom.deskItem.ownerId}___${wireTo.deskItem.type + wireTo.deskItem.ownerId}`,
				wireFrom,
				wireTo,
			},
		},
	}
	return (dispatch: ThunkDispatchType) =>
		updateById('desk', wireFrom.deskItem.id, newDeskItem)
			.then(deskItem => defer(() => dispatch({ type: DESK_CONNECT_WIRE, deskItem } as ActionObj)))
			.catch(e => console.warn('Unable to update desk item for wire connection', wireFrom))
}

export const disconnectWire = ({ type, wireFrom, wireTo }: { type: WireType; wireFrom: Wire; wireTo: Wire }) => {
	const outputs = wireFrom.deskItem[type + 'Outputs'] || {}
	if (wireTo.deskItem.ownerId in outputs) delete outputs[wireTo.deskItem.ownerId]
	const newDeskItem = { [type + 'Outputs']: outputs }
	return (dispatch: ThunkDispatchType) =>
		updateById('desk', wireFrom.deskItem.id, newDeskItem)
			.then(deskItem => defer(() => dispatch({ type: DESK_DISCONNECT_WIRE, deskItem } as ActionObj)))
			.catch(e => {
				console.warn('Unable to update desk item for wire disconnection', wireFrom)
				return false
			})
}
