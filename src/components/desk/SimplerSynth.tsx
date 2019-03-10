import React, { Component } from 'react'

import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'

import { ThunkDispatchProp } from '../../types'
import { DeskItemProps } from '../view/DeskWorkspace'
import { PinMouseEventProps } from './Pin'

export default class SimplerSynthDeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		const { ownerId, type } = this.props.deskItem
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item basic-synth">
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}
