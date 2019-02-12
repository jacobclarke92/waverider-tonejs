import React, { Component } from 'react'

export default class NumberInput extends Component {
	static defaultProps = {
		autoFocus: false,
		value: 0,
		onChange: () => {},
		beforeOnChange: e => parseFloat(e.target.value),
	}

	componentDidMount() {
		if (this.props.autoFocus) {
			this.input.focus()
			this.input.select()
		}
	}

	render() {
		const { onChange, beforeOnChange, ...props } = this.props
		return (
			<input type="number" ref={elem => (this.input = elem)} onChange={e => onChange(beforeOnChange(e))} {...props} />
		)
	}
}
