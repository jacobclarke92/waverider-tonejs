import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateInstrument } from '../../reducers/instruments'
import { addFile } from '../../api/db'

import Checkbox from '../input/Checkbox'
import NumberInput from '../input/NumberInput'
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

	handleReverse(reverse) {
		const { dispatch, id, instrument } = this.props
		const { trim } = instrument
		dispatch(updateInstrument(id, {instrument: {
			...instrument, 
			reverse, 
			trim: {
				start: 1 - trim.end, 
				end: 1 - trim.start
			},
		}}))
	}

	render() {
		const { dispatch, id, instrument, midiDeviceId, midiChannel } = this.props
		const { voices, loop, reverse, trim, fileHash, baseNote, cents } = instrument
		return (
			<div className="simpler">
				<DeviceSelect value={midiDeviceId} onChange={midiDeviceId => dispatch(updateInstrument(id, {midiDeviceId}))} />
				<ChannelSelect value={midiChannel} onChange={midiChannel => dispatch(updateInstrument(id, {midiChannel}))} />
				<NumberInput value={voices} step={1} min={1} max={12} onChange={voices => dispatch(updateInstrument(id, {instrument: {...instrument, voices}}))} />
				<NumberInput value={baseNote} step={1} min={0} max={128} onChange={baseNote => dispatch(updateInstrument(id, {instrument: {...instrument, baseNote}}))} />
				<NumberInput value={cents} step={1} onChange={cents => dispatch(updateInstrument(id, {instrument: {...instrument, cents}}))} />
				<div className="waveform-container">
					<Dropzone onDrop={this.handleFilesDrop}>
						<Waveform 
							instrumentId={id}
							fileHash={fileHash} 
							trim={trim} 
							reverse={reverse} 
							onTrimChange={trim => dispatch(updateInstrument(id, {instrument: {...instrument, trim}}))} />
					</Dropzone>
				</div>
				<Checkbox value={loop} text="Loop" onChange={loop => dispatch(updateInstrument(id, {instrument: {...instrument, loop}}))} />
				<Checkbox value={reverse} text="Reverse" onChange={reverse => this.handleReverse(reverse)} />
			</div>
		)
	}
}

export default connect()(Simpler)