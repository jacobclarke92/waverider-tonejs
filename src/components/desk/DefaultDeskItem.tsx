import React, { Component } from 'react'
import { ThunkDispatchProp } from '../../types'

import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'
import { DeskItemProps } from '../view/DeskWorkspace'
import { PinMouseEventProps } from './Pin'

export default class DefaultDeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
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
