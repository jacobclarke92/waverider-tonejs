import React, { Component } from 'react'
import DeskItemWrapper from './DeskItemWrapper'
import { ThunkDispatchProp } from '../../types'
import { PinMouseEventProps } from './Pin'
import { DeskItemProps } from '../view/DeskWorkspace'

export default class MelodySequencer extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item melody-sequencer">
					<h1>Heyooo</h1>
				</div>
			</DeskItemWrapper>
		)
	}
}
