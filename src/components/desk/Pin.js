import React, { Component } from 'react'
import classnames from 'classnames'

export default class Pin extends Component {
	render() {
		const { wireType, ioType, wiring, valid, onPinPointerDown, onPinPointerUp, onPinOver, onPinOut } = this.props
		return (
			<div
				className={classnames('pin', wireType, ioType, { wiring, invalid: !valid })}
				onMouseOver={e => onPinOver(e, { wireType, ioType })}
				onMouseOut={e => onPinOut(e, { wireType, ioType })}
				onMouseDown={e => onPinPointerDown(e, { wireType, ioType })}
				onMouseUp={e => onPinPointerUp(e, { wireType, ioType })}
			/>
		)
	}
}
