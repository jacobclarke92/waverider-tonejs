import React, { useEffect } from 'react'

export type OptionValue = string | number | null
export type OptionObj<Value extends OptionValue = OptionValue> = {
	value: Value
	text: string
	disabled?: boolean
}

export interface Props<Value extends OptionValue = OptionValue> {
	options: OptionObj<Value>[]
	empty?: string | false
	value: Value
	defaultValue?: Value | null
	onChange: (val: Value | null) => void
	coerceValueToOptions?: boolean
	readOnly?: boolean
	className?: string
}

export default function SelectInput<Value extends OptionValue>({
	options = [],
	empty = 'Please select ...',
	value,
	defaultValue = null,
	onChange,
	coerceValueToOptions = true,
	readOnly,
	className,
}: Props<Value>) {
	useEffect(() => {
		if (coerceValueToOptions) {
			const selectedOption = options.find(opt => opt.value == value) // loose comparison intentional
			if (!selectedOption) {
				if (options.length && empty === false) {
					onChange(options[0].value)
				} else if (value !== defaultValue) {
					onChange(defaultValue)
				}
			}
		}
	}, [value, options, coerceValueToOptions, empty, defaultValue, onChange])

	const renderOptions = () => {
		const emptyOption = empty !== false && (
			<option value={defaultValue ?? ''} key="empty">
				{empty}
			</option>
		)
		
		const mappedOptions = options.map((option, i) => {
			const optValue = option.value === null ? '' : option.value
			return (
				<option key={`${i}-${optValue}`} value={optValue} disabled={option.disabled || false}>
					{option.text}
				</option>
			)
		})
		
		return emptyOption ? [emptyOption, ...mappedOptions] : mappedOptions
	}

	// In HTML <select>, null needs to be mapped to empty string for React to handle the "empty/unselected" state properly
	const selectValue = value === null ? '' : value

	return (
		<label className={`select ${className || ''}`}>
			<select
				value={selectValue}
				disabled={readOnly}
				onChange={event => {
					// Need to find the exact typed value instead of passing string from event
					const targetStr = event.target.value
					if (targetStr === '' || (defaultValue === null && targetStr === String(defaultValue))) {
						return onChange(defaultValue ?? null)
					}
					// Find original object by string comparison to avoid changing numbers to strings
					const matched = options.find(opt => String(opt.value) === targetStr)
					onChange(matched ? matched.value : targetStr as Value)
				}}>
				{renderOptions()}
			</select>
		</label>
	)
}
