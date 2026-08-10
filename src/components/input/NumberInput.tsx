import React, { FormEvent, useEffect, useRef } from 'react'

interface Props {
	autoFocus?: boolean
	value: number
	min?: number
	max?: number
	step?: number
	onChange: (val: number) => void
	onBlur?: (e: FormEvent<HTMLInputElement>) => void
	beforeOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => number
	className?: string
}

export default function NumberInput({
	autoFocus = false,
	value = 0,
	onChange,
	beforeOnChange = e => parseFloat(e.target.value),
	...props
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (autoFocus && inputRef.current) {
			inputRef.current.focus()
			inputRef.current.select()
		}
	}, [autoFocus])

	return <input type="number" ref={inputRef} value={value} onChange={e => onChange(beforeOnChange(e))} {...props} />
}
