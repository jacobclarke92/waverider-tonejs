import React, { Children, cloneElement, ReactElement } from 'react'
import { useDrop, DropTargetMonitor } from 'react-dnd'
import { GenericProps } from '../types'
import { NativeTypes } from 'react-dnd-html5-backend'
import classnames from 'classnames'

interface Props {
	onDrop?: (props: GenericProps, monitor: DropTargetMonitor) => void
	children?: React.ReactNode
}

export default function DropzoneWrapper({ onDrop, children }: Props) {
	const [{ isOver, canDrop }, connectDropTarget] = useDrop(
		() => ({
			accept: [NativeTypes.FILE],
			drop(item, monitor) {
				if (onDrop) onDrop({} as GenericProps, monitor)
			},
			collect: (monitor: DropTargetMonitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}),
		[onDrop]
	)

	if (!children) return null
	const child = Children.only(children) as ReactElement<any>

	return (
		<div ref={connectDropTarget as any} className="dropzone-wrapper">
			{cloneElement(child, {
				className: classnames(child.props.className, 'dropzone', { 'is-over': isOver, 'can-drop': canDrop }),
				'data-drop-message': isOver ? 'Release to drop' : 'Drag here',
			})}
		</div>
	)
}
