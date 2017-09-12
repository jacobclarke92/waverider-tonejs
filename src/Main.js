import React, { Component } from 'react'
import { connect } from 'react-redux'

import Header from './components/ui/Header'
import Sidebar from './components/ui/Sidebar'
import Navbar from './components/ui/Navbar'
import Views from './Views'
// import PropertiesPanel from './components/ui/PropertiesPanel'
// import InstrumentList from './components/InstrumentList'
// import DeskInterface from './components/DeskInterface'

class Main extends Component {
	render() {
		const { view } = this.props.gui
		const View = Views[view]
		return (
			<div className="app">
				<Header />
				<main className="main">
					<Sidebar Component={View.Sidebar} />
					<div className="workspace-container">
						<Navbar Component={View.Navbar} />
						<div className="workspace">
							{View.Workspace && <View.Workspace />}
						</div>
						{/*
						<div className="workspace">
							<DeskInterface />
							<InstrumentList />
						</div>
						<PropertiesPanel title="Properties">

						</PropertiesPanel>
					*/}
					</div>
				</main>
			</div>
		)
	}
}

export default connect(({gui}) => ({gui}))(Main)