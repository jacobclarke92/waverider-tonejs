import React from 'react'
import ReactDOM from 'react-dom'
import './css/styles.css'

import { init as initMidi } from './midi'

import App from './App'

initMidi()

ReactDOM.render(<App />, document.getElementById('app'))