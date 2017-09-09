import React, { Component } from 'react'
import { getRelativeMousePosition } from '../utils/screenUtils'

export default class AudioTrim extends Component {

	static defaultProps = {
		onChange: () => {},
		onAfterChange: () => {},
		trim: {
			start: 0,
			end: 1,
		}
	};

	constructor(props) {
		super(props)
		this.dragging = false
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
		document.addEventListener('mousemove', this.handleMouseMove)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
		document.removeEventListener('mousemove', this.handleMouseMove)
	}

	handleStartDrag(type, event) {
		this.dragging = type
		this.initDragMousePosition = getRelativeMousePosition(event, this.container)
		this.previousPosition = {...this.props.trim}
		event.preventDefault()
	}

	handleMouseUp(event) {
		if(this.dragging) this.props.onAfterChange(this.props.trim, this.previousPosition)
		this.dragging = false
	}

	handleMouseMove(event) {
		if(!this.dragging) return
		
		const mousePosition = getRelativeMousePosition(event, this.container)
		const trim = {...this.props.trim}

		if(this.dragging == 'move') {

			const percentDiffX = mousePosition.percent.x - this.initDragMousePosition.percent.x
			trim.start = this.previousPosition.start + percentDiffX
			trim.end = this.previousPosition.end + percentDiffX

			if(trim.start < 0) {
				trim.end -= trim.start
				trim.start = 0
			}else if(trim.end > 1) {
				trim.start -= trim.end-1
				trim.end = 1
			}

		}else{

			trim[this.dragging] = mousePosition.percent.x

			// swap selectors if they cross over
			if(trim.start > trim.end || trim.end < trim.start) {
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
			<div className="audio-trim-container" ref={elem => this.container = elem}>
				<div className="trim-area" style={{left: (start*100)+'%', width: (duration*100)+'%'}} onMouseDown={e => this.handleStartDrag('move', e)} />
				<div className="trim-left" style={{left: (start*100)+'%'}} onMouseDown={e => this.handleStartDrag('start', e)} />
				<div className="trim-right" style={{left: (end*100)+'%'}} onMouseDown={e => this.handleStartDrag('end', e)} />
			</div>
		)	
	}
}