import React, { Component } from 'react'

import Dropzone from './Dropzone'
import Waveform from './Waveform'
import { addBlob, getAll } from '../api/mediaStore'
import { filesDB, addFile } from '../api/db'

export default class WaveformContainer extends Component {

	constructor(props) {
		super(props)
		this.state = { fileKey: null }
		this.handleFileDrop = this.handleFileDrop.bind(this)
	}

	handleFileDrop(item, monitor) {
		if(monitor) {
			const droppedFiles = monitor.getItem().files
			if(droppedFiles.length) {
				droppedFiles.forEach(file => {
					addBlob(file.name, file)
					addFile(file)
				})
				this.setState({fileKey: droppedFiles[0].name})
			}
		}
	}

	render() {
		const { fileKey } = this.state
		return (
			<div className="waveform-container">
				<Dropzone onDrop={this.handleFileDrop}>
					<Waveform fileKey={fileKey} {...this.props} />
				</Dropzone>
			</div>
		)
	}
}