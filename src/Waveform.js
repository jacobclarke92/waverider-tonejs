import React, { Component } from 'react'
import WaveSurfer from 'wavesurfer.js/src/wavesurfer.js'
import { Sampler, Time, now } from 'tone'

import { getBlob, getBlobUrl, addWaveform, getWaveform } from './mediaStore'

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
		const blob = getBlob(fileKey)
		if(blob) this.WS.loadBlob(blob)
	}

	handleWaveformGeneration() {
		if(!getWaveform(this.props.fileKey)) {
			const waveformUri = this.WS.exportImage()
			if(waveformUri) addWaveform(this.props.fileKey, waveformUri)
		}
		this.initSampler()
		this.forceUpdate()
	}

	initSampler(callback = () => {}) {
		if(!this.props.fileKey) return
		const { start, end } = this.state.position
		if(this.sampler) this.sampler.dispose();
		this.sampler = new Sampler(getBlobUrl(this.props.fileKey), () => {
			const duration = this.sampler.buffer.duration
			if(!(start === 0 && end === 1)) {
				this.sampler.buffer = this.sampler.buffer.slice(duration * start, duration * end)
			}
			callback()
		}).toMaster()
	}

	handlePlay() {
		if(!this.sampler) this.initSampler(() => this.triggerPlay());
		else this.triggerPlay()
	}

	triggerPlay(pitch = 0) {
		pitch = Math.round(Math.random()*20) - 10
		if(this.sampler.buffer.loaded) this.sampler.triggerAttack(pitch, now(), 0.5)
	}

	handleTrim(newPos, oldPos) {
		if(newPos.start !== oldPos.start || newPos.end !== oldPos.end) this.initSampler()
	}

	render() {
		const { fileKey } = this.props
		const waveformUri = getWaveform(fileKey)
		const haveAudio = !!waveformUri

		const { position } = this.state

		return (
			<div className="waveform" onClick={() => this.handlePlay()}>
				<div className="waveform-renderer" ref={elem => this.waveformContainer = elem} />
				{haveAudio && <div className="waveform-graphic" style={{backgroundImage: `url(${waveformUri})`}} />}
				{haveAudio && 
					<AudioTrim 
						position={position} 
						onChange={position => this.setState({position})} 
						onAfterChange={(newPos, oldPos) => this.handleTrim(newPos, oldPos)} />}
				{fileKey && <label className="label-box">{fileKey}</label>}
			</div>
		)
	}
}