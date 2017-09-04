import React, { Component } from 'react'
import classnames from 'classnames'

import { getFileByHash } from '../api/db'
import { getWaveformFromFile } from '../api/waveform'

import AudioTrim from './AudioTrim'

export default class Waveform extends Component {

	static defaultProps = {
		fileHash: null,
		reversed: false,
		looped: false,
		onTrimChange: () => {},
		onPreviewAudio: () => {},
	};

	constructor(props) {
		super(props)
		this.state = {
			waveformUrl: null,
			fileName: null,
			trim: {
				start: 0,
				end: 1,
			}
		}
	}

	componentDidMount() {
		const { fileHash } = this.props
		// this.handleNoteDown = this.handleNoteDown.bind(this)
		// this.handleNoteUp = this.handleNoteUp.bind(this)
		// addNoteDownListener(this.handleNoteDown)
		// addNoteUpListener(this.handleNoteUp)
		if(fileHash) this.loadFileFromHash()
	}

	componentWillUnmount() {
		// removeNoteDownListener(this.handleNoteDown)
		// removeNoteUpListener(this.handleNoteUp)
	}

	componentWillReceiveProps(newProps) {
		if(this.props.fileHash != newProps.fileHash) this.loadFileFromHash(newProps.fileHash)
		// if(this.sampler) {
		// 	if(this.props.reversed != newProps.reversed) {
		// 		this.sampler.voices.forEach(voice => voice.reverse = newProps.reversed)
		// 		this.setState({trim: {
		// 			start: 1 - this.state.trim.end,
		// 			end: 1 - this.state.trim.start,
		// 		}})
		// 	}
		// 	if(this.props.looped != newProps.looped) this.sampler.voices.forEach(voice => voice.loop = newProps.looped)
		// }
	}

	loadFileFromHash(fileHash = this.props.fileHash) {
		getFileByHash(fileHash)
			.then(file => {
				this.setState({fileName: file.name})
				return getWaveformFromFile(file)
			})
			.then(waveformUrl => this.setState({waveformUrl}))
	}

	// handleNoteDown(channel, note, velocity) {
	// 	console.log(note, velocity)
	// 	this.triggerPlay(note-60, velocity / 2)
	// }

	// handleNoteUp(channel, note, velocity) {
	// 	console.log('note up')
	// 	if(this.sampler) this.sampler.triggerRelease(note, now())
	// }

	// handlePlay() {
	// 	if(!this.sampler) this.initSampler(() => this.triggerPlay());
	// 	else this.triggerPlay()
	// }

	// triggerPlay(pitch = 0, velocity = 0.5) {
	// 	if(this.sampler && this.sampler.voices && this.sampler.voices[0].buffer.loaded) {
	// 		this.sampler.triggerAttack(pitch, now(), velocity / 2)
	// 	}
	// }

	// handleTrim(newPos, oldPos) {
	// 	if(newPos.start !== oldPos.start || newPos.end !== oldPos.end) this.initSampler()
	// }

	render() {
		const { reversed, onTrimChange, onPreviewAudio } = this.props
		const { trim, waveformUrl, fileName } = this.state

		return (
			<div className="waveform" onClick={() => onPreviewAudio()}>
				{waveformUrl && <div className={classnames('waveform-graphic', {reversed})} style={{backgroundImage: `url(${waveformUrl})`}} />}
				{waveformUrl && 
					<AudioTrim 
						trim={trim} 
						onChange={trim => this.setState({trim})} 
						onAfterChange={(newPos, oldPos) => onTrimChange(newPos, oldPos)} />}
				{fileName && <label className="label-box">{fileName}</label>}
			</div>
		)
	}
}