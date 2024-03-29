import React, { Component } from 'react'
import Icon from '../Icon'
import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'
import { ThunkDispatchProp } from '../../types'
import { DeskItemProps } from '../view/DeskWorkspace'
import { PinMouseEventProps } from './Pin'

export default class MasterDeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		const { type, ownerId } = this.props.deskItem
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item master" onMouseDown={e => console.log('MasterDeskItem mouseDown')}>
					<Icon name="volume-up" size="l" />
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}
