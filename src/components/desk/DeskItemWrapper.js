import React, { Component, Children, cloneElement } from 'react'
import classnames from 'classnames'

export default class DeskItemWrapper extends Component {

	constructor(props) {
		super(props)
		this.deskItemElem = null
	}

	handleMouseDown(event, childProps) {
		this.props.onPointerDown(event, this.deskItemElem)
		if(childProps.onMouseDown) childProps.onMouseDown(event)
	}

	handleMouseUp(event, childProps) {
		this.props.onPointerUp(event, this.deskItemElem)
		if(childProps.onMouseUp) childProps.onMouseUp(event)
	}

	render() {
		const { children, deskItem = {}, dragging } = this.props
		const child = Children.only(children)
		const { className, styles = {} } = child.props

		const { position } = deskItem
		const wrapperStyles = {
			transform: `translate(${position.x || 0}px, ${position.y || 0}px)`,
		}

		return cloneElement(child, {
			ref: elem => this.deskItemElem = elem,
			className: classnames(className, 'desk-item', {dragging}),
			style: {...styles, ...wrapperStyles},
			onMouseDown: e => this.handleMouseDown(e, child.props),
			onMouseUp: e => this.handleMouseUp(e, child.props),
		})
	}
}