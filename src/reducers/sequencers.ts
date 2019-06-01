import { Sequencer, SequencerType, DeskItemType, ThunkDispatchType, KeyedObject, Device } from '../types'
import { Action } from 'redux'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import sequencerLibrary from '../sequencerLibrary'
import { getWiresRoutedTo } from '../deskController'
import { deskItemTypeDefaults, SEQUENCER } from '../constants/deskItemTypes'
import { add, getAll, removeById, truncate, bulkPut, removeBy } from '../api/db'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'
import { disconnectWire, State as DeskStore } from './desk'

export type State = Sequencer[]

export interface ActionObj extends Action {
	id?: number
	updates?: KeyedObject
	sequencers?: Sequencer[]
	sequencer?: Sequencer
	deskItem?: DeskItemType
	deadConnections?: DeskItemType[]
}

const initialState: State = []

export const LOAD_SEQUENCERS = 'LOAD_SEQUENCERS'
export const RELOAD_SEQUENCERS = 'RELOAD_SEQUENCERS'
export const ADD_SEQUENCER = 'ADD_SEQUENCER'
export const REMOVE_SEQUENCER = 'REMOVE_SEQUENCER'
export const UPDATE_SEQUENCER = 'UPDATE_SEQUENCER'

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case RELOAD_SEQUENCERS:
		case LOAD_SEQUENCERS:
			return action.sequencers || []
		case ADD_SEQUENCER:
			return [...state, action.sequencer]
		case UPDATE_SEQUENCER:
			return state.map(sequencer => {
				if (sequencer.id === action.id) return _merge(_cloneDeep(sequencer), action.updates)
				return sequencer
			})
		case REMOVE_SEQUENCER:
			return state.filter(sequencer => sequencer.id !== action.id)
	}
	return state
}

export const loadSequencers = () => (dispatch: ThunkDispatchType) =>
	getAll<Sequencer>('sequencers')
		.then(sequencers => (sequencers.length > 0 ? sequencers : []))
		.then(sequencers => defer(() => dispatch({ type: LOAD_SEQUENCERS, sequencers } as ActionObj)))
		.catch(e => console.warn('Unable to load sequencers', e))

export const overwriteSequencers = (sequencers: Sequencer[]) => (dispatch: ThunkDispatchType) =>
	truncate('sequencers')
		.then(() => bulkPut<Sequencer>('sequencers', sequencers))
		.then(() => getAll<Sequencer>('sequencers'))
		.then(sequencers => defer(() => dispatch({ type: RELOAD_SEQUENCERS, sequencers } as ActionObj)))

export const addSequencer = (type: string, position: PointObj = { x: 0, y: 0 }) => {
	const sequencerDef: SequencerType = sequencerLibrary[type]
	if (!sequencerDef) return null

	const newSequencer: Sequencer = {
		type,
		enabled: true,
		..._cloneDeep(sequencerDef.defaultValue),
	}
	return (dispatch: ThunkDispatchType) =>
		add<Sequencer>('sequencers', newSequencer)
			.then(sequencer => {
				const newDeskItem: DeskItemType = {
					name: sequencerDef.name,
					slug: sequencerDef.slug,
					ownerType: type,
					ownerId: sequencer.id,
					type: SEQUENCER,
					position,
					...deskItemTypeDefaults[SEQUENCER],
				}
				return add<DeskItemType>('desk', newDeskItem)
					.then(deskItem => {
						const newDevice: Device = {
							id: sequencerDef.slug + sequencer.id,
							name: sequencerDef.name,
							type: 'input',
							disconnected: false,
							state: 'connected',
							connection: 'open',
							sequencerId: sequencer.id,
						} as Device
						return add<Device>('devices', newDevice)
							.then(device => defer(() => dispatch({ type: ADD_SEQUENCER, sequencer, deskItem, device } as ActionObj)))
							.catch(e => console.warn('Unsable to add device for sequencer', newDeskItem, newSequencer, newDevice))
					})
					.catch(e => console.warn('Unable to add desk item for sequencer', newDeskItem, newSequencer))
			})
			.catch(e => console.warn('Unable to add sequencer', newSequencer))
}

export const updateSequencer = (id: number, updates: KeyedObject) =>
	({ type: UPDATE_SEQUENCER, id, updates } as ActionObj)

export const removeSequencer = (desk: DeskStore, deskItem: DeskItemType) => (dispatch: ThunkDispatchType) =>
	removeById('sequencers', deskItem.ownerId)
		.then(() =>
			removeById('desk', deskItem.id)
				.then(() => {
					removeBy('devices', 'sequencerId', deskItem.ownerId).then(() => {
						const deadConnections = getWiresRoutedTo(deskItem)
						console.log('STRAY CONNECTIONS', deadConnections)
						defer(() => {
							if (deadConnections.length > 0)
								deadConnections.forEach(deadConnection => dispatch(disconnectWire(desk, deadConnection)))
							dispatch({ type: REMOVE_SEQUENCER, id: deskItem.ownerId } as ActionObj)
						})
					})
				})
				.catch(e => console.warn('Unable to remove desk item for sequencer', deskItem, e))
		)
		.catch(e => console.warn('Unable to remove sequencer', deskItem, e))
