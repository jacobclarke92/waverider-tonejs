import React, { Component, CSSProperties } from 'react'
import { ThunkDispatchProp, GenericProps } from '../../types'
import { connect } from 'react-redux'
import cn from 'classnames'
import {
	NOTE_ON,
	NOTE_OFF,
	MidiMessageAction,
	MidiListenerFunction,
	addNoteDownListener,
	addNoteUpListener,
	removeNoteDownListener,
	removeNoteUpListener,
} from '../../api/midi'
import { internalPiano } from '../../reducers/devices'
import { addKeyDownListener, addKeyUpListener, removeKeyDownListener, removeKeyUpListener } from '../../utils/keyUtils'
import { checkDifferenceAny } from '../../utils/lifecycleUtils'

const getNoteLetter = (note: number): string => {
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
	static defaultProps = {
		className: '',
		note: 0,
		noteIndex: 0,
		velocity: 127,
	}
	constructor(props) {
		super(props)
		this.state = {
			notePlaying: false,
			noteLetter: getNoteLetter(props.noteIndex),
		}
	}
	componentDidMount() {
		this.autoBindKeyListeners(this.props, this.state, true)
		addNoteDownListener(this.handleMidiNoteDown)
		addNoteUpListener(this.handleMidiNoteUp)
	}
	componentDidUpdate(prevProps, prevState) {
		this.autoBindKeyListeners(prevProps, prevState)
	}
	componentWillUnmount() {
		removeNoteDownListener(this.handleMidiNoteDown)
		removeNoteUpListener(this.handleMidiNoteUp)
		if (this.props.active) {
			removeKeyDownListener(this.state.noteLetter, this.handleKeyDown)
			removeKeyUpListener(this.state.noteLetter, this.handleKeyUp)
		}
	}
	handleMidiNoteDown: MidiListenerFunction = (deviceId, channel, note, velocity) => {
		if (note === this.props.note && !this.state.notePlaying) this.setState({ notePlaying: true })
	}
	handleMidiNoteUp: MidiListenerFunction = (deviceId, channel, note, velocity) => {
		if (note === this.props.note && this.state.notePlaying) this.setState({ notePlaying: false })
	}
	autoBindKeyListeners(prevProps: ThunkDispatchProp & Props, prevState: State, init: boolean = false) {
		const isNowActive = this.props.active && !prevProps.active
		const isNowInactive = !this.props.active && prevProps.active
		const noteIndexChanged = this.props.noteIndex != prevProps.noteIndex

		let { noteLetter } = this.state
		if (noteIndexChanged) {
			noteLetter = getNoteLetter(this.props.noteIndex)
			this.setState({ noteLetter })
		}

		if (isNowInactive || noteIndexChanged) {
			if (this.state.notePlaying) this.triggerNoteUp(prevProps)
			if (prevState.noteLetter) {
				removeKeyDownListener(prevState.noteLetter, this.handleKeyDown)
				removeKeyUpListener(prevState.noteLetter, this.handleKeyUp)
			}
		}

		if ((init || isNowActive || noteIndexChanged) && this.props.active) {
			if (noteLetter) {
				addKeyDownListener(noteLetter, this.handleKeyDown)
				addKeyUpListener(noteLetter, this.handleKeyUp)
			}
		}
	}
	handleKeyDown = (e: React.KeyboardEvent) => this.triggerNoteDown()
	handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		if (!this.state.notePlaying) this.triggerNoteDown()
	}
	triggerNoteDown = (props = this.props) => {
		const { note, velocity } = props
		this.setState({ notePlaying: true })
		this.props.dispatch({
			type: NOTE_ON,
			deviceId: internalPiano.id,
			channel: 1,
			note,
			velocity,
		} as MidiMessageAction)
	}
	handleKeyUp = (e: React.KeyboardEvent) => this.triggerNoteUp()
	handleMouseRelease = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		if (this.state.notePlaying) this.triggerNoteUp()
	}
	triggerNoteUp = (props = this.props) => {
		const { note } = props
		this.setState({ notePlaying: false })
		this.props.dispatch({
			type: NOTE_OFF,
			deviceId: internalPiano.id,
			channel: 1,
			note,
			velocity: 0,
		} as MidiMessageAction)
	}
	// TODO
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return (
	// 		checkDifferenceAny(this.props, nextProps, ['className', 'style', 'active']) ||
	// 		checkDifferenceAny(this.state, nextState, ['notePlaying', 'noteLetter'])
	// 	)
	// }
	render() {
		const { notePlaying, noteLetter } = this.state
		const { className, style, active } = this.props
		return (
			<div
				className={cn(className, { active: notePlaying, highlighted: active })}
				style={style}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseRelease}
				onMouseOut={this.handleMouseRelease}>
				{active && noteLetter && <span>{noteLetter.toUpperCase()}</span>}
			</div>
		)
	}
}

export default connect()(PianoKey)
