import React, { Component, Children, cloneElement } from 'react'
import _throttle from 'lodash/throttle'
import { requestPointerLock, exitPointerLock } from '../utils/screenUtils'

export default class PointerLockContainer extends Component {

	static defaultProps = {
		onMovement: () => {},
	}

	constructor(props) {
		super(props)
		this.elem = null
		this.mouseDown = false
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = _throttle(this.handleMouseMove.bind(this), 1000/60)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
	}

	handleMouseDown(event) {
		if(!this.elem) return
		this.mouseDown = true
		requestPointerLock(this.elem)
		document.addEventListener('mousemove', this.handleMouseMove)
		event.preventDefault() // stops highlighting
	}

	handleMouseMove(event) {
		if(this.mouseDown) this.props.onMovement({
			x: event.movementX || event.mozMovementX || 0,
			y: event.movementY || event.mozMovementY || 0,
		})
	}

	handleMouseUp(event) {
		if(this.mouseDown) {
			exitPointerLock()
			document.removeEventListener('mousemove', this.handleMouseMove)
			this.mouseDown = false
		}
	}

	render() {
		return cloneElement(Children.only(this.props.children), {
			ref: elem => this.elem = elem,
			onMouseDown: e => this.handleMouseDown(e),
		})
	}
}