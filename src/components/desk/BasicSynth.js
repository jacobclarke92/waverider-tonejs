import React, { Component } from 'react'
import Icon from '../Icon'
import DeskItemWrapper from './DeskItemWrapper'
import Connection from './Connection'

export default class BasicSynthDeskItem extends Component {
	render() {
		const { audioInput, audioOutput, dataInput, dataOutput } = this.props.deskItem || {}
		return (
			<DeskItemWrapper {...this.props}>
				<div className="basic-synth">
					{audioInput && <Connection type="audio" flow="input" />}
					{audioOutput && <Connection type="audio" flow="output" />}
					<div className="vu-meter">

					</div>
				</div>
			</DeskItemWrapper>
		)
	}
}