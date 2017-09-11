import React, { Component } from 'react'
import Icon from '../Icon'

export default class MasterDeskItem extends Component {
	render() {
		return (
			<div className="desk-item desk-item-master">
				<Icon name="volume-up" size="large" />
				<div className="vu-meter">

				</div>
			</div>
		)
	}
}