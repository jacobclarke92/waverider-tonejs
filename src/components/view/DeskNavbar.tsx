import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ReduxStoreType, ThunkDispatchProp } from '../../types'
import { State as GuiStore } from '../../reducers/gui'

import instrumentLibrary from '../../instrumentLibrary'
import { addInstrument } from '../../reducers/instruments'

interface StateProps {
	gui: GuiStore
}

class DeskNavbar extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { dispatch } = this.props
		return (
			<div className="navbar-inner">
				<div className="navbar-left">
					{Object.keys(instrumentLibrary).map(instrumentType => (
						<button
							key={instrumentType}
							type="button"
							className="button-s"
							onClick={() => dispatch(addInstrument(instrumentType))}>
							{'Add ' + instrumentLibrary[instrumentType].name}
						</button>
					))}
				</div>
				<div className="navbar-right" />
			</div>
		)
	}
}

export default connect(({ gui }: ReduxStoreType): StateProps => ({ gui }))(DeskNavbar)
