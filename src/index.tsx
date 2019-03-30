import React from 'react'
import ReactDOM from 'react-dom'
import Tone from 'tone'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { Provider } from 'react-redux'

import reducers from './reducers'
import dbMiddleware from './api/dbMiddleware'
import { init as initKeyListeners } from './utils/keyUtils'
import { init as initMidi } from './api/midi'
import { init as initDesk } from './deskController'
import { init as initEffects } from './effectsController'
import { init as initInstruments } from './instrumentsController'
import { init as initSequencers } from './sequencersController'
import { init as initMappings } from './mappingsController'
import { init as initFileManager } from './fileManager'
import { loadInstruments } from './reducers/instruments'
import { loadDevices } from './reducers/devices'
import { loadEffects } from './reducers/effects'
import { loadSequencers } from './reducers/sequencers'
import { loadDesk } from './reducers/desk'
import { loadMappings } from './reducers/mappings'

import App from './App'
import { ThunkDispatchType } from './types'

const store: Store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk, dbMiddleware)))
;(window as any).logStore = () => console.log(store.getState())

// Hack to enable Tone for chrome anti-autoplay measures
document.documentElement.addEventListener('mousedown', () => {
	// @ts-ignore
	if (Tone.context.state !== 'running') Tone.context.resume()
})

initMidi(store)
initDesk(store)
initEffects(store)
initInstruments(store)
initSequencers(store)
initMappings(store)
initFileManager(store)
initKeyListeners()
;(store.dispatch as ThunkDispatchType)(loadInstruments())
;(store.dispatch as ThunkDispatchType)(loadEffects())
;(store.dispatch as ThunkDispatchType)(loadSequencers())
;(store.dispatch as ThunkDispatchType)(loadDevices())
;(store.dispatch as ThunkDispatchType)(loadDesk())
;(store.dispatch as ThunkDispatchType)(loadMappings())

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
)
