import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import './css/styles.css'

import reducers from './reducers'
import { init as initKeyListeners } from './utils/keyUtils'
import { init as initMidi } from './api/midi'
import { init as initDesk } from './deskController'
import { init as initEffects } from './effectsController'
import { init as initInstruments } from './instrumentsController'
import { loadInstruments } from './reducers/instruments'
import { loadDevices } from './reducers/devices'
// import { loadEffects } from './reducers/effects'
import { loadDesk } from './reducers/desk'

import App from './App'

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)))
window.logStore = () => console.log(store.getState())

initMidi(store)
initDesk(store)
initEffects(store)
initInstruments(store)
initKeyListeners()

store.dispatch(loadInstruments())
store.dispatch(loadDevices())


ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))