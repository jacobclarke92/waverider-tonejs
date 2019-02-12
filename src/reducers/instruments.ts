import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'

import { isArray } from '../utils/typeUtils'
import { add, getAll, getFirstWhere, updateById, removeById } from '../api/db'
import instrumentLibrary from '../instrumentLibrary'
import { deskItemTypeDefaults, INSTRUMENT, MASTER } from '../constants/deskItemTypes'
import { Instrument } from '../types';
import { Action } from 'redux';

export const LOAD_INSTRUMENTS = 'LOAD_INSTRUMENTS'
export const ADD_INSTRUMENT = 'ADD_INSTRUMENT'
export const REMOVE_INSTRUMENT = 'REMOVE_INSTRUMENT'
export const UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT'

export type State = Instrument[]

interface ReducerAction extends Action {
	id?: number
	instrument?: Instrument
	instruments?: Instrument[]
	updates?: any // TODO
}

const initialState:State = [
	{
		enabled: true,
		id: 1,
		type: 'master',
		instrument: { gain: 0.5 },
		midiChannel: null,
		midiDeviceId: null,
	},
]

export default function(state:State = initialState, action:ReducerAction) {
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

export const loadInstruments = () => dispatch =>
	getAll('instruments')
		.then(instruments => {
			if (instruments.length > 0) return instruments
			else return add('instruments', initialState[0])
		})
		.then(instruments =>
			dispatch({ type: LOAD_INSTRUMENTS, instruments: isArray(instruments) ? instruments : [instruments] } as ReducerAction)
		)
		.catch(e => console.warn('Unable to load instruments', e))

export const addInstrument = (type, position = { x: 0, y: 0 }) => {
	const instrumentDef = instrumentLibrary[type]
	if (!instrumentDef) return null
	const newInstrument = { enabled: true, type, ..._cloneDeep(instrumentDef.defaultValue) }
	const newDeskItem = {
		name: instrumentDef.name,
		ownerType: type,
		type: INSTRUMENT,
		position,
		...deskItemTypeDefaults[INSTRUMENT],
	}
	return dispatch =>
		add('instruments', newInstrument)
			.then(instrument =>
				add('desk', { ...newDeskItem, ownerId: instrument.id })
					.then(deskItem => dispatch({ type: ADD_INSTRUMENT, instrument, deskItem } as ReducerAction))
					.catch(e => console.warn('Unable to add desk item for instrument', newDeskItem, newInstrument))
			)
			.catch(e => console.warn('Unable to add instrument', newInstrument))
}

export const updateInstrument = (id, updates) => ({ type: UPDATE_INSTRUMENT, id, updates } as ReducerAction)

export const removeInstrument = id => dispatch =>
	removeById('instruments', id)
		.then(() =>
			getFirstWhere('desk', { type: INSTRUMENT, ownerId: id })
				.then(deskItem =>
					removeById('desk', deskItem.id)
						.then(() => dispatch({ type: REMOVE_INSTRUMENT, id } as ReducerAction))
						.catch(e => console.warn('Unable to remove desk item for instrument', id, e))
				)
				.catch(e => console.warn('Unable to find desk item for instrument', id, e))
		)
		.catch(e => console.warn('Unable to remove instrument', id, e))
