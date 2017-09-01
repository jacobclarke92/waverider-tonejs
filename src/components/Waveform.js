import React, { Component } from 'react'
import { Sampler, PolySynth, Time, now } from 'tone'
import classnames from 'classnames'

import { getFileByHash } from '../api/db'
import { getWaveformFromFile } from '../api/waveform'
import { addNoteDownListener, addNoteUpListener, removeNoteDownListener, removeNoteUpListener } from '../api/midi'

import AudioTrim from './AudioTrim'

export default class Waveform extends Component {

	static defaultProps = {
		fileHash: null,
		reversed: false,
		looped: false,
	};

	constructor(props) {
		super(props)
		this.state = {
			waveformUrl: null,
			fileName: null,
			position: {
				start: 0,
				end: 1,
			}
		}
	}

	componentDidMount() {
		const { fileHash } = this.props
		this.handleNoteDown = this.handleNoteDown.bind(this)
		this.handleNoteUp = this.handleNoteUp.bind(this)
		addNoteDownListener(this.handleNoteDown)
		addNoteUpListener(this.handleNoteUp)
		if(fileHash) this.loadFileFromHash()
	}

	componentWillUnmount() {
		this.WS.destroy()
		removeNoteDownListener(this.handleNoteDown)
		removeNoteUpListener(this.handleNoteUp)
	}

	componentWillReceiveProps(newProps) {
		if(this.props.fileHash != newProps.fileHash) this.loadFileFromHash(newProps.fileHash)
		if(this.sampler) {
			if(this.props.reversed != newProps.reversed) {
				this.sampler.voices.forEach(voice => voice.reverse = newProps.reversed)
				this.setState({position: {
					start: 1 - this.state.position.end,
					end: 1 - this.state.position.start,
				}})
			}
			if(this.props.looped != newProps.looped) this.sampler.voices.forEach(voice => voice.loop = newProps.looped)
		}
	}

	loadFileFromHash(fileHash = this.props.fileHash) {
		getFileByHash(fileHash)
			.then(file => {
				this.initSampler()
				this.setState({fileName: file.name})
				return getWaveformFromFile(file)
			})
			.then(waveformUrl => this.setState({waveformUrl}))
	}

	initSampler(callback = () => {}) {
		const { fileHash, reversed, looped } = this.props
		if(!fileHash) return
		if(this.sampler) this.sampler.dispose();
	
		const { start, end } = this.state.position
		getFileByHash(fileHash).then(file => {
			this.sampler = new PolySynth(10, Sampler).toMaster()
			console.log(this.sampler)
			this.sampler.voices.forEach(voice => 
				voice.player.load(file.getUrl(), () => {
					const duration = voice.buffer.duration
					voice.reverse = reversed
					voice.loop = looped
					if(!(start === 0 && end === 1)) {
						voice.buffer = voice.buffer.slice(duration * start, duration * end)
					}
					callback()
				})
			)
		})
	}

	handleNoteDown(channel, note, velocity) {
		console.log(note, velocity)
		this.triggerPlay(note-60, velocity)
	}

	handleNoteUp(channel, note, velocity) {
		console.log('note up')
		if(this.sampler) this.sampler.triggerRelease(note, now())
	}

	handlePlay() {
		if(!this.sampler) this.initSampler(() => this.triggerPlay());
		else this.triggerPlay()
	}

	triggerPlay(pitch = 0, velocity = 0.5) {
		// pitch = Math.round(Math.random()*20) - 10
		if(this.sampler && this.sampler.voices[0].buffer.loaded) this.sampler.triggerAttack(pitch, now(), velocity / 2)
	}

	handleTrim(newPos, oldPos) {
		if(newPos.start !== oldPos.start || newPos.end !== oldPos.end) this.initSampler()
	}

	render() {
		const { reversed } = this.props
		const { position, waveformUrl, fileName } = this.state

		return (
			<div className="waveform" onClick={() => this.handlePlay()}>
				{waveformUrl && <div className={classnames('waveform-graphic', {reversed})} style={{backgroundImage: `url(${waveformUrl})`}} />}
				{waveformUrl && 
					<AudioTrim 
						position={position} 
						onChange={position => this.setState({position})} 
						onAfterChange={(newPos, oldPos) => this.handleTrim(newPos, oldPos)} />}
				{fileName && <label className="label-box">{fileName}</label>}
			</div>
		)
	}
}