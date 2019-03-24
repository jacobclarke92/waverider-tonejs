import React, { Component, MouseEvent, CSSProperties } from 'react'
import _throttle from 'lodash/throttle'
import { clamp, roundToMultiple } from '../../utils/mathUtils'
import { addKeyListener, removeKeyListener, isAltKeyPressed } from '../../utils/keyUtils'

import Donut from './Donut'
import NumberInput from './NumberInput'
import PointerLockWrapper from '../PointerLockWrapper'
import { PointObj } from '../../utils/Point'
import { GenericProps } from '../../types'

type LabelPosition = 'top' | 'right' | 'bottom' | 'left'
type InputValidatorFunc = (val: number) => number | false
interface Props {
	min?: number
	max?: number
	step?: number
	value?: number
	defaultValue?: number
	extraValues?: number[]
	signed?: boolean
	label: string
	labelPosition?: LabelPosition
	trackSpan?: number
	trackRotate?: number
	trackSize?: number
	trackThickness?: number
	dragSensitivity?: number
	inputProps: GenericProps
	inputValidator?: InputValidatorFunc
	inputValueIsDisplayValue?: boolean
	loading?: boolean
	onChange: (val: number) => void
	valueDisplay?: (val: number) => string
}

interface State {
	editing: boolean
	inputValue: number
}

export default class KnobInput extends Component<Props, State> {
	stepNotch: number
	dragValue: number
	inputValidator: InputValidatorFunc

	static defaultProps = {
		min: 0,
		max: 127,
		step: 1,
		value: 64,
		defaultValue: 64,
		extraValues: [],
		signed: null,
		label: 'Input',
		labelPosition: 'bottom',
		trackSpan: 270,
		trackRotate: 0,
		trackSize: 45,
		trackThickness: 8,
		dragSensitivity: 128,
		inputProps: {},
		inputValueIsDisplayValue: false,
		loading: false,
		onChange: () => {},
		// valueDisplay: value => value,
	}

	constructor(props: Props) {
		super(props)
		const { value, min, max, step, dragSensitivity, inputValidator } = props
		this.stepNotch = ((max - min) * step) / dragSensitivity
		this.dragValue = value
		this.setInputValue = this.setInputValue.bind(this)
		this.handleMovement = _throttle(this.handleMovement.bind(this), 1000 / 60)
		this.inputValidator = inputValidator || this.validateInput
		this.state = {
			editing: false,
			inputValue: value,
		}
	}

	handleMouseDown(event: MouseEvent<HTMLElement>) {
		const { value, defaultValue, onChange } = this.props
		this.dragValue = value
		if (isAltKeyPressed()) onChange(defaultValue)
	}

	handleMovement({ x, y }: PointObj) {
		const { min, max, step, onChange } = this.props
		const amount = -y * this.stepNotch
		this.dragValue += amount
		let newValue = this.dragValue
		if (newValue % step !== 0) newValue = roundToMultiple(newValue, step)
		newValue = clamp(newValue, min, max)
		onChange(newValue)
	}

	handleDoubleClick(event: MouseEvent<HTMLElement>) {
		const { inputValueIsDisplayValue, value, valueDisplay } = this.props
		this.setState(
			{
				editing: true,
				inputValue: value, //inputValueIsDisplayValue ? valueDisplay(value) : value,
			},
			() => {
				addKeyListener('enter', this.setInputValue)
			}
		)
	}

	validateInput(newValue) {
		const { min, max, step } = this.props
		if (newValue % step !== 0) newValue = roundToMultiple(newValue, step)
		newValue = clamp(newValue, min, max)
		return newValue
	}

	setInputValue() {
		const { value, onChange } = this.props
		const { inputValue } = this.state
		removeKeyListener('enter', this.setInputValue)
		this.setState({ editing: false })
		const newValue = this.inputValidator(inputValue)
		if (newValue === false || inputValue == value || newValue == value) return
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

		let knobStyles: CSSProperties = {}
		if (labelPosition == 'top' || labelPosition == 'bottom') knobStyles = { ...knobStyles, width: trackSize }
		if (labelPosition == 'left' || labelPosition == 'right') knobStyles = { ...knobStyles, height: trackSize }

		const extendedInputProps = { min, max, step, value: inputValue, ...inputProps }
		const trackProps = { span: trackSpan, size: trackSize, rotate: trackRotate, thickness: trackThickness }

		return (
			<PointerLockWrapper onMovement={vector => this.handleMovement(vector)}>
				<div
					style={knobStyles}
					className={`knob label-${labelPosition}`}
					onMouseDown={e => this.handleMouseDown(e)}
					onDoubleClick={e => this.handleDoubleClick(e)}>
					<div className="knob-inner" style={{ width: trackSize, height: trackSize }}>
						<div className="knob-track">
							<Donut
								{...trackProps}
								signed={typeof signed == 'boolean' ? signed : min < 0 && max > 0}
								percent={valuePercent}
								extraValues={extraValuePercents}
							/>
						</div>
						<div className="knob-value">
							{editing ? (
								<NumberInput
									autoFocus
									{...extendedInputProps}
									onChange={inputValue => this.setState({ inputValue })}
									onBlur={e => this.setInputValue()}
								/>
							) : valueDisplay ? (
								valueDisplay(value)
							) : step % 1 === 0 ? (
								value
							) : (
								value.toFixed(2)
							)}
						</div>
					</div>
					<label className="knob-label">{label}</label>
				</div>
			</PointerLockWrapper>
		)
	}
}
