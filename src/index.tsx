import React from 'react'
import ReactDOM from 'react-dom'
import Tone from 'tone'
import thunk from 'redux-thunk'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import reducers from './reducers'
import dbMiddleware from './api/dbMiddleware'
import { init as initKeyListeners } from './utils/keyUtils'
import { init as initMidi } from './api/midi'
import { init as initDesk } from './deskController'
import { init as initEffects } from './effectsController'
import { init as initInstruments } from './instrumentsController'
import { loadInstruments } from './reducers/instruments'
import { loadDevices } from './reducers/devices'
import { loadEffects } from './reducers/effects'
import { loadDesk } from './reducers/desk'

import App from './App'
import { ThunkDispatchType } from './types'

const store = createStore(reducers, {}, compose(applyMiddleware(thunk, dbMiddleware)))
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
initKeyListeners()
;(store.dispatch as ThunkDispatchType)(loadInstruments())
;(store.dispatch as ThunkDispatchType)(loadEffects())
;(store.dispatch as ThunkDispatchType)(loadDevices())
;(store.dispatch as ThunkDispatchType)(loadDesk())

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
)
