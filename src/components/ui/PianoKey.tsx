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
12: C	k
13: C#	o
14: D	l
15: Eb	p
16: E	;
17: F	'
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
		case 12:
			return 'k'
		case 13:
			return 'o'
		case 14:
			return 'l'
		case 15:
			return 'p'
		case 16:
			return ';'
		case 17:
			return "'"
	}
}

interface Props {
	className: string
	note: number
	noteIndex: number
	velocity: number
	style: CSSProperties
	active: boolean
}
interface State {
	notePlaying: boolean
	noteLetter: string
}

class PianoKey extends Component<ThunkDispatchProp & Props, State> {
	listening: boolean
	static defaultProps = {
		className: '',
		note: 0,
		noteIndex: 0,
		velocity: 127,
	}
	constructor(props) {
		super(props)
		this.triggerNoteDown = this.triggerNoteDown.bind(this)
		this.triggerNoteUp = this.triggerNoteUp.bind(this)
		this.state = {
			notePlaying: false,
			noteLetter: getNoteLetter(props.noteIndex),
		}
	}
	componentDidMount() {
		this.autoBindListeners(this.props, this.state, true)
	}
	componentDidUpdate(prevProps, prevState) {
		this.autoBindListeners(prevProps, prevState)
	}
	autoBindListeners(prevProps: ThunkDispatchProp & Props, prevState: State, init: boolean = false) {
		const isNowActive = this.props.active && !prevProps.active
		const isNowInactive = !this.props.active && prevProps.active
		const isStillActive = this.props.active && prevProps.active
		const noteIndexChanged = this.props.noteIndex != prevProps.noteIndex

		if (isNowActive || isStillActive)
			console.log(`[${this.props.note}]`, { isNowActive, isNowInactive, isStillActive, noteIndexChanged })

		let { noteLetter } = this.state
		if (noteIndexChanged) {
			noteLetter = getNoteLetter(this.props.noteIndex)
			this.setState({ noteLetter })
			console.log(`[${this.props.note}]`, 'Got new note letter ', prevState.noteLetter, '->', noteLetter)
		}

		if (isNowInactive || noteIndexChanged) {
			if (this.state.notePlaying) this.triggerNoteUp(prevProps)
			if (prevState.noteLetter) {
				this.listening = false
				removeKeyDownListener(prevState.noteLetter, this.triggerNoteDown)
				removeKeyUpListener(prevState.noteLetter, this.triggerNoteUp)
				console.log(`[${this.props.note}]`, 'Removing key up and down listeners for ', prevState.noteLetter)
			}
		}

		if ((init || noteIndexChanged) && this.props.active) {
			if (noteLetter) {
				this.listening = true
				addKeyDownListener(noteLetter, this.triggerNoteDown)
				addKeyUpListener(noteLetter, this.triggerNoteUp)
				console.log(`[${this.props.note}]`, 'Adding key up and down listeners for ', noteLetter)
			}
		}
	}
	keyDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.triggerNoteDown()
	}
	triggerNoteDown(props = this.props) {
		const { note } = props
		this.setState({ notePlaying: true })
		this.props.dispatch({
			type: NOTE_ON,
			deviceId: internalPiano.id,
			channel: 1,
			note,
			velocity: 127,
		} as MidiMessageAction)
	}
	keyUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.triggerNoteUp()
	}
	triggerNoteUp(props = this.props) {
		const { note } = props
		this.setState({ notePlaying: false })
		this.props.dispatch({
			type: NOTE_OFF,
			deviceId: internalPiano.id,
			channel: 1,
			note,
			velocity: 127,
		} as MidiMessageAction)
	}
	render() {
		const { notePlaying, noteLetter } = this.state
		const { className, style, active } = this.props
		return (
			<div
				className={cn(className, { active: notePlaying, highlighted: active })}
				style={style}
				onMouseDown={this.keyDown}
				onMouseUp={this.keyUp}
				onMouseOut={this.keyUp}>
				{active && noteLetter && <span>{noteLetter.toUpperCase()}</span>}
			</div>
		)
	}
}

export default connect()(PianoKey)
