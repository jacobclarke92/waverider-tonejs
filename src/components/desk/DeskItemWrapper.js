import React, { Component, Children, cloneElement } from 'react'
import classnames from 'classnames'
import Pin from './Pin'
import Icon from '../Icon'

export default class DeskItemWrapper extends Component {

	static defaultProps = {
		deskItem: {},
		selected: false,
		dragging: false,
		editable: true,
		removeable: true,
		onEdit: () => {},
		onRemove: () => {},
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
		event.preventDefault()
		this.props.onPointerDown(event, this.deskItemElem)
	}

	handleMouseUp(event, childProps) {
		this.props.onPointerUp(event, this.deskItemElem)
	}

	handleRemove(event) {
		if(confirm('Are you sure you want to delete this?')) {
			this.props.onRemove()
		}
	}

	render() {
		const { children, deskItem, dragging, selected, wiring, validWire, editable, removeable, onEdit, onPinPointerDown, onPinPointerUp, onPinOver, onPinOut } = this.props
		const { name, position, audioInput, audioOutput } = deskItem

		const wrapperStyles = {
			transform: `translate(${position.x || 0}px, ${position.y || 0}px)`,
			width: this.rect ? this.rect.width : 70,
			height: this.rect ? this.rect.height : 70,
		}

		const child = Children.only(children)
		const { className, styles = {} } = child.props

		const newChild = cloneElement(child, { ref: elem => this.gotRef(elem) })

		const pinProps = { wiring, valid: validWire, onPinOver, onPinOut, onPinPointerDown, onPinPointerUp }

		return (
			<div 
				className={classnames('desk-item-wrapper', {dragging, selected})}
				style={wrapperStyles}
				onMouseDown={e => this.handleMouseDown(e, child.props)}
				onMouseUp={e => this.handleMouseUp(e, child.props)}>

				{newChild}
				{audioInput && <Pin wireType="audio" ioType="input" {...pinProps} />}
				{audioOutput && <Pin wireType="audio" ioType="output" {...pinProps} />}
				<div className="desk-item-header">
					<div className="desk-item-icon"><Icon name="volume-up" size={16} /></div>
					<div className="desk-item-title">{name}</div>
					{editable && <div className="desk-item-icon" onClick={e => onEdit()}><Icon name="edit" size={16} /></div>}
					{removeable && <div className="desk-item-icon" onClick={e => this.handleRemove(e)}><Icon name="close" size={16} /></div>}
				</div>

			</div>
		)
	}
}