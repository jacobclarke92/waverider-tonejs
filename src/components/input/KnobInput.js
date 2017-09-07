import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import { clamp, roundToMultiple } from '../../utils/mathUtils'
import { addKeyListener, removeKeyListener } from '../../utils/keyUtils'
import { requestPointerLock, exitPointerLock } from '../../utils/screenUtils'

import Donut from './Donut'
import NumberInput from './NumberInput'
import PointerLockContainer from '../PointerLockContainer'

export default class KnobInput extends Component {

	static defaultProps = {
		min: 0,
		max: 127,
		step: 1,
		value: 64,
		extraValues: [],
		signed: null,
		label: 'Input',
		labelPosition: 'bottom',
		trackSpan: 270,
		trackRotate: 0,
		trackSize: 45,
		trackThickness: 8,
		dragSensitivity: 512,
		inputProps: {},
		inputValidator: null,
		inputValueIsDisplayValue: false,
		loading: false,
		onChange: () => {},
		valueDisplay: value => value,
	}

	constructor(props) {
		super(props)
		const { value, min, max, step, dragSensitivity, inputValidator } = props
		this.input = null
		this.stepNotch = ((max - min) / step) / dragSensitivity
		this.dragValue = value
		this.setInputValue = this.setInputValue.bind(this)
		this.inputValidator = inputValidator || this.validateInput
		this.state = {
			editing: false,
			inputValue: value,
		}
	}

	handleMovement({x, y}) {
		const { min, max, step, value, onChange } = this.props
		const amount = -y*this.stepNotch
		this.dragValue += amount
		let newValue = this.dragValue
		if(newValue%step !== 0) newValue = roundToMultiple(newValue, step)
		newValue = clamp(newValue, min, max)
		onChange(newValue)
	}

	handleDoubleClick() {
		const { inputValueIsDisplayValue, value, valueDisplay } = this.props
		this.setState({
			editing: true, 
			inputValue: inputValueIsDisplayValue ? valueDisplay(value) : value,
		}, () => {
			addKeyListener('enter', this.setInputValue)
		})
	}

	validateInput(newValue) {
		const { min, max, step } = this.props
		if(newValue%step !== 0) newValue = roundToMultiple(newValue, step)
		newValue = clamp(newValue, min, max)
		return newValue
	}

	setInputValue() {
		const { value, onChange, valueInterpretter } = this.props
		const { inputValue } = this.state
		removeKeyListener('enter', this.setInputValue)
		this.setState({editing: false})
		const newValue = this.inputValidator(inputValue)
		if(newValue === false || inputValue == value || newValue == value) return
		else onChange(newValue)
	}

	render() {
		const { editing, inputValue } = this.state
		const { 
			min, 
			max, 
			step,
			value, 
			extraValues, 
			valueDisplay,
			signed, 
			label, 
			labelPosition, 
			trackSize, 
			trackThickness, 
			trackSpan, 
			trackRotate, 
			inputProps,
		} = this.props
		
		const valuePercent = (value - min) / (max - min)
		const extraValuePercents = extraValues.map(val => (val - min) / (max - min))

		let knobStyles = {}
		if(labelPosition == 'top' || labelPosition == 'bottom') knobStyles = { ...knobStyles, width: trackSize }
		if(labelPosition == 'left' || labelPosition == 'right') knobStyles = { ...knobStyles, height: trackSize }

		const extendedInputProps = { min, max, step, value: inputValue, ...inputProps }
		const trackProps = { span: trackSpan, size: trackSize, rotate: trackRotate, thickness: trackThickness }

		return (
			<PointerLockContainer onMovement={vector => this.handleMovement(vector)}>
				<div 
					ref={elem => this.elem = elem} 
					style={knobStyles}
					className={`knob label-${labelPosition}`} 
					onMouseDown={e => this.handleMouseDown(e)}
					onDoubleClick={e => this.handleDoubleClick(e)}>

					<div className="knob-inner" style={{width: trackSize, height: trackSize}}>
						<div className="knob-track">
							<Donut 
								{...trackProps}
								signed={signed !== null ? signed : min < 0 && max > 0}
								percent={valuePercent} 
								extraValues={extraValuePercents} />
						</div>
						<div className="knob-value">
							{editing ? (
								<NumberInput 
									autoFocus
									{...extendedInputProps}
									onChange={inputValue => this.setState({inputValue})}
									onBlur={e => this.setInputValue()} />
							) : valueDisplay(value)}
						</div>
					</div>
					<label className="knob-label">
						{label}
					</label>

				</div>
			</PointerLockContainer>
		)
	}
}