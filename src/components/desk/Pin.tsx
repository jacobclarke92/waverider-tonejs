import React, { Component, CSSProperties } from 'react'
import cn from 'classnames'
import { WireType, IOType, GenericProps } from '../../types'

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
	className?: string
	style?: CSSProperties
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
			className,
			style,
		} = this.props
		const props: GenericProps = label ? { 'data-tooltip': label } : {}
		return (
			<div
				{...props}
				className={cn('pin', className, wireType, ioType, { wiring, invalid: !valid })}
				style={style}
				onMouseOver={e => onPinOver(e, { wireType, ioType, label, param })}
				onMouseOut={e => onPinOut(e, { wireType, ioType, label, param })}
				onMouseDown={e => onPinPointerDown(e, { wireType, ioType, label, param })}
				onMouseUp={e => onPinPointerUp(e, { wireType, ioType, label, param })}
			/>
		)
	}
}
