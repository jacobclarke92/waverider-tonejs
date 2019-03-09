import React, { Component, CSSProperties } from 'react'
import { ThunkDispatchProp, GenericProps } from '../../types'
import { connect } from 'react-redux'
import cn from 'classnames'
import { NOTE_ON, NOTE_OFF, MidiMessageAction } from '../../api/midi'
import { internalPiano } from '../../reducers/devices'
import { addKeyDownListener, addKeyUpListener, removeKeyDownListener, removeKeyUpListener } from '../../utils/keyUtils'

/*
0: C	a
1: C#	w
2: D	s
3: Eb	e
4: E	d
5: F	f
6: F#	t
7: G	g
8: Ab	y
9: A	h
10: Bb	u
11: B	j
*/

const getNoteLetter = (note: number): string => {
	if (note < 0 || note > 11) console.warn('relative note out of range')
	switch (note) {
		case 0:
			return 'a'
		case 1:
			return 'w'
		case 2:
			return 's'
		case 3:
			return 'e'
		case 4:
			return 'd'
		case 5:
			return 'f'
		case 6:
			return 't'
		case 7:
			return 'g'
		case 8:
			return 'y'
		case 9:
			return 'h'
		case 10:
			return 'u'
		case 11:
			return 'j'
	}
}

interface Props {
	className: string
	note: number
	velocity: number
	style: CSSProperties
	octaveActive: boolean
}
interface State {
	active: boolean
}

class PianoKey extends Component<ThunkDispatchProp & Props, State> {
	listening: boolean
	noteLetter: string
	static defaultProps = {
		className: '',
		note: 0,
		velocity: 127,
	}
	constructor(props) {
		super(props)
		this.listening = false
		this.noteLetter = getNoteLetter(props.note % 12)
		this.triggerNoteDown = this.triggerNoteDown.bind(this)
		this.triggerNoteUp = this.triggerNoteUp.bind(this)
		this.state = {
			active: false,
		}
	}
	componentDidMount() {
		this.autoBindListeners()
	}
	componentDidUpdate(prevProps) {
		this.autoBindListeners(prevProps)
	}
	autoBindListeners(prevProps: GenericProps = {}) {
		if (this.props.octaveActive && !prevProps.octaveActive) {
			addKeyDownListener(this.noteLetter, this.triggerNoteDown)
			addKeyUpListener(this.noteLetter, this.triggerNoteUp)
		} else if (!this.props.octaveActive && prevProps.octaveActive) {
			removeKeyDownListener(this.noteLetter, this.triggerNoteDown)
			removeKeyUpListener(this.noteLetter, this.triggerNoteUp)
		}
	}
	keyDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: true })
		this.triggerNoteDown()
	}
	triggerNoteDown() {
		const { note, dispatch } = this.props
		dispatch({ type: NOTE_ON, deviceId: internalPiano.id, channel: 1, note, velocity: 127 } as MidiMessageAction)
	}
	keyUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: false })
		this.triggerNoteUp()
	}
	triggerNoteUp() {
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
