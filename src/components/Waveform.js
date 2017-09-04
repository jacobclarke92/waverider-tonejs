import React, { Component } from 'react'
import classnames from 'classnames'

import { getFileByHash } from '../api/db'
import { getWaveformFromFile } from '../api/waveform'

import AudioTrim from './AudioTrim'

export default class Waveform extends Component {

	static defaultProps = {
		fileHash: null,
		reverse: false,
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
		if(this.props.fileHash) this.loadFileFromHash()
	}

	componentWillReceiveProps(newProps) {
		if(this.props.fileHash != newProps.fileHash) this.loadFileFromHash(newProps.fileHash)
	}

	loadFileFromHash(fileHash = this.props.fileHash) {
		getFileByHash(fileHash)
			.then(file => {
				this.setState({fileName: file.name})
				return getWaveformFromFile(file)
			})
			.then(waveformUrl => this.setState({waveformUrl}))
	}

	render() {
		const { reverse, onTrimChange, onPreviewAudio } = this.props
		const { trim, waveformUrl, fileName } = this.state

		return (
			<div className="waveform" onClick={() => onPreviewAudio()}>
				{waveformUrl && <div className={classnames('waveform-graphic', {reverse})} style={{backgroundImage: `url(${waveformUrl})`}} />}
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