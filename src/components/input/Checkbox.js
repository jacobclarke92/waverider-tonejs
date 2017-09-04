import React, { Component } from 'react'

export default ({value, onChange, text}) => (
	<label>
		<input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />{` ${text || 'Check'}`}
	</label>
)