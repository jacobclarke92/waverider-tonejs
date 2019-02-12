import React, { Component } from 'react'
import classnames from 'classnames'

import { getFileByHash } from '../api/db'
import { getWaveformFromFile } from '../api/waveform'
import { checkDifferenceAny } from '../utils/lifecycleUtils'
import { getInstrumentInstance } from '../instrumentsController'

import DropzoneWrapper from './DropzoneWrapper'
import AudioTrim from './AudioTrim'

export default class Waveform extends Component {
	static defaultProps = {
		width: 600,
		height: 200,
		fileHash: null,
		reverse: false,
		trim: {
			start: 0,
			end: 1,
		},
		disableFileDrop: false,
		onTrimChange: () => {},
		onPreviewAudio: () => {},
		onReceivedFiles: () => {},
	}

	constructor(props) {
		super(props)
		this.raf = null
		this.animate = this.animate.bind(this)
		this.state = {
			waveformUrl: null,
			fileName: null,
			trim: props.trim,
			notePositions: [],
		}
	}

	componentDidMount() {
		if (this.props.fileHash) this.loadFileFromHash()
		this.animate()
	}

	componentWillUnmount() {
		if (this.raf) window.cancelAnimationFrame(this.raf)
	}

	componentWillReceiveProps(newProps) {
		if (this.props.fileHash != newProps.fileHash) this.loadFileFromHash(newProps.fileHash)
		if (checkDifferenceAny(this.props, newProps, 'trim')) this.setState({ trim: newProps.trim })
	}

	loadFileFromHash(fileHash = this.props.fileHash) {
		getFileByHash(fileHash)
			.then(file => {
				this.setState({ fileName: file.name })
				return getWaveformFromFile(file)
			})
			.then(waveformUrl => this.setState({ waveformUrl }))
	}

	animate() {
		const { instrumentId, trim } = this.props
		const { notePositions } = this.state
		const instrument = getInstrumentInstance(instrumentId)
		if (instrument) {
			const duration = trim.end - trim.start
			const newNotePositions = instrument
				.getPlaybackPositions()
				.map(position => trim.start + duration * position)
				.filter(position => position < trim.start + duration)
			this.setState({ notePositions: newNotePositions })
		} else {
			if (notePositions.length > 0) this.setState({ notePositions: [] })
		}
		this.raf = window.requestAnimationFrame(this.animate)
	}

	render() {
		const { width, height, reverse, disableFileDrop, onTrimChange, onPreviewAudio, onReceivedFiles } = this.props
		const { trim, waveformUrl, fileName, notePositions } = this.state

		const waveformDom = (
			<div className="waveform" style={{ width, height }} onClick={() => onPreviewAudio()}>
				{waveformUrl && (
					<div
						className={classnames('waveform-graphic no-aliasing', { reverse })}
						style={{ backgroundImage: `url(${waveformUrl})` }}
					/>
				)}
				{waveformUrl && (
					<AudioTrim
						trim={trim}
						onChange={trim => this.setState({ trim })}
						onAfterChange={(newPos, oldPos) => onTrimChange(newPos, oldPos)}
					/>
				)}
				<div className="note-positions">
					{notePositions.map((position, i) => (
						<div key={i} className="note-position" style={{ left: `${position * 100}%` }} />
					))}
				</div>

				{fileName && <label className="label-box">{fileName}</label>}
			</div>
		)

		return (
			<div className="waveform-container" style={{ width, height }}>
				{disableFileDrop ? waveformDom : <DropzoneWrapper onDrop={onReceivedFiles}>{waveformDom}</DropzoneWrapper>}
			</div>
		)
	}
}
