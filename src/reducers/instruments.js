import { getAll } from '../api/db'

export const LOAD_INSTRUMENTS = 'LOAD_INSTRUMENTS'
export const ADD_INSTRUMENT = 'ADD_INSTRUMENT'
export const REMOVE_INSTRUMENT = 'REMOVE_INSTRUMENT'

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case LOAD_INSTRUMENTS: return action.instruments || []
	}
	return state
}

export const loadInstruments = () => dispatch => getAll('instruments')
	.then(instruments => dispatch({type: LOAD_INSTRUMENTS, instruments}))
	.catch(e => console.warn('Unable to load instruments', e))