import { combineReducers } from 'redux'
import lastAction from './lastAction'
import devices from './devices'
import instruments from './instruments'

const reducers = combineReducers({
	lastAction,
	devices,
	instruments,
})

export default reducers