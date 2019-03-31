import { combineReducers } from 'redux'
import lastAction from './lastAction'
import project from './project'
import devices from './devices'
import instruments from './instruments'
import effects from './effects'
import sequencers from './sequencers'
import desk from './desk'
import mappings from './mappings'
import gui from './gui'
import transport from './transport'

const reducers = combineReducers({
	lastAction,
	project,
	devices,
	instruments,
	effects,
	sequencers,
	desk,
	mappings,
	gui,
	transport,
})

export default reducers
