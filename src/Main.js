import React, { Component } from 'react'

import Header from './components/ui/Header'
import Sidebar from './components/ui/Sidebar'
import Navbar from './components/ui/Navbar'
import PropertiesPanel from './components/ui/PropertiesPanel'
import InstrumentList from './components/InstrumentList'
import DeskInterface from './components/DeskInterface'

export default class Main extends Component {
	render() {
		return (
			<div className="app">
				<Header />
				<main className="main">
					<Sidebar />
					<div className="stage-container">
						<Navbar />
						<div className="stage">
							<DeskInterface />
							<InstrumentList />
						</div>
						<PropertiesPanel title="Properties">

						</PropertiesPanel>
					</div>
				</main>
			</div>
		)
	}
}