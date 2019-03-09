import React, { Component, FunctionComponent, CSSProperties } from 'react'
import cn from 'classnames'
import { generateArray } from '../../utils/arrayUtils'
import { addKeyDownListener, removeKeyDownListener } from '../../utils/keyUtils'

interface Props {
	octaves?: number
	height?: number
	keyWidth?: number
	startNote?: number
}

interface State {
	activeOctave: number
}

export default class PianoRoll extends Component<Props, State> {
	static defaultProps = {
		octaves: 8,
		height: 100,
		keyWidth: 18,
		startNote: 0,
	}
	constructor(props) {
		super(props)
		this.deincrementActiveOctave = this.deincrementActiveOctave.bind(this)
		this.incrementActiveOctave = this.incrementActiveOctave.bind(this)
		this.state = {
			activeOctave: Math.min(props.octaves, 4),
		}
	}
	componentDidMount() {
		addKeyDownListener('x', this.incrementActiveOctave)
		addKeyDownListener('z', this.deincrementActiveOctave)
	}
	componentWillUnmount() {
		removeKeyDownListener('x', this.incrementActiveOctave)
		removeKeyDownListener('z', this.deincrementActiveOctave)
	}
	incrementActiveOctave() {
		this.setState({ activeOctave: Math.min(this.props.octaves - 1, this.state.activeOctave + 1) })
	}
	deincrementActiveOctave() {
		this.setState({ activeOctave: Math.max(0, this.state.activeOctave - 1) })
	}
	render() {
		const { octaves, startNote, keyWidth, height } = this.props
		const { activeOctave } = this.state
		return (
			<div className={cn('piano-wrapper')} style={{ height }}>
				{generateArray(octaves).map(i => (
					<Octave key={i} octave={i} active={activeOctave === i} keyWidth={keyWidth} startNote={startNote + i * 12} />
				))}
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
			return 6
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
	active: boolean
	keyWidth: number
	startNote: number
}
const Octave: FunctionComponent<OctaveProps> = ({ octave, startNote, active, keyWidth }) => {
	return (
		<div className="octave-wrapper" style={{ left: octave * keyWidth * 7 }}>
			<div className="white-keys">
				{generateArray(7).map(i => (
					<PianoKey
						key={i}
						octaveActive={active}
						note={startNote + getWhiteKeyIndex(i)}
						className="white-key"
						style={{ width: keyWidth, left: keyWidth * i }}
					/>
				))}
			</div>
			<div className="black-keys">
				{generateArray(5).map(i => (
					<PianoKey
						key={i}
						octaveActive={active}
						note={startNote + getBlackKeyIndex(i)}
						className="black-key"
						style={{ width: keyWidth * 0.6, left: getBlackKeyLeft(i, keyWidth) }}
					/>
				))}
			</div>
		</div>
	)
}

interface PianoKeyProps {
	className: string
	note: number
	style: CSSProperties
	octaveActive: boolean
}
interface PianoKeyState {
	active: boolean
}

class PianoKey extends Component<PianoKeyProps, PianoKeyState> {
	static defaultProps = {
		className: '',
		note: 0,
	}
	state = { active: false }
	keyDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: true })
	}
	keyUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		e.stopPropagation()
		this.setState({ active: false })
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
