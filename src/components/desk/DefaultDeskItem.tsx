import React, { Component } from 'react'
import { DeskItemType } from '../../types'

import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'

interface Props {
	deskItem: DeskItemType
}

export default class DefaultDeskItem extends Component<Props> {
	render() {
		const { ownerId, type } = this.props.deskItem
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item desk-item-default">
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}
