import React, { Component } from 'react'
import Icon from '../Icon'
import DeskItemWrapper from './DeskItemWrapper'

export default class MasterDeskItem extends Component {
	render() {
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item master" onMouseDown={e => console.log('MasterDeskItem mouseDown')}>
					<Icon name="volume-up" size="large" />
					<div className="vu-meter">

					</div>
				</div>
			</DeskItemWrapper>
		)
	}
}