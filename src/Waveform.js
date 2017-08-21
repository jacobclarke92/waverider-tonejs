import React, { Component } from 'react'
import WaveSurfer from 'wavesurfer.js/src/wavesurfer.js'

import { getBlob, addWaveform, getWaveform } from './mediaStore'

export default class Waveform extends Component {

	static defaultProps = {
		fileKey: null,
		waveColor: '#FFF',
	}

	componentDidMount() {
		const { fileKey, waveColor } = this.props
		this.WS = new WaveSurfer({
			waveColor,
			minPxPerSec: 100,
			normalize: false,
			splitChannels: true,
			container: this.waveformContainer
		})
		this.WS.init()
		this.WS.on('ready', this.handleWaveformGeneration.bind(this))
		if(fileKey) this.loadFromFileKey()
	}

	componentWillUnmount() {
		this.WS.destroy()
	}

	componentWillReceiveProps(newProps) {
		if(this.props.fileKey != newProps.fileKey) this.loadFromFileKey(newProps.fileKey)
	}

	loadFromFileKey(fileKey = this.props.fileKey) {
		const file = getBlob(fileKey)
		if(file) this.loadFile(file)
	}

	loadFile(file) {
		this.WS.loadBlob(file)
	}

	handleWaveformGeneration() {
		if(!getWaveform(this.props.fileKey)) {
			const waveformUri = this.WS.exportImage()
			if(waveformUri) addWaveform(this.props.fileKey, waveformUri)
		}
		this.forceUpdate()
	}

	render() {
		const { fileKey } = this.props
		const waveformUri = getWaveform(fileKey)
		return (
			<div className="waveform" onClick={() => this.WS.play()}>
				<div className="waveform-renderer" ref={elem => this.waveformContainer = elem} />
				<div className="waveform-graphic" style={{backgroundImage: waveformUri ? `url(${waveformUri})` : ''}} />
			</div>
		)
	}
}