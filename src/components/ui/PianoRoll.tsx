import React, { Component, FunctionComponent } from 'react'
import cn from 'classnames'
import { generateArray } from '../../utils/arrayUtils'
import { addKeyDownListener, removeKeyDownListener } from '../../utils/keyUtils'
import PianoKey from './PianoKey'
import MessageOverlay from './MessageOverlay'

interface Props {
	octaves?: number
	octaveStart?: number
	height?: number
	keyWidth?: number
}

interface State {
	activeOctave: number
	velocity: number
	overlayMessage: string
	overlayHidden: boolean
}

export default class PianoRoll extends Component<Props, State> {
	hideOverlayTimeout: number
	static defaultProps = {
		octaves: 6,
		octaveStart: 0,
		height: 100,
		keyWidth: 18,
	}
	constructor(props) {
		super(props)
		this.state = {
			velocity: 96,
			activeOctave: Math.min(props.octaves, 4),
			overlayMessage: '',
			overlayHidden: true,
		}
	}
	componentDidMount() {
		addKeyDownListener('z', this.deincrementActiveOctave)
		addKeyDownListener('x', this.incrementActiveOctave)
		addKeyDownListener('c', this.decreaseVelocity)
		addKeyDownListener('v', this.increaseVelocity)
	}
	componentWillUnmount() {
		removeKeyDownListener('x', this.incrementActiveOctave)
		removeKeyDownListener('z', this.deincrementActiveOctave)
		removeKeyDownListener('c', this.decreaseVelocity)
		removeKeyDownListener('v', this.increaseVelocity)
	}
	deincrementActiveOctave = () =>
		this.setState({ activeOctave: Math.max(0, this.state.activeOctave - 1) }, () =>
			this.displayMessage(`Starts at C${this.state.activeOctave + this.props.octaveStart}`)
		)
	incrementActiveOctave = () =>
		this.setState(
			{ activeOctave: Math.min(this.props.octaves - this.props.octaveStart - 1, this.state.activeOctave + 1) },
			() => this.displayMessage(`Starts at C${this.state.activeOctave + this.props.octaveStart}`)
		)
	decreaseVelocity = () =>
		this.setState({ velocity: Math.max(0, this.state.velocity - 8) }, () =>
			this.displayMessage(`Velocity = ${this.state.velocity}`)
		)
	increaseVelocity = () =>
		this.setState({ velocity: Math.min(127, this.state.velocity + 8) }, () =>
			this.displayMessage(`Velocity = ${this.state.velocity}`)
		)
	displayMessage(overlayMessage: string) {
		this.setState({ overlayMessage, overlayHidden: false })
		if (this.hideOverlayTimeout) clearTimeout(this.hideOverlayTimeout)
		this.hideOverlayTimeout = setTimeout(() => this.setState({ overlayHidden: true }), 1000)
	}
	render() {
		const { octaves, octaveStart, keyWidth, height } = this.props
		const { activeOctave, velocity, overlayMessage, overlayHidden } = this.state
		return (
			<div className={cn('piano-wrapper')} style={{ height }}>
				{generateArray(octaves - octaveStart).map(i => (
					<Octave
						key={i}
						octave={i}
						velocity={velocity}
						active={activeOctave === i}
						activeOctave={activeOctave}
						keyWidth={keyWidth}
						startNote={octaveStart * 12 + i * 12}
					/>
				))}
				<MessageOverlay message={overlayMessage} hide={overlayHidden} />
			</div>
		)
	}
}

/*
0: C
1: C#
2: D
3: Eb
4: E
5: F
6: F#
7: G
8: Ab
9: A
10: Bb
11: B
*/

const getWhiteKeyIndex = (i: number): number => {
	if (i < 0 || i > 6) console.warn('black key index out of range')
	switch (i) {
		case 0:
			return 0
		case 1:
			return 2
		case 2:
			return 4
		case 3:
			return 5
		case 4:
			return 7
		case 5:
			return 9
		case 6:
			return 11
	}
}

const getBlackKeyIndex = (i: number): number => {
	if (i < 0 || i > 4) console.warn('black key index out of range')
	switch (i) {
		case 0:
			return 1
		case 1:
			return 3
		case 2:
			return 6
		case 3:
			return 8
		case 4:
			return 10
	}
}
const getBlackKeyLeft = (i: number, width: number): number => {
	let pos = i + 1
	if (i >= 2) pos++
	return pos * width
}

interface OctaveProps {
	octave: number
	velocity: number
	activeOctave: number
	active: boolean
	keyWidth: number
	startNote: number
}
const Octave: FunctionComponent<OctaveProps> = ({ octave, velocity, activeOctave, startNote, active, keyWidth }) => {
	const isNextOctave = activeOctave + 1 === octave
	return (
		<div className="octave-wrapper" style={{ left: octave * keyWidth * 7 }}>
			<div className="white-keys">
				{generateArray(7).map(i => {
					const keyIndex = getWhiteKeyIndex(i)
					const keyActive = active || (isNextOctave && keyIndex <= 5)
					return (
						<PianoKey
							key={i}
							velocity={velocity}
							active={keyActive}
							note={startNote + keyIndex}
							noteIndex={isNextOctave ? 12 + keyIndex : keyIndex}
							className="white-key"
							style={{ width: keyWidth, left: keyWidth * i }}
						/>
					)
				})}
			</div>
			<div className="black-keys">
				{generateArray(5).map(i => {
					const keyIndex = getBlackKeyIndex(i)
					const keyActive = active || (isNextOctave && keyIndex <= 5)
					return (
						<PianoKey
							key={i}
							velocity={velocity}
							active={keyActive}
							note={startNote + keyIndex}
							noteIndex={isNextOctave ? 12 + keyIndex : keyIndex}
							className="black-key"
							style={{ width: keyWidth * 0.6, left: getBlackKeyLeft(i, keyWidth) }}
						/>
					)
				})}
			</div>
		</div>
	)
}
