import React, { Component } from 'react'
import { connect } from 'react-redux'

import instrumentLibrary from '../../instrumentLibrary'
import { addInstrument } from '../../reducers/instruments'

class DeskNavbar extends Component {
	render() {
		const { dispatch } = this.props
		return (
			<div className="navbar-inner">
				<div className="navbar-left">
					{Object.keys(instrumentLibrary).map(instrumentType => 
						<button key={instrumentType} type="button" onClick={() => dispatch(addInstrument(instrumentType))}>
							{'Add '+instrumentLibrary[instrumentType].name}
						</button>
					)}
				</div>
				<div className="navbar-right">

				</div>
			</div>
		)
	}
}

export default connect(({gui}) => ({gui}))(DeskNavbar)