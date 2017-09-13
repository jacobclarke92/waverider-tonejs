import React, { Component, Children, cloneElement } from 'react'
import classnames from 'classnames'
import Connection from './Connection'

export default class DeskItemWrapper extends Component {

	static defaultProps = {
		deskItem: {},
		dragging: false,
		onPointerDown: () => {},
		onPointerUp: () => {}
	}

	constructor(props) {
		super(props)
		this.deskItemElem = null
		this.rect = null
	}

	gotRef(elem) {
		if(elem && elem != this.deskItemElem) {
			this.deskItemElem = elem
			this.rect = elem.getBoundingClientRect()
			this.forceUpdate()
		}
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
		const { children, deskItem, dragging } = this.props
		const { position, audioInput, audioOutput } = deskItem
		const wrapperStyles = {
			transform: `translate(${position.x || 0}px, ${position.y || 0}px)`,
			width: this.rect ? this.rect.width : 70,
			height: this.rect ? this.rect.height : 70,
		}

		const child = Children.only(children)
		const { className, styles = {} } = child.props

		const newChild = cloneElement(child, {
			ref: elem => this.gotRef(elem),
			onMouseDown: e => this.handleMouseDown(e, child.props),
			onMouseUp: e => this.handleMouseUp(e, child.props),
		})

		return (
			<div 
				className={classnames('desk-item-wrapper', {dragging})}
				style={wrapperStyles}>
				{newChild}
				{audioInput && <Connection type="audio" flow="input" />}
				{audioOutput && <Connection type="audio" flow="output" />}
			</div>
		)
	}
}