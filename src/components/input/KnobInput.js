import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import { requestPointerLock, exitPointerLock } from '../../utils/screenUtils'

import Donut from './Donut'

export default class KnobInput extends Component {

	static defaultProps = {
		min: 0,
		max: 127,
		step: 1,
		value: 64,
		extraValues: [],
		label: 'Input',
		labelPosition: 'bottom',
		trackSpan: 270,
		trackRotate: 0,
		trackSize: 50,
		trackThickness: 20,
		onChange: () => {},
		valueDisplay: value => value,
	}

	constructor(props) {
		super(props)
		this.elem = null
		this.mouseDown = false
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = _throttle(this.handleMouseMove.bind(this), 1000/60)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
	}

	handleMouseDown(event) {
		if(!this.elem) return
		this.mouseDown = true
		requestPointerLock(this.elem)
		document.addEventListener('mousemove', this.handleMouseMove)
	}

	handleMouseUp(event) {
		if(this.mouseDown) {
			exitPointerLock()
			document.removeEventListener('mousemove', this.handleMouseMove)
			this.mouseDown = false
		}
	}

	handleMouseMove(event) {
		if(this.mouseDown) {
			const { min, max, step, value, onChange } = this.props
			const movementY = event.movementY || event.mozMovementY || 0
			const amount = -movementY*step
			let newValue = value + amount
			if(min && newValue < min) newValue = min
			if(max && newValue > max) newValue = max
			newValue = Math.round(newValue*1000)/1000 // fixes javascript float shitness
			if(amount) onChange(newValue)
		}
	}

	render() {
		const { 
			min, 
			max, 
			value, 
			extraValues, 
			valueDisplay, 
			label, 
			labelPosition, 
			trackSize, 
			trackThickness, 
			trackSpan, 
			trackRotate, 
		} = this.props
		
		const valuePercent = (value - min) / (max - min)
		const extraValuePercents = extraValues.map(val => (val - min) / (max - min))

		let knobStyles = {}
		if(labelPosition == 'top' || labelPosition == 'bottom') knobStyles = {...knobStyles, width: trackSize}
		if(labelPosition == 'left' || labelPosition == 'right') knobStyles = {...knobStyles, height: trackSize}

		return (
			<div 
				ref={elem => this.elem = elem} 
				style={knobStyles}
				className={`knob label-${labelPosition}`} 
				onMouseDown={e => this.handleMouseDown(event)}>

				<div className="knob-inner" style={{width: trackSize, height: trackSize}}>
					<div className="knob-track">
						<Donut 
							span={trackSpan} 
							size={trackSize} 
							rotate={trackRotate} 
							percent={valuePercent} 
							thickness={trackThickness}
							extraValues={extraValuePercents} />
					</div>
					<div className="knob-value">
						{valueDisplay(value)}
					</div>
				</div>
				<label className="knob-label">
					{label}
				</label>
				
			</div>
		)
	}
}