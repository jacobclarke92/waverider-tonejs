import React, { Component } from 'react'
import { ThunkDispatchProp } from '../../types'
import { DeskItemProps } from '../view/DeskWorkspace'
import { PinMouseEventProps } from './Pin'
import DeskItemWrapper from './DeskItemWrapper'
import Oscilloscope from './Oscilloscope'

export default class OscilloscopeEffect extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		const { ownerId } = this.props.deskItem
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item oscilloscope-effect">
					<Oscilloscope id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}
