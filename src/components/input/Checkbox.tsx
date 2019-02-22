import React from 'react'

export default ({ value, onChange, text }: { value: boolean; onChange: (boolean) => void; text?: string }) => (
	<label>
		<input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
		{` ${text || 'Check'}`}
	</label>
)
