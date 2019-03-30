import React, { Component, CSSProperties } from 'react'
import { connect } from 'react-redux'
import cn from 'classname'
import _find from 'lodash/find'
import Point, { PointObj } from '../../utils/Point'
import { Wire, ReduxStoreType, ThunkDispatchProp, WireType } from '../../types'
import { State as DeskStore } from '../../reducers/desk'

interface Props {
	active?: boolean
	valid?: boolean
	selected?: boolean
	onSelect?: () => void
	type?: WireType
	wireFrom: Wire
	wireTo: Wire
	stagePointer: Point
}

interface StateProps {
	desk: DeskStore
}

class WireComponent extends Component<ThunkDispatchProp & StateProps & Props> {
	static defaultProps = {
		active: false,
		valid: false,
		selected: false,
		onSelect: () => {},
	}

	handleClick() {
		if (!this.props.active) {
			this.props.onSelect()
		}
	}

	render() {
		const { desk, type, wireFrom, wireTo, valid, active, selected, stagePointer } = this.props

		const fromDeskItem = _find(desk, { id: wireFrom.deskItemId })
		const toDeskItem = wireTo ? _find(desk, { id: wireTo.deskItemId }) : null

		if (!wireFrom) {
			console.warn('No wireFrom set')
			return null
		}

		if (!fromDeskItem) {
			console.warn('cannot find deskItem for wireFrom', wireFrom)
			return null
		}

		if (wireTo && !toDeskItem) {
			console.warn('cannot find deskItem for wireTo', wireTo)
			return null
		}

		// Absolute positions in stage
		const fromPos = new Point(fromDeskItem.position).add(new Point(wireFrom.relativePosition))
		const toPos = wireTo ? new Point(toDeskItem.position).add(new Point(wireTo.relativePosition)) : stagePointer

		// Get SVG width and height from point position difference
		const diffX = toPos.x - fromPos.x
		const diffY = toPos.y - fromPos.y
		const width = Math.abs(diffX) || 1
		const height = Math.abs(diffY) || 1
		const vertical = width < height

		// Get curve and bend amount based on position offsets
		let curve = 2
		let bend = 0
		if (!vertical && diffX < 0) {
			curve = 1 / (Math.max(diffX, -600) / 800)
			bend = diffY < 0 ? Math.max(diffY, 300) / 500 : Math.min(diffY, 300) / 500
		}

		// Set SVG path start
		const pathStart: PointObj = {
			x: fromPos.x < toPos.x ? 0 : width,
			y: fromPos.y < toPos.y ? 0 : height,
		}

		// Set SVG path end
		const pathEnd: PointObj = {
			x: fromPos.x < toPos.x ? width : 0,
			y: fromPos.y < toPos.y ? height : 0,
		}

		// Set bezier control point 1
		const ctrlPt1: PointObj = {
			x: vertical ? pathStart.x + diffX * bend : pathStart.x + diffX / curve,
			y: vertical ? pathStart.y + diffY / curve : pathStart.y + diffY * bend,
		}

		// Set bezier control point 2
		const ctrlPt2: PointObj = {
			x: vertical ? pathEnd.x - diffX * bend : pathEnd.x - diffX / curve,
			y: vertical ? pathEnd.y - diffY / curve : pathEnd.y - diffY * bend,
		}

		const path: string = `M${pathStart.x},${pathStart.y} C${ctrlPt1.x},${ctrlPt1.y} ${ctrlPt2.x},${ctrlPt2.y} ${
			pathEnd.x
		},${pathEnd.y}`

		const styles: CSSProperties = {
			width,
			height,
			left: Math.min(toPos.x, fromPos.x),
			top: Math.min(toPos.y, fromPos.y),
		}

		return (
			<svg className={cn('wire', type, { valid, active, selected })} viewBox={`0 0 ${width} ${height}`} style={styles}>
				<path d={path} strokeWidth={3} stroke="currentColor" />
				<path d={path} strokeWidth={16} stroke="rgba(255,255,255,0)" onClick={e => this.handleClick()} />
			</svg>
		)
	}
}

export default connect(({ desk }: ReduxStoreType): StateProps => ({ desk }))(WireComponent)
