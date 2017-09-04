import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateInstrument } from '../../reducers/instruments'
import { addFile } from '../../api/db'

import Checkbox from '../input/Checkbox'
import DeviceSelect from '../DeviceSelect'
import ChannelSelect from '../ChannelSelect'
import Dropzone from '../Dropzone'
import Waveform from '../Waveform'

class Simpler extends Component {

	constructor(props) {
		super(props)
		this.handleFilesDrop = this.handleFilesDrop.bind(this)
	}

	handleFilesDrop(item, monitor) {
		const { dispatch, id, instrument } = this.props
		if(monitor) {
			const droppedFiles = monitor.getItem().files
			if(droppedFiles.length > 0) addFile(droppedFiles[0])
				.then(file => dispatch(updateInstrument(id, {instrument: {...instrument, fileHash: file.hash}})))
				.catch(e => console.warn('Unable to store dropped file', e))
		}
	}

	render() {
		const { dispatch, id, instrument, midiDeviceId, midiChannel } = this.props
		const { voices, loop, reverse, fileHash } = instrument
		return (
			<div className="simpler">
				<DeviceSelect value={midiDeviceId} onChange={midiDeviceId => dispatch(updateInstrument(id, {midiDeviceId}))} />
				<ChannelSelect value={midiChannel} onChange={midiChannel => dispatch(updateInstrument(id, {midiChannel}))} />
				<div className="waveform-container">
					<Dropzone onDrop={this.handleFilesDrop}>
						<Waveform fileHash={fileHash} onTrimChange={trim => dispatch(updateInstrument(id, {instrument: {...instrument, trim}}))} />
					</Dropzone>
				</div>
				<Checkbox value={loop} text="Loop" onChange={loop => dispatch(updateInstrument(id, {instrument: {...instrument, loop}}))} />
				<Checkbox value={reverse} text="Reverse" onChange={reverse => dispatch(updateInstrument(id, {instrument: {...instrument, reverse}}))} />
			</div>
		)
	}
}

export default connect()(Simpler)