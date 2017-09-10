import { combineReducers } from 'redux'
import lastAction from './lastAction'
import devices from './devices'
import instruments from './instruments'
import desk from './desk'

const reducers = combineReducers({
	lastAction,
	devices,
	instruments,
	desk,
})

export default reducers