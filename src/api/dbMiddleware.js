import _merge from 'lodash/merge'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import { add, updateById } from './db'
import { dbUpdateDebounce } from '../constants/timings'
import { UPDATE_INSTRUMENT, ADD_INSTRUMENT, REMOVE_INSTRUMENT } from '../reducers/instruments'

const instrumentUpdates = {}
const instrumentUpdateFuncs = {}

export default ({getState}) => next => action => {

	const state = getState()
	
	switch(action.type) {
		case UPDATE_INSTRUMENT:
			if(!(action.id in instrumentUpdateFuncs)) {
				instrumentUpdateFuncs[action.id] = _debounce((id, updates) => {
					console.log('attempting to update', id, updates)
					updateById('instruments', id, updates)
						.then(instrument => {
							console.log('Instrument id '+id+' stored updates to db successfully', updates)
							delete instrumentUpdates[id]
						})
						.catch(e => console.warn('Unable to update instrument', e))
				}, dbUpdateDebounce)
			}

			instrumentUpdates[action.id] = _merge(_cloneDeep(instrumentUpdates[action.id] || {}), action.updates)
			instrumentUpdateFuncs[action.id](action.id, instrumentUpdates[action.id])
			break
	}

	const returnValue = next(action)
	return returnValue
}