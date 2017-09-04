import _cloneDeep from 'lodash/cloneDeep'

import { add, getAll, updateById } from '../api/db'
import instrumentLibrary from '../instrumentLibrary'

export const LOAD_INSTRUMENTS = 'LOAD_INSTRUMENTS'
export const ADD_INSTRUMENT = 'ADD_INSTRUMENT'
export const REMOVE_INSTRUMENT = 'REMOVE_INSTRUMENT'
export const UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT'

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case LOAD_INSTRUMENTS: return action.instruments || []
		case ADD_INSTRUMENT: return [...state, action.instrument]
		case UPDATE_INSTRUMENT: return state.map(instrument => instrument.id === action.instrument.id ? action.instrument : instrument)
	}
	return state
}

export const loadInstruments = () => dispatch => getAll('instruments')
	.then(instruments => dispatch({type: LOAD_INSTRUMENTS, instruments}))
	.catch(e => console.warn('Unable to load instruments', e))

export const addInstrument = type => {
	if(!instrumentLibrary[type]) return null
	const newInstrument = {type, ..._cloneDeep(instrumentLibrary[type].defaultValue)}
	return dispatch => add('instruments', newInstrument)
		.then(instrument => dispatch({type: ADD_INSTRUMENT, instrument}))
		.catch(e => console.warn('Unable to add instrument', newInstrument))
}

export const updateInstrument = (id, updates) => dispatch => updateById('instruments', id, updates)
	.then(instrument => dispatch({type: UPDATE_INSTRUMENT, instrument}))
	.catch(e => console.warn('Unable to update instrument', id, updates, e))