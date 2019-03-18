import { Wire, WireType, ThunkDispatchType, DeskItemType, WireJoin, DeskItem } from '../types'
import { Action } from 'redux'
import { isArray } from '../utils/typeUtils'
import { deskItemTypeDefaults, MASTER, BUS, INSTRUMENT, EFFECT, LFO } from '../constants/deskItemTypes'
import { ADD_INSTRUMENT, REMOVE_INSTRUMENT } from './instruments'
import { ADD_EFFECT, REMOVE_EFFECT } from './effects'
import _find from 'lodash/find'

import { add, getAll, updateById, truncate, bulkPut } from '../api/db'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'

export const LOAD_DESK: string = 'LOAD_DESK'
export const DESK_ITEM_MOVE: string = 'DESK_ITEM_MOVE'
export const DESK_CONNECT_WIRE: string = 'DESK_CONNECT_WIRE'
export const DESK_DISCONNECT_WIRE: string = 'DESK_DISCONNECT_WIRE'
export const REINIT_INSTRUMENT_INSTANCE: string = 'REINIT_INSTRUMENT_INSTANCE'

export const deskSchema = '++id,name,ownerId,ownerType,type,position,[type+ownerId]'

export type State = DeskItemType[]

export interface ActionObj extends Action {
	id?: number
	position?: PointObj
	deskItem?: DeskItemType
	desk?: DeskItemType[] // TODO
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
		case REMOVE_INSTRUMENT:
			const deskItemType: DeskItem = action.type == REMOVE_EFFECT ? EFFECT : INSTRUMENT
			const outputKey = `${deskItemType}${action.id}`
			return state
				.filter(deskItem => !(deskItem.ownerId == action.id && deskItem.type === deskItemType))
				.map(deskItem => {
					if (deskItem.audioOutput && outputKey in deskItem.audioOutputs) {
						console.log('severing output to deleted effect from', deskItem)
						delete deskItem.audioOutput[outputKey]
					}
					return deskItem
				})
	}
	return state
}

export const loadDesk = () => (dispatch: ThunkDispatchType) =>
	getAll<DeskItemType>('desk')
		.then(desk => {
			if (desk.length > 0) return desk
			return add<DeskItemType>('desk', initialState[0]).then(deskItem => [deskItem])
		})
		.then((desk: DeskItemType[]) => defer(() => dispatch({ type: LOAD_DESK, desk } as ActionObj)))
		.catch(e => console.warn('Unable to load desk state', e))

export const overwriteDesk = action => dispatch =>
	truncate('desk')
		.then(() => bulkPut<DeskItemType>('desk', action.desk))
		.then(() => getAll<DeskItemType>('desk'))
		.then(desk => defer(() => dispatch({ type: LOAD_DESK, desk } as ActionObj)))

export const moveDeskItem = (deskItem: DeskItemType, position: PointObj) =>
	({
		type: DESK_ITEM_MOVE,
		id: deskItem.id,
		position,
	} as ActionObj)

export const connectWire = (desk: State, wireFrom: Wire, wireTo: Wire, { wireType }: { wireType: WireType }) => {
	const fromDeskItem = _find(desk, { id: wireFrom.deskItemId })
	const toDeskItem = _find(desk, { id: wireTo.deskItemId })
	const outputs = fromDeskItem[wireType + 'Outputs'] || {}
	const newDeskItem = {
		[wireType + 'Outputs']: {
			...outputs,
			[`${toDeskItem.type}${toDeskItem.ownerId}`]: {
				type: wireType,
				id: `${fromDeskItem.type + fromDeskItem.ownerId}___${toDeskItem.type + toDeskItem.ownerId}`,
				wireFrom,
				wireTo,
			},
		},
	}
	return (dispatch: ThunkDispatchType) =>
		updateById<DeskItemType>('desk', wireFrom.deskItemId, newDeskItem)
			.then(deskItem => defer(() => dispatch({ type: DESK_CONNECT_WIRE, deskItem } as ActionObj)))
			.catch(e => console.warn('Unable to update desk item for wire connection', wireFrom))
}

export const disconnectWire = (desk: State, wireJoin: WireJoin) => {
	const { type, wireFrom, wireTo } = wireJoin
	const fromDeskItem = _find(desk, { id: wireFrom.deskItemId })
	const toDeskItem = _find(desk, { id: wireTo.deskItemId })

	const outputGroupKey = `${type}Outputs`
	const outputKey = `${toDeskItem.type}${toDeskItem.ownerId}`

	const outputs = fromDeskItem[outputGroupKey] || {}
	if (outputKey in outputs) delete outputs[outputKey]
	const newDeskItem = { [outputGroupKey]: outputs }

	return (dispatch: ThunkDispatchType) =>
		updateById<DeskItemType>('desk', wireFrom.deskItemId, newDeskItem)
			.then(deskItem => defer(() => dispatch({ type: DESK_DISCONNECT_WIRE, deskItem } as ActionObj)))
			.catch(e => {
				console.warn('Unable to update desk item for wire disconnection', wireFrom)
				return false
			})
}
