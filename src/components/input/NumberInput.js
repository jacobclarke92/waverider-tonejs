import React from 'react'

export default ({ onChange, ...props }) => (
	<input type="number" onChange={e => onChange(parseFloat(e.target.value))} {...props} />
)
