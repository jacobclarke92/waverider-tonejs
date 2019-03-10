import React, { Component, CSSProperties } from 'react'
import iconLibrary from '../iconLibrary'
import { SizeType } from '../types'

const sizes: { [k in SizeType]: number } = {
	xs: 12,
	s: 18,
	m: 24,
	l: 32,
	xl: 48,
}

interface Props {
	name: string
	size?: number | SizeType
	style?: CSSProperties
	width?: number
	height?: number
}

export default class Icon extends Component<Props> {
	static defaultProps = {
		size: 'm',
		style: {},
	}

	render() {
		const { size, name, style, width, height, ...rest } = this.props
		const realSize = typeof size == 'string' ? sizes[size] : size
		const styles = { ...style, width: width || realSize, height: height || realSize }

		return (
			<svg className="icon" viewBox="0 0 24 24" style={styles} preserveAspectRatio="xMidYMid meet" {...rest}>
				{iconLibrary[name]}
			</svg>
		)
	}
}
