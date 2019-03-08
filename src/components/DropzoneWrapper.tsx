import React, { Component, Children, cloneElement, ReactElement } from 'react'
// import { findDOMNode } from 'react-dom'
import { DropTarget, DropTargetSpec, ConnectDropTarget, DropTargetMonitor, DropTargetCollector } from 'react-dnd'
import { GenericProps } from '../types'
import { NativeTypes } from 'react-dnd-html5-backend'
import classnames from 'classnames'

const spec: DropTargetSpec<Props> = {
	drop(props, monitor) {
		if (props.onDrop) props.onDrop(props, monitor)
	},
}

const collect: DropTargetCollector<Props> = (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
})

interface Props {
	connectDropTarget?: ConnectDropTarget
	isOver?: boolean
	canDrop?: boolean
	onDrop?: (props: GenericProps, monitor: DropTargetMonitor) => void
}

class DropzoneWrapper extends Component<Props> {
	static defaultProps = {
		onDrop: item => console.log('Item dropped', item),
	}

	render() {
		const { children, canDrop, isOver, connectDropTarget } = this.props
		const child = Children.only(children) as ReactElement<any>
		return connectDropTarget(
			cloneElement(child, {
				className: classnames(child.props.className, 'dropzone', { 'is-over': isOver, 'can-drop': canDrop }),
				'data-drop-message': isOver ? 'Release to drop' : 'Drag here',
				// ref: (elem: ReactInstance) => connectDropTarget(elem),
			})
		)
	}
}

export default DropTarget(NativeTypes.FILE, spec, collect)(DropzoneWrapper)
