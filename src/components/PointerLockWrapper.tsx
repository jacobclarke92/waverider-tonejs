import React, { Component, Children, cloneElement, ElementType, ReactNode, ReactElement } from 'react'
import { requestPointerLock, exitPointerLock } from '../utils/screenUtils'
import { PointObj } from '../utils/Point'

interface Props {
	children: ReactNode
	onMovement: (position: PointObj) => void
}

export default class PointerLockWrapper extends Component<Props> {
	elem: HTMLElement | null
	mouseDown: boolean

	static defaultProps = {
		onMovement: () => {},
	}

	constructor(props: Props) {
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

	handleMouseDown(event: MouseEvent, child: ReactElement<any>) {
		if (!this.elem) return
		this.mouseDown = true
		requestPointerLock(this.elem)
		document.addEventListener('mousemove', this.handleMouseMove)
		if (child.props.onMouseDown) child.props.onMouseDown(event)
		event.preventDefault() // stops highlighting
	}

	handleMouseMove(event: MouseEvent) {
		if (this.mouseDown)
			this.props.onMovement({
				x: event.movementX /*|| event.mozMovementX*/ || 0,
				y: event.movementY /*|| event.mozMovementY*/ || 0,
			})
	}

	handleMouseUp(event: MouseEvent) {
		if (this.mouseDown) {
			exitPointerLock()
			document.removeEventListener('mousemove', this.handleMouseMove)
			this.mouseDown = false
		}
	}

	render() {
		const child = Children.only(this.props.children) as ReactElement<any>
		return cloneElement(child, {
			ref: (elem: HTMLElement | null) => (this.elem = elem),
			onMouseDown: (e: React.MouseEvent) => this.handleMouseDown((e as unknown) as MouseEvent, child),
		})
	}
}
