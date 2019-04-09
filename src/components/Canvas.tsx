import React, { Component } from 'react'
import { checkDifferenceAny } from '../utils/lifecycleUtils'

interface Props {
	width: number
	height: number
	onReady: (ctx: CanvasRenderingContext2D, ref: HTMLCanvasElement) => void
}

interface State {
	pixelRatio: number
}

export default class Canvas extends Component<Props, State> {
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	pixelRatioQuery: MediaQueryList

	constructor(props: Props) {
		super(props)
		this.state = { pixelRatio: window.devicePixelRatio || 1 }
		this.pixelRatioQuery = window.matchMedia('screen and (max-resolution: 1dppx)')
	}

	componentDidMount() {
		this.pixelRatioQuery.addListener(this.handlePixelRatioChange)
	}

	componentWillUnmount() {
		this.pixelRatioQuery.removeListener(this.handlePixelRatioChange)
	}

	componentDidUpdate(prevProps: Props) {
		if (checkDifferenceAny(this.props, prevProps, ['width', 'height'])) {
			this.initCanvas()
		}
	}

	handlePixelRatioChange = (e: MediaQueryListEvent) => {
		this.setState({ pixelRatio: window.devicePixelRatio || 1 }, this.initCanvas)
	}

	handleRef = (ref: HTMLCanvasElement) => {
		this.canvas = ref
		this.ctx = this.canvas.getContext('2d')
		this.initCanvas()
		this.props.onReady(this.ctx, this.canvas)
	}

	initCanvas() {
		const { pixelRatio } = this.state
		const rect = this.canvas.getBoundingClientRect()
		this.canvas.width = rect.width * pixelRatio
		this.canvas.height = rect.height * pixelRatio
		this.ctx.scale(pixelRatio, pixelRatio)
	}

	render() {
		const { width, height } = this.props
		return <canvas ref={this.handleRef} style={{ width, height }} />
	}
}
