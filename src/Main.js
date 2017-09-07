import React, { Component } from 'react'

import InstrumentList from './components/InstrumentList'

export default class Main extends Component {
	render() {
		return (
			<div id="app">
				<InstrumentList />
			</div>
		)
	}
}