import React, { Component } from 'react'

import InstrumentList from './components/InstrumentList'
import KnobInput from './components/input/KnobInput'

export default class Main extends Component {
	render() {
		return (
			<div id="app">
				<KnobInput extraValues={[80, 110]} />
				<InstrumentList />
			</div>
		)
	}
}