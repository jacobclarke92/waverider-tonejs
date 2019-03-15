import { combineReducers } from 'redux'
import lastAction from './lastAction'
import project from './project'
import devices from './devices'
import instruments from './instruments'
import effects from './effects'
import desk from './desk'
import gui from './gui'

const reducers = combineReducers({
	lastAction,
	project,
	devices,
	instruments,
	effects,
	desk,
	gui,
})

export default reducers
