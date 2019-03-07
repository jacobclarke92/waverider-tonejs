import React, { Component, Children, cloneElement, ReactElement } from 'react'
import cn from 'classnames'
import { updateInstrument } from '../../reducers/instruments'

import Pin, { PinMouseEventProps } from './Pin'
import Icon from '../Icon'
import { GenericProps, ThunkDispatchProp } from '../../types'
import { DeskItemProps } from '../view/DeskWorkspace'

export type DeskItemMouseEventType = React.MouseEvent<HTMLDivElement, MouseEvent>

export default class DeskItemWrapper extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	deskItemElem: HTMLElement
	rect: ClientRect | DOMRect

	static defaultProps = {
		deskItem: {},
		selected: false,
		dragging: false,
		editable: true,
		removeable: true,
		owner: {},
		dispatch: () => {},
		onEdit: () => {},
		onRemove: () => {},
		onPointerDown: () => {},
		onPointerUp: () => {},
	}

	constructor(props) {
		super(props)
		this.deskItemElem = null
		this.rect = null
	}

	gotRef(elem: HTMLElement) {
		if (elem && elem != this.deskItemElem) {
			this.deskItemElem = elem
			this.rect = elem.getBoundingClientRect()
			this.forceUpdate()
		}
	}

	handleMouseDown(event: DeskItemMouseEventType, childProps: GenericProps) {
		event.preventDefault()
		this.props.onPointerDown(event, this.deskItemElem)
	}

	handleMouseUp(event: DeskItemMouseEventType, childProps: GenericProps) {
		this.props.onPointerUp(event, this.deskItemElem)
	}

	handleRemove(event: DeskItemMouseEventType) {
		if (confirm('Are you sure you want to delete this?')) {
			this.props.onRemove()
		}
	}

	toggleActiveState() {
		const { dispatch, owner } = this.props
		const enabled = !owner.enabled
		dispatch(updateInstrument(owner.id, { enabled }))
	}

	render() {
		const {
			children,
			deskItem,
			owner,
			dragging,
			selected,
			wiring,
			validWire,
			editable,
			removeable,
			onEdit,
			onPinPointerDown,
			onPinPointerUp,
			onPinOver,
			onPinOut,
		} = this.props
		const { name, position, audioInput, audioOutput } = deskItem

		const wrapperStyles = {
			transform: `translate(${position.x || 0}px, ${position.y || 0}px)`,
			width: this.rect ? this.rect.width : 70,
			height: this.rect ? this.rect.height : 70,
		}

		const child = Children.only(children) as ReactElement<any> // TODO
		const newChild = child ? cloneElement(child, { ref: (elem: HTMLElement) => this.gotRef(elem) }) : null

		const pinProps = { wiring, valid: validWire, onPinOver, onPinOut, onPinPointerDown, onPinPointerUp }

		const disabled = !owner.enabled

		return (
			<div
				className={cn('desk-item-wrapper', { dragging, selected })}
				style={wrapperStyles}
				onMouseDown={e => this.handleMouseDown(e, child ? child.props : {})}
				onMouseUp={e => this.handleMouseUp(e, child ? child.props : {})}>
				{newChild}
				{audioInput && <Pin wireType="audio" ioType="input" {...pinProps} />}
				{audioOutput && <Pin wireType="audio" ioType="output" {...pinProps} />}
				<div className="desk-item-header">
					<div
						className={cn('desk-item-icon', { disabled })}
						onClick={() => this.toggleActiveState()}
						onMouseDown={e => e.stopPropagation()}>
						<Icon name={owner && owner.enabled ? 'volume-up' : 'volume-off'} size={16} />
					</div>
					<div className="desk-item-title">{name}</div>
					{editable && (
						<div className="desk-item-icon" onClick={e => onEdit()}>
							<Icon name="edit" size={16} />
						</div>
					)}
					{removeable && (
						<div className="desk-item-icon" onClick={e => this.handleRemove(e)}>
							<Icon name="close" size={16} />
						</div>
					)}
				</div>
			</div>
		)
	}
}
