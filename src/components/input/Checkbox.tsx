import React, { FunctionComponent } from 'react'

interface Props {
	text?: string
	value: boolean
	onChange: (value: boolean) => void
}

const Checkbox: FunctionComponent<Props> = ({ value, onChange, text }) => (
	<label>
		<input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
		{` ${text || 'Check'}`}
	</label>
)

export default Checkbox
