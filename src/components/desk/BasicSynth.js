import React, { Component } from 'react'
import Icon from '../Icon'
import DeskItemWrapper from './DeskItemWrapper'

export default class BasicSynthDeskItem extends Component {
	render() {
		return (
			<DeskItemWrapper {...this.props}>
				<div className="basic-synth">
					<div className="vu-meter">

					</div>
				</div>
			</DeskItemWrapper>
		)
	}
}