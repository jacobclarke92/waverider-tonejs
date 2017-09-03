import { combineReducers } from 'redux'
import devices from './devices'
import instruments from './instruments'

const reducers = combineReducers({
	devices,
	instruments,
})

export default reducers