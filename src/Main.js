import React, { Component } from 'react'
import { connect } from 'react-redux'
import _find from 'lodash/find'

import { INSTRUMENT } from './constants/deskItemTypes'
import Header from './components/ui/Header'
import Sidebar from './components/ui/Sidebar'
import Navbar from './components/ui/Navbar'
import Views from './Views'
import PropertiesPanel from './components/ui/PropertiesPanel'
import instrumentLibrary from './instrumentLibrary'
// import InstrumentList from './components/InstrumentList'
// import DeskInterface from './components/DeskInterface'

class Main extends Component {
	render() {
		const { gui, instruments } = this.props
		const { view, activeElement } = this.props.gui
		const View = Views[view]
		let instrument = {}
		let PropertiesComponent = null
		if(activeElement) {
			if(activeElement.type == INSTRUMENT) {
				const instrumentConstructor = instrumentLibrary[activeElement.element.ownerType]
				if(instrumentConstructor) {
					PropertiesComponent = instrumentConstructor.Editor
					instrument = _find(instruments, {id: activeElement.element.ownerId})
				}
			}
		}
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
						{activeElement && 
							<PropertiesPanel title={activeElement.element.name}>
								<PropertiesComponent {...instrument} />
							</PropertiesPanel>
						}
					</div>
				</main>
			</div>
		)
	}
}

export default connect(({gui, instruments}) => ({gui, instruments}))(Main)