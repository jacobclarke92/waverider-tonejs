import React, { Component } from 'react'

type OptionValue = string | number // | boolean | null
type OptionObj = {
	value: OptionValue
	text: string
	disabled?: boolean
}
interface Props {
	options: OptionObj[]
	empty?: string | false
	value: OptionValue
	defaultValue?: OptionValue
	onChange: (val: OptionValue) => void
	coerceValueToOptions?: boolean
	readOnly?: boolean
	className?: string
}

export default class SelectInput extends Component<Props> {
	static defaultProps = {
		options: [],
		empty: 'Please select ...',
		defaultValue: undefined,
		onChange: () => {},
		coerceValueToOptions: true,
	}

	componentDidUpdate() {
		if (this.props.coerceValueToOptions) this.coerceValueToOptions()
	}

	coerceValueToOptions() {
		const selectedOption = this.props.options.find(({ value }) => value == this.props.value)
		if (!selectedOption) {
			if (this.props.options.length && this.props.empty === false) {
				this.props.onChange(this.props.options[0].value)
			} else if (this.props.value !== this.props.defaultValue) {
				this.props.onChange(this.props.defaultValue)
			}
		}
	}

	renderOptions() {
		const empty = this.props.empty !== false && (
			<option value={this.props.defaultValue} key={0}>
				{this.props.empty}
			</option>
		)
		const options = this.props.options.map((option, i) => {
			const value = typeof option == 'string' ? option : option.value
			const text = typeof option == 'string' ? option : option.text
			const disabled = typeof option == 'string' ? false : option.disabled || false
			return (
				<option key={i + 1} value={value} disabled={disabled}>
					{text}
				</option>
			)
		})
		return empty ? [empty, ...options] : options
	}

	render() {
		const { readOnly, onChange, value, className } = this.props
		return (
			<label className={`select ${className || ''}`}>
				<select
					value={value === null ? undefined : value}
					disabled={readOnly}
					onChange={event => this.props.onChange(event.target.value)}>
					{this.renderOptions()}
				</select>
			</label>
		)
	}
}
