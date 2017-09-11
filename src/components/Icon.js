import React, { Component } from 'react'
import iconLibrary from '../iconLibrary'

const sizes = {
	xsmall: 12,
	small: 18,
	medium: 24,
	large: 32,
	xlarge: 48,
}

export default class Icon extends Component {

	static defaultProps = {
		size: 'medium',
		style: {},
	};

	render() {
		const { size, name, style, width, height, ...rest } = this.props;
		const realSize = typeof size == 'string' ? sizes[size] : size
		const styles = {...style, width: width || realSize, height: height || realSize};

		return (
			<svg className="icon" viewBox="0 0 24 24" style={styles} preserveAspectRatio="xMidYMid meet" {...rest}>
				{iconLibrary[name]}
			</svg>
		)
	}
}