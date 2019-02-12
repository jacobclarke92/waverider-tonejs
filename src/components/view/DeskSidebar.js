import React, { Component } from 'react'
import { connect } from 'react-redux'

import effectLibrary from '../../effectLibrary'
import { addEffect } from '../../reducers/effects'

class DeskToolbar extends Component {
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

export default connect(({ gui }) => ({ gui }))(DeskToolbar)
