import React, { Component } from 'react'
import Icon from '../Icon'
import DeskItemWrapper from './DeskItemWrapper'

export default class BasicSynthDeskItem extends Component {
	render() {
		const { dataInput, dataOutput } = this.props.deskItem || {}
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item basic-synth">
					<div className="vu-meter">

					</div>
				</div>
			</DeskItemWrapper>
		)
	}
}