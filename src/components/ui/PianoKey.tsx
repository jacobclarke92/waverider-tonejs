import React, { Component, CSSProperties } from 'react'
import { ThunkDispatchProp } from '../../types'
import { connect } from 'react-redux'
import cn from 'classnames'
import { NOTE_ON, NOTE_OFF, MidiMessageAction } from '../../api/midi'
import { internalPiano } from '../../reducers/devices'

interface Props {
	className: string
	note: number
	style: CSSProperties
	octaveActive: boolean
}
interface State {
	active: boolean
}

class PianoKey extends Component<ThunkDispatchProp & Props, State> {
	static defaultProps = {
		className: '',
		note: 0,
	}
	state = { active: false }
	keyDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: true })
		const { note, dispatch } = this.props
		dispatch({ type: NOTE_ON, deviceId: internalPiano.id, channel: 1, note, velocity: 127 } as MidiMessageAction)
	}
	keyUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: false })
		const { note, dispatch } = this.props
		dispatch({ type: NOTE_OFF, deviceId: internalPiano.id, channel: 1, note, velocity: 127 } as MidiMessageAction)
	}
	render() {
		const { active } = this.state
		const { note, className, style, octaveActive } = this.props
		return (
			<div
				className={cn(className, { active, highlighted: octaveActive })}
				style={style}
				onMouseDown={this.keyDown}
				onMouseUp={this.keyUp}
				onMouseOut={this.keyUp}
			/>
		)
	}
}

export default connect()(PianoKey)
