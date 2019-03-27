import React, { Component } from 'react'
import deepEqual from 'deep-equal'
import _find from 'lodash/find'
import _throttle from 'lodash/throttle'
import { PointObj } from '../../utils/Point'

import { clamp, curvesHashTable } from '../../utils/mathUtils'
import { isShiftKeyPressed } from '../../utils/keyUtils'
import { getRelativeMousePosition, getRelativeMousePositionNative } from '../../utils/screenUtils'

let counter = 0

type ArrayPoint = [number, number]

interface CurvePoint extends PointObj {
	id: number
}

interface Props {
	size?: number
	outputSize?: number
	lineWidth?: number
	throttle?: number
	strokeStyle?: string
	onChange?: (points: ArrayPoint[]) => void
	defaultValue?: ArrayPoint[]
}

interface State {
	points: CurvePoint[]
}

export default class CurveCreator extends Component<Props, State> {
	container: HTMLDivElement
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	capturingMouseMove: boolean
	currentPointId: number
	lastMousePosition: PointObj

	static defaultProps = {
		size: 400,
		outputSize: 255,
		lineWidth: 4,
		throttle: 1000 / 50,
		strokeStyle: '#333c47',
		onChange: () => console.log('[CurveCreator] no onChange prop'),
	}

	constructor(props: Props) {
		super(props)
		this.ctx = null
		this.currentPointId = null
		this.lastMousePosition = null
		this.capturingMouseMove = false
		this.handleCallback = _throttle(this.handleCallback, props.throttle)
		const points: CurvePoint[] = props.defaultValue
			? props.defaultValue.map(point => ({
					id: ++counter,
					x: (point[0] / props.outputSize) * props.size,
					y: ((props.outputSize - point[1]) / props.outputSize) * props.size,
			  }))
			: [{ id: ++counter, x: 0, y: props.size }, { id: ++counter, x: props.size, y: 0 }]
		this.state = { points }
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.handleMouseMove)
		document.addEventListener('mouseup', this.handleMouseUp)
		this.handleCurveDraw(this.state.points)
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.handleMouseMove)
		document.removeEventListener('mouseup', this.handleMouseUp)
	}

	// Resets state points if points change, e.g. reset button pressed
	componentWillReceiveProps(nextProps) {
		if (!this.capturingMouseMove && !deepEqual(this.props.defaultValue, nextProps.defaultValue)) {
			const { size, outputSize } = this.props
			const points: CurvePoint[] = nextProps.defaultValue.map(point => ({
				id: ++counter,
				x: (point[0] / outputSize) * size,
				y: ((outputSize - point[1]) / outputSize) * size,
			}))
			this.setState({ points })
		}
	}

	handleMouseUp = (event: MouseEvent) => {
		this.capturingMouseMove = false
	}

	handleMouseMove = (event: MouseEvent) => {
		if (this.capturingMouseMove) {
			const mousePosition = getRelativeMousePositionNative(event, this.container)
			const newPointPosition = { ...mousePosition }

			// check if shift key is down for fine-precision adjustments
			if (isShiftKeyPressed()) {
				const oldPointPosition = _find(this.state.points, { id: this.currentPointId })
				newPointPosition.x = oldPointPosition.x + (mousePosition.x - this.lastMousePosition.x) / 5
				newPointPosition.y = oldPointPosition.y + (mousePosition.y - this.lastMousePosition.y) / 5
			}

			this.lastMousePosition = mousePosition

			// clamp point position inside grid
			newPointPosition.x = clamp(newPointPosition.x, 0, this.props.size)
			newPointPosition.y = clamp(newPointPosition.y, 0, this.props.size)

			const points = this.state.points.map(point =>
				point.id == this.currentPointId ? { ...point, ...newPointPosition } : point
			)

			this.setState({ points }, () => {
				this.handleCallback(points.map<ArrayPoint>(point => [point.x, point.y]))
			})
		}
	}

	handleNewMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		// get relative mouse position and set last mouse position to that
		const mousePosition = getRelativeMousePosition(event, this.container)
		this.capturingMouseMove = true
		this.lastMousePosition = mousePosition

		const { points } = this.state
		points.push({ id: ++counter, ...mousePosition })

		this.currentPointId = counter
		console.log('Created new point', mousePosition)

		// persist event and send it to mousemove handler to place point
		event.persist()
		this.handleMouseMove(event.nativeEvent)
	}

	handlePointMouseDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>, point: CurvePoint) {
		this.capturingMouseMove = true
		this.currentPointId = point.id
		this.lastMousePosition = { x: point.x, y: point.y }
		event.stopPropagation()
	}

	handleCallback(points: ArrayPoint[]) {
		const { size, outputSize } = this.props
		const newPoints = points.map<ArrayPoint>(point => [
			(point[0] / size) * outputSize,
			((size - point[1]) / size) * outputSize,
		])
		this.props.onChange(newPoints)
	}

	handleCurveDraw(_points: CurvePoint[]) {
		const { size, strokeStyle, lineWidth } = this.props
		const points = _points.map<[number, number]>(point => [point.x, point.y])
		const hashTable = curvesHashTable(points, 0, size)
		console.log(hashTable)

		if (!this.ctx) this.ctx = this.canvas.getContext('2d')
		this.ctx.clearRect(0, 0, size, size)
		this.ctx.beginPath()
		this.ctx.strokeStyle = strokeStyle
		this.ctx.lineWidth = lineWidth
		for (let i = 0; i < size; i++) {
			if (i === 0) this.ctx.moveTo(i, hashTable[i])
			else this.ctx.lineTo(i, hashTable[i])
		}
		this.ctx.stroke()
	}

	handlePointDelete(id: number) {
		const points = this.state.points.filter(point => point.id !== id)
		this.setState({ points })
	}

	componentWillUpdate(nextProps: Props, nextState: State) {
		this.handleCurveDraw(nextState.points)
	}

	render() {
		const { size, outputSize } = this.props
		const { points } = this.state

		return (
			<div
				ref={ref => (this.container = ref)}
				style={{ width: size, height: size }}
				className="curve-creator grid-pattern"
				onMouseDown={this.handleNewMouseDown}>
				<canvas ref={ref => (this.canvas = ref)} className="curve-line" width={size} height={size} />
				{points.map((point, i) => (
					<div
						key={i}
						className="curve-point"
						style={{ left: point.x, top: point.y }}
						onMouseDown={event => this.handlePointMouseDown(event, point)}
						onDoubleClick={event => this.handlePointDelete(point.id)}
						data-label={
							Math.round((point.x / size) * outputSize) + ', ' + Math.round(((size - point.y) / size) * outputSize)
						}
					/>
				))}
			</div>
		)
	}
}
