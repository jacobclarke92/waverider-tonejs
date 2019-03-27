import React, { Component, ElementType } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _find from 'lodash/find'

import { INSTRUMENT, EFFECT } from './constants/deskItemTypes'
import Header from './components/ui/Header'
import Sidebar from './components/ui/Sidebar'
import Navbar from './components/ui/Navbar'
import Views from './Views'
import PropertiesPanel from './components/ui/PropertiesPanel'
import effectLibrary from './effectLibrary'
import instrumentLibrary from './instrumentLibrary'
import { ReduxStoreType, ThunkDispatchProp, GenericProps } from './types'

import { State as GuiStore } from './reducers/gui'
import { State as EffectsStore } from './reducers/effects'
import { State as InstrumentsStore } from './reducers/instruments'
import PianoRoll from './components/ui/PianoRoll'
import EffectPropertiesPanelDefault from './components/propertyPanels/effects/EffectPropertiesPanelDefault'

interface StateProps {
	gui: GuiStore
	effects: EffectsStore
	instruments: InstrumentsStore
}

class Main extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { gui, instruments = [], effects = [] } = this.props
		const { view, activeElement, keyboardPianoEnabled } = gui
		const View = Views[view]
		let PropertiesComponent: ElementType = null
		let propertiesProps: GenericProps = {}
		if (activeElement) {
			if (activeElement.type == INSTRUMENT) {
				const instrumentConstructor = instrumentLibrary[activeElement.element.ownerType]
				if (instrumentConstructor) {
					PropertiesComponent = instrumentConstructor.Editor
					propertiesProps = _find(instruments, { id: activeElement.element.ownerId }) || {}
					propertiesProps.params = instrumentConstructor.params
					propertiesProps.defaultValue = instrumentConstructor.defaultValue
				}
			} else if (activeElement.type == EFFECT) {
				const effectConstructor = effectLibrary[activeElement.element.ownerType]
				if (effectConstructor) {
					PropertiesComponent = effectConstructor.Editor
					if (!PropertiesComponent) PropertiesComponent = EffectPropertiesPanelDefault
					propertiesProps = _find(effects, { id: activeElement.element.ownerId }) || {}
					propertiesProps.params = effectConstructor.params
					propertiesProps.defaultValue = effectConstructor.defaultValue
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
								<PropertiesComponent {...propertiesProps} />
							</PropertiesPanel>
						)}
						<div className={cn('piano-panel', { collapsed: !keyboardPianoEnabled })} style={{ height: 100 }}>
							<PianoRoll octaveStart={1} octaves={8} height={100} />
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
