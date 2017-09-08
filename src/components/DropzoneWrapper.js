import React, { Component, Children, cloneElement } from 'react'
import { findDOMNode } from 'react-dom'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import classnames from 'classnames'

const boxTarget = {
	drop(props, monitor) {
		if(props.onDrop) props.onDrop(props, monitor)
	}
}

class DropzoneWrapper extends Component {

	static defaultProps = {
		onDrop: item => console.log('Item dropped', item),
	}

	render() {
		const { children, canDrop, isOver, connectDropTarget } = this.props
		const child = Children.only(children)
		return cloneElement(child, {
			className: classnames(child.props.className, 'dropzone', {'is-over': isOver, 'can-drop': canDrop}),
			'data-drop-message': isOver ? 'Release to drop' : 'Drag here',
			ref: elem => connectDropTarget(findDOMNode(elem)),
		})
	}
}

export default DropTarget(props => props.accepts || NativeTypes.FILE, boxTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
}))(DropzoneWrapper)