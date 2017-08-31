import React, { Component } from 'react'

import Dropzone from './Dropzone'
import Waveform from './Waveform'
import { addBlob, getAll } from '../api/mediaStore'
import { filesDB, addFile } from '../api/db'

export default class WaveformContainer extends Component {

	constructor(props) {
		super(props)
		this.state = { fileHash: null }
		this.handleFileDrop = this.handleFileDrop.bind(this)
	}

	handleFileDrop(item, monitor) {
		if(monitor) {
			const droppedFiles = monitor.getItem().files
			if(droppedFiles.length) {
				droppedFiles.forEach(droppedFile => {
					addFile(droppedFile).then(file => this.setState({fileHash: file.hash}))
				})
			}
		}
	}

	render() {
		const { fileHash } = this.state
		return (
			<div className="waveform-container">
				<Dropzone onDrop={this.handleFileDrop}>
					<Waveform fileHash={fileHash} {...this.props} />
				</Dropzone>
			</div>
		)
	}
}