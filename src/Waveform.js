import React, { Component } from 'react'
import WaveSurfer from 'wavesurfer.js/src/wavesurfer.js'

import { getBlob, addWaveform, getWaveform } from './mediaStore'

import AudioTrim from './AudioTrim'

export default class Waveform extends Component {

	static defaultProps = {
		fileKey: null,
		waveColor: '#FFF',
	};

	constructor(props) {
		super(props)
		this.state = {
			position: {
				start: 0,
				end: 1,
			}
		}
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
		const haveAudio = !!waveformUri

		const { position } = this.state

		return (
			<div className="waveform" onClick={() => this.WS.play()}>
				<div className="waveform-renderer" ref={elem => this.waveformContainer = elem} />
				{haveAudio && <div className="waveform-graphic" style={{backgroundImage: `url(${waveformUri})`}} />}
				{haveAudio && <AudioTrim position={position} onChange={position => this.setState({position})} />}
				{fileKey && <label className="label-box">{fileKey}</label>}
			</div>
		)
	}
}