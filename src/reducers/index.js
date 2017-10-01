import { combineReducers } from 'redux'
import lastAction from './lastAction'
import devices from './devices'
import instruments from './instruments'
import effects from './effects'
import desk from './desk'
import gui from './gui'

const reducers = combineReducers({
	lastAction,
	devices,
	instruments,
	effects,
	desk,
	gui,
})

export default reducers