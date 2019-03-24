import React, { Component } from 'react'
import { getRelativeMousePosition, getRelativeMousePositionNative, MousePosition } from '../utils/screenUtils'

type DragType = false | 'move' | 'start' | 'end'

export interface TrimType {
	start: number
	end: number
}

interface Props {
	onChange: (trim: TrimType) => void
	onAfterChange: (trim: TrimType, previousTrim: TrimType) => void
	trim: TrimType
}

export default class AudioTrim extends Component<Props> {
	dragging: DragType
	initDragMousePosition: MousePosition
	previousPosition: TrimType
	container: HTMLDivElement

	static defaultProps = {
		onChange: () => {},
		onAfterChange: () => {},
		trim: {
			start: 0,
			end: 1,
		},
	}

	constructor(props) {
		super(props)
		this.dragging = false
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
		document.addEventListener('touchend', this.handleMouseUp)
		document.addEventListener('mousemove', this.handleMouseMove)
		document.addEventListener('touchmove', this.handleMouseMove)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
		document.removeEventListener('touchend', this.handleMouseUp)
		document.removeEventListener('mousemove', this.handleMouseMove)
		document.removeEventListener('touchmove', this.handleMouseMove)
	}

	handleStartDrag<EventElemType>(
		type: DragType,
		event: React.MouseEvent<EventElemType, MouseEvent> | React.TouchEvent<EventElemType>
	) {
		this.dragging = type
		this.initDragMousePosition = getRelativeMousePosition(event, this.container)
		this.previousPosition = { ...this.props.trim }
		event.preventDefault()
	}

	handleMouseUp(event: MouseEvent | TouchEvent) {
		if (this.dragging) this.props.onAfterChange(this.props.trim, this.previousPosition)
		this.dragging = false
	}

	handleMouseMove(event: MouseEvent | TouchEvent) {
		if (!this.dragging) return

		const mousePosition = getRelativeMousePositionNative(event, this.container)
		const trim = { ...this.props.trim }

		if (this.dragging == 'move') {
			const percentDiffX = mousePosition.percent.x - this.initDragMousePosition.percent.x
			trim.start = this.previousPosition.start + percentDiffX
			trim.end = this.previousPosition.end + percentDiffX

			if (trim.start < 0) {
				trim.end -= trim.start
				trim.start = 0
			} else if (trim.end > 1) {
				trim.start -= trim.end - 1
				trim.end = 1
			}
		} else {
			trim[this.dragging] = mousePosition.percent.x

			// swap selectors if they cross over
			if (trim.start > trim.end || trim.end < trim.start) {
				const tmpStart = trim.start
				trim.start = trim.end
				trim.end = tmpStart
				this.dragging = this.dragging == 'start' ? 'end' : 'start'
			}
		}

		this.props.onChange(trim)
	}

	render() {
		const { start, end } = this.props.trim
		const duration = end - start

		return (
			<div className="audio-trim-container" ref={elem => (this.container = elem)}>
				<div
					className="trim-area"
					style={{ left: start * 100 + '%', width: duration * 100 + '%' }}
					onMouseDown={e => this.handleStartDrag('move', e)}
					onTouchStart={e => this.handleStartDrag('move', e)}
				/>
				<div
					className="trim-left"
					style={{ left: start * 100 + '%' }}
					onMouseDown={e => this.handleStartDrag('start', e)}
					onTouchStart={e => this.handleStartDrag('start', e)}
				/>
				<div
					className="trim-right"
					style={{ left: end * 100 + '%' }}
					onMouseDown={e => this.handleStartDrag('end', e)}
					onTouchStart={e => this.handleStartDrag('end', e)}
				/>
			</div>
		)
	}
}
