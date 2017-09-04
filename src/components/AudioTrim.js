import React, { Component } from 'react'

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

	handleStartDrag(type) {
		this.dragging = type
		this.previousPosition = {...this.props.trim}
	}

	handleMouseUp(e) {
		if(this.dragging) this.props.onAfterChange(this.props.trim, this.previousPosition)
		this.dragging = false
	}

	handleMouseMove(e) {
		if(!this.dragging) return
		
		const mouseX = !!e.touches ? e.touches[0].pageX : e.pageX
		const rect = this.container.getBoundingClientRect()
		const relativePos = Math.min(1, Math.max(0, (mouseX - rect.left) / rect.width))
		
		const trim = {...this.props.trim}
		trim[this.dragging] = relativePos

		const tmpStart = trim.start

		// swap selectors if they cross over
		if(trim.start > trim.end || trim.end < trim.start) {
			trim.start = trim.end
			trim.end = tmpStart
			this.dragging = this.dragging == 'start' ? 'end' : 'start'
		}

		this.props.onChange(trim)
	}

	render() {
		const { start, end } = this.props.trim
		const duration = end - start

		return (
			<div className="audio-trim-container" ref={elem => this.container = elem}>
				<div className="trim-area" style={{left: (start*100)+'%', width: (duration*100)+'%'}} />
				<div className="trim-left" style={{left: (start*100)+'%'}} onMouseDown={() => this.handleStartDrag('start')} />
				<div className="trim-right" style={{left: (end*100)+'%'}} onMouseDown={() => this.handleStartDrag('end')} />
			</div>
		)	
	}
}