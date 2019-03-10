import React, { Component } from 'react'
import { connect } from 'react-redux'
import _find from 'lodash/find'

import { INSTRUMENT, EFFECT } from './constants/deskItemTypes'
import Header from './components/ui/Header'
import Sidebar from './components/ui/Sidebar'
import Navbar from './components/ui/Navbar'
import Views from './Views'
import PropertiesPanel from './components/ui/PropertiesPanel'
import effectLibrary from './effectLibrary'
import instrumentLibrary from './instrumentLibrary'
import { ReduxStoreType, ThunkDispatchProp } from './types'

import { State as GuiStore } from './reducers/gui'
import { State as EffectsStore } from './reducers/effects'
import { State as InstrumentsStore } from './reducers/instruments'
import PianoRoll from './components/ui/PianoRoll'

interface StateProps {
	gui: GuiStore
	effects: EffectsStore
	instruments: InstrumentsStore
}

class Main extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { gui, instruments = [], effects = [] } = this.props
		const { view, activeElement } = gui
		const View = Views[view]
		let effect = {}
		let instrument = {}
		let PropertiesComponent = null
		if (activeElement) {
			if (activeElement.type == INSTRUMENT) {
				const instrumentConstructor = instrumentLibrary[activeElement.element.ownerType]
				if (instrumentConstructor) {
					PropertiesComponent = instrumentConstructor.Editor
					instrument = _find(instruments, { id: activeElement.element.ownerId })
				}
			} else if (activeElement.type == EFFECT) {
				const effectConstructor = effectLibrary[activeElement.element.ownerType]
				if (effectConstructor) {
					PropertiesComponent = effectConstructor.Editor
					effect = _find(effects, { id: activeElement.element.ownerId })
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
						<div className="workspace">{View.Workspace && <View.Workspace />}</div>
						{activeElement && (
							<PropertiesPanel title={activeElement.element.name}>
								<PropertiesComponent {...instrument} />
							</PropertiesPanel>
						)}
						<div className="piano-panel">
							<PianoRoll octaveStart={1} octaves={8} />
						</div>
					</div>
				</main>
			</div>
		)
	}
}

export default connect(({ gui, effects, instruments }: ReduxStoreType): StateProps => ({ gui, effects, instruments }))(
	Main
)
