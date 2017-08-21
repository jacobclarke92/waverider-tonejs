import React, { Component } from 'react'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import classnames from 'classnames'

const boxTarget = {
	drop(props, monitor) {
		if(props.onDrop) props.onDrop(props, monitor)
	}
}

class Dropzone extends Component {

	static defaultProps = {
		onDrop: item => console.log('Item dropped', item),
	}

	render() {
		const { children, canDrop, isOver, connectDropTarget } = this.props
		const isActive = isOver && canDrop
		return connectDropTarget(
			<div 
				className={classnames('dropzone', {'is-over': isOver, 'can-drop': canDrop, active: isActive})} 
				data-drop-message={isActive ? 'Release to drop' : 'Drag here'}>
				{children}
			</div>
		)
	}
}

export default DropTarget(props => props.accepts || NativeTypes.FILE, boxTarget, (connect, monitor) => ({
	connectDropTarget: connect.dropTarget(),
	isOver: monitor.isOver(),
	canDrop: monitor.canDrop(),
}))(Dropzone)