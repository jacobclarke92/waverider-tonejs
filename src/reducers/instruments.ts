import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'

import { isArray } from '../utils/typeUtils'
import { add, getAll, getFirstWhere, updateById, removeById, truncate, bulkPut } from '../api/db'
import instrumentLibrary from '../instrumentLibrary'
import { deskItemTypeDefaults, INSTRUMENT, MASTER } from '../constants/deskItemTypes'
import { Instrument, DeskItemType, ThunkDispatchType } from '../types'
import { Action } from 'redux'
import { PointObj } from '../utils/Point'
import { defer } from '../utils/lifecycleUtils'

export const LOAD_INSTRUMENTS: string = 'LOAD_INSTRUMENTS'
export const ADD_INSTRUMENT: string = 'ADD_INSTRUMENT'
export const REMOVE_INSTRUMENT: string = 'REMOVE_INSTRUMENT'
export const UPDATE_INSTRUMENT: string = 'UPDATE_INSTRUMENT'

export type State = Instrument[]

export interface ActionObj extends Action {
	id?: number
	instrument?: Instrument
	instruments?: Instrument[]
	updates?: any // TODO
}

const initialState: State = [
	{
		enabled: true,
		id: 1,
		type: 'master',
		instrument: { gain: 0.5 },
		midiChannel: null,
		midiDeviceId: null,
	},
]

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case LOAD_INSTRUMENTS:
			return action.instruments || []
		case ADD_INSTRUMENT:
			return [...state, action.instrument]
		case UPDATE_INSTRUMENT:
			return state.map(instrument =>
				instrument.id === action.id ? _merge(_cloneDeep(instrument), action.updates) : instrument
			)
		case REMOVE_INSTRUMENT:
			return state.filter(instrument => instrument.id !== action.id)
	}
	return state
}

export const loadInstruments = () => (dispatch: ThunkDispatchType) =>
	getAll<Instrument>('instruments')
		.then(instruments => {
			if (instruments.length > 0) return instruments
			return add<Instrument>('instruments', initialState[0]).then(instrument => [instrument])
		})
		.then(instruments => defer(() => dispatch({ type: LOAD_INSTRUMENTS, instruments } as ActionObj)))
		.catch(e => console.warn('Unable to load instruments', e))

export const overwriteInstruments = (instruments: Instrument[]) => (dispatch: ThunkDispatchType) =>
	truncate('instruments')
		.then(() => bulkPut<Instrument>('instruments', instruments))
		.then(() => getAll<Instrument>('instruments'))
		.then(instruments => defer(() => dispatch({ type: LOAD_INSTRUMENTS, instruments } as ActionObj)))

export const addInstrument = (type: string, position: PointObj = { x: 0, y: 0 }) => {
	const instrumentDef = instrumentLibrary[type]
	if (!instrumentDef) return null

	const newInstrument: Instrument = {
		type,
		enabled: true,
		midiDeviceId: null,
		midiChannel: null,
		..._cloneDeep(instrumentDef.defaultValue),
	}
	return dispatch =>
		add<Instrument>('instruments', newInstrument)
			.then(instrument => {
				const newDeskItem: DeskItemType = {
					name: instrumentDef.name,
					slug: instrumentDef.slug,
					ownerType: type,
					ownerId: instrument.id,
					type: INSTRUMENT,
					position,
					...deskItemTypeDefaults[INSTRUMENT],
				}
				return add<DeskItemType>('desk', newDeskItem)
					.then(deskItem => defer(() => dispatch({ type: ADD_INSTRUMENT, instrument, deskItem } as ActionObj)))
					.catch(e => console.warn('Unable to add desk item for instrument', newDeskItem, newInstrument))
			})
			.catch(e => console.warn('Unable to add instrument', newInstrument))
}

export const updateInstrument = (id, updates) => ({ type: UPDATE_INSTRUMENT, id, updates } as ActionObj)

export const removeInstrument = (deskItem: DeskItemType) => dispatch =>
	removeById('instruments', deskItem.ownerId)
		.then(() =>
			removeById('desk', deskItem.id)
				.then(() => defer(() => dispatch({ type: REMOVE_INSTRUMENT, id: deskItem.ownerId } as ActionObj)))
				.catch(e => console.warn('Unable to remove desk item for instrument', deskItem, e))
		)
		.catch(e => console.warn('Unable to remove instrument', deskItem, e))
