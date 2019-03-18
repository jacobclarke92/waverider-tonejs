import React, { Component, memo } from 'react'
import { getEffectInstance } from '../../effectsController'
import { OscilloscopeEffect } from '../../effects/oscilloscope'
import { scale } from '../../utils/mathUtils'

interface Props {
	id: number
}
export default class Oscilloscope extends Component<Props> {
	raf: number
	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	instance: OscilloscopeEffect

	constructor(props) {
		super(props)
		this.instance = null
		this.raf = null
		this.monitorLevel = this.monitorLevel.bind(this)
		this.getInstance(props)
		this.state = { level: 0 }
	}

	componentWillUnmount() {
		if (this.raf) cancelAnimationFrame(this.raf)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.id != this.props.id) this.getInstance(nextProps)
	}

	handleRef = (ref: HTMLCanvasElement) => {
		this.canvas = ref
		this.canvas.width = 2 * this.canvas.clientWidth
		this.canvas.height = 2 * this.canvas.clientHeight
		this.ctx = this.canvas.getContext('2d')
	}

	getInstance(props = this.props) {
		const { id } = this.props
		const instance = getEffectInstance(id)
		if (instance) this.instance = instance as OscilloscopeEffect
		if (!this.raf) this.raf = requestAnimationFrame(this.monitorLevel)
	}

	monitorLevel() {
		if (!this.instance) this.getInstance()
		if (this.instance && this.instance.analyser) {
			let values = this.instance.analyser.getValue()

			// this snippet attempts to snap to zero-crossing point
			// let found = false
			// let prev = null
			// values = values.filter(v => {
			// 	if (found) return true
			// 	if (Math.abs(v) < 0.05 && prev != null && prev > v) {
			// 		found = true
			// 		return true
			// 	}
			// 	prev = v
			// 	return false
			// })

			const cW = this.canvas.width
			const cH = this.canvas.height
			this.ctx.clearRect(0, 0, cW, cH)
			this.ctx.beginPath()
			this.ctx.lineWidth = 4
			values.forEach((v, i) => {
				const o = scale(i, 0, values.length, 0, cW)
				const s = scale(v, -1, 1, 0, cH)
				if (i === 0) this.ctx.moveTo(o, s)
				else this.ctx.lineTo(o, s)
			})
			this.ctx.lineCap = 'round'
			this.ctx.strokeStyle = '#4F8DE6'
			this.ctx.stroke()
		}
		this.raf = requestAnimationFrame(this.monitorLevel)
	}

	render() {
		return <canvas ref={this.handleRef} />
	}
}
