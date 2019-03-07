import React, { Component } from 'react'
import { connect } from 'react-redux'

import effectLibrary from '../../effectLibrary'
import { addEffect } from '../../reducers/effects'

import { ThunkDispatchProp, ReduxStoreType } from '../../types'
import { State as GuiStore } from '../../reducers/gui'

interface StateProps {
	gui: GuiStore
}

class DeskToolbar extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { dispatch } = this.props
		return (
			<div className="toolbar-inner">
				{Object.keys(effectLibrary).map(effectType => (
					<button key={effectType} type="button" className="button-s" onClick={() => dispatch(addEffect(effectType))}>
						{'Add ' + effectLibrary[effectType].name}
					</button>
				))}
			</div>
		)
	}
}

export default connect(({ gui }: ReduxStoreType) => ({ gui }))(DeskToolbar)
