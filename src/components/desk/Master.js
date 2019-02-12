import React, { Component } from 'react'
import Icon from '../Icon'
import VuMeter from './VuMeter'
import DeskItemWrapper from './DeskItemWrapper'

export default class MasterDeskItem extends Component {
	render() {
		const { type, ownerId } = this.props.deskItem || {}
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item master" onMouseDown={e => console.log('MasterDeskItem mouseDown')}>
					<Icon name="volume-up" size="large" />
					<VuMeter type={type} id={ownerId} />
				</div>
			</DeskItemWrapper>
		)
	}
}
