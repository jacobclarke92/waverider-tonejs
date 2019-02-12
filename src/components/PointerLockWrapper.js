import React, { Component, Children, cloneElement } from 'react'
import { requestPointerLock, exitPointerLock } from '../utils/screenUtils'

export default class PointerLockWrapper extends Component {
	static defaultProps = {
		onMovement: () => {},
	}

	constructor(props) {
		super(props)
		this.elem = null
		this.mouseDown = false
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
	}

	handleMouseDown(event, child) {
		if (!this.elem) return
		this.mouseDown = true
		requestPointerLock(this.elem)
		document.addEventListener('mousemove', this.handleMouseMove)
		if (child.props.onMouseDown) child.props.onMouseDown(event)
		event.preventDefault() // stops highlighting
	}

	handleMouseMove(event) {
		if (this.mouseDown)
			this.props.onMovement({
				x: event.movementX || event.mozMovementX || 0,
				y: event.movementY || event.mozMovementY || 0,
			})
	}

	handleMouseUp(event) {
		if (this.mouseDown) {
			exitPointerLock()
			document.removeEventListener('mousemove', this.handleMouseMove)
			this.mouseDown = false
		}
	}

	render() {
		const child = Children.only(this.props.children)
		return cloneElement(child, {
			ref: elem => (this.elem = elem),
			onMouseDown: e => this.handleMouseDown(e, child),
		})
	}
}
