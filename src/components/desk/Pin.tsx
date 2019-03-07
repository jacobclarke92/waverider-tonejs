import React, { Component } from 'react'
import cn from 'classnames'
import { WireType, IOType } from '../../types'

export interface PinParams {
	wireType: WireType
	ioType: IOType
	label?: string
	param?: string
}

export type PinMouseEventType = React.MouseEvent<HTMLDivElement, MouseEvent>
export type PinMouseEventFunc = (e: PinMouseEventType, params: PinParams) => void

export interface PinMouseEventProps {
	onPinPointerDown: PinMouseEventFunc
	onPinPointerUp: PinMouseEventFunc
	onPinOver: PinMouseEventFunc
	onPinOut: PinMouseEventFunc
}

export interface Props {
	wiring: boolean
	valid: boolean
}

export default class Pin extends Component<PinMouseEventProps & PinParams & Props> {
	render() {
		const {
			wireType,
			ioType,
			param,
			label,
			wiring,
			valid,
			onPinPointerDown,
			onPinPointerUp,
			onPinOver,
			onPinOut,
		} = this.props
		return (
			<div
				className={cn('pin', wireType, ioType, { wiring, invalid: !valid })}
				onMouseOver={e => onPinOver(e, { wireType, ioType, label, param })}
				onMouseOut={e => onPinOut(e, { wireType, ioType, label, param })}
				onMouseDown={e => onPinPointerDown(e, { wireType, ioType, label, param })}
				onMouseUp={e => onPinPointerUp(e, { wireType, ioType, label, param })}
			/>
		)
	}
}
