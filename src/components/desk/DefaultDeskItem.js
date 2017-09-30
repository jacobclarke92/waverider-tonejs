import React, { Component } from 'react'

import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'

export default class DefaultDeskItem extends Component {
	render() {
		const { ownerId, type, dataInput, dataOutput } = this.props.deskItem || {}
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item desk-item-default">
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}