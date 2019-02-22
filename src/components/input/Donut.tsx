import React, { Component } from 'react'

interface Props {
	size?: number
	span?: number
	rotate?: number
	percent?: number
	extraValues?: number[]
	thickness?: number
	signed: boolean
}

export default class Donut extends Component<Props> {
	static defaultProps = {
		size: 50, // px
		span: 234, // degrees
		rotate: 0, // degrees
		percent: 0.5,
		extraValues: [],
		thickness: 5,
		signed: false,
	}

	render() {
		const { size, thickness, rotate, span, percent, extraValues, signed } = this.props
		const strokeWidth = thickness * (100 / size)
		const radius = size - strokeWidth / 2

		const theta = (size * 2 - strokeWidth) * Math.PI
		const ringDashLength = theta * (span / 360)
		const valueDashLength = ringDashLength * percent
		const rotateValue = 90 + rotate + (360 - span) / 2

		return (
			<svg width={size} height={size} viewBox="0 0 100 100" className="donut">
				<g transform={`rotate(${rotateValue} 50 50)`}>
					<circle
						className="donut-ring"
						cx="50"
						cy="50"
						r={radius}
						fill="transparent"
						stroke="#ccc"
						strokeWidth={strokeWidth}
						strokeDasharray={`${ringDashLength} 1000`}
						strokeDashoffset="0"
					/>

					{!signed && (
						<circle
							className="donut-segment"
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="green"
							strokeWidth={strokeWidth}
							strokeDasharray={`${valueDashLength} 1000`}
							strokeDashoffset="0"
						/>
					)}
					{extraValues.map((extraPercent, i) => (
						<circle
							key={i}
							className="donut-line"
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="red"
							strokeWidth={strokeWidth}
							strokeDasharray="3 1000"
							strokeDashoffset={-ringDashLength * extraPercent}
						/>
					))}
					{signed && (
						<circle
							className="donut-segment"
							cx="50"
							cy="50"
							r={radius}
							fill="transparent"
							stroke="green"
							strokeWidth={strokeWidth}
							strokeDasharray="3 1000"
							strokeDashoffset={-valueDashLength}
						/>
					)}
				</g>
			</svg>
		)
	}
}
