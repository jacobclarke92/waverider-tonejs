import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import './css/styles.css'

import reducers from './reducers'
import { init as initMidi } from './api/midi'
import { loadInstruments } from './reducers/instruments'

import App from './App'

const store = createStore(reducers, {}, compose(applyMiddleware(thunk)))
window.logStore = () => console.log(store.getState())

store.dispatch(loadInstruments())

initMidi(store)

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'))