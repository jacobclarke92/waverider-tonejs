import React, { Component } from 'react'

import Icon from '../Icon'
import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'

export default class MembraneSynthDeskItem extends Component {
	render() {
		const { ownerId, type, dataInput, dataOutput } = this.props.deskItem || {}
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item pluck-synth">
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}