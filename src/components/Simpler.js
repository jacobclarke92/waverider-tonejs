import React, { Component } from 'react'
import WaveformContainer from './WaveformContainer'

import DeviceSelect from './DeviceSelect'
import ChannelSelect from './ChannelSelect'

export default class Simpler extends Component {

	constructor(props) {
		super(props)
		this.state = {
			reversed: false,
			looped: false,
			voices: 4,
			midiDeviceId: null,
			midiChannel: null,
		}
	}

	render() {
		const { reversed, looped, midiDeviceId, midiChannel } = this.state
		return (
			<div className="simpler">
				<DeviceSelect value={midiDeviceId} onChange={midiDeviceId => console.log('device selected id', midiDeviceId)} />
				<ChannelSelect value={midiChannel} onChange={midiChannel => console.log('channel selected', midiChannel)} />
				<WaveformContainer reversed={reversed} looped={looped} />
				<label>
					<input type="checkbox" checked={reversed} onChange={e => this.setState({reversed: e.target.checked})} /> Reverse
				</label>
				<label>
					<input type="checkbox" checked={looped} onChange={e => this.setState({looped: e.target.checked})} /> Loop
				</label>
			</div>
		)
	}
}