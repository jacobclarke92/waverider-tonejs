import React, { Component } from 'react'
import classname from 'classname'
import Point from '../../utils/Point'

export default class Wire extends Component {
	render() {
		const { wireFrom, wireTo, valid, stagePointer } = this.props

		// Absolute positions in stage
		const fromPos = new Point(wireFrom.deskItem.position).add(new Point(wireFrom.relativePosition))
		const toPos = wireTo ? new Point(wireTo.deskItem.position).add(new Point(wireTo.relativePosition)) : stagePointer
		
		const minX = Math.min(fromPos.x, toPos.x)
		const maxX = Math.max(fromPos.x, toPos.x)
		const minY = Math.min(fromPos.y, toPos.y)
		const maxY = Math.max(fromPos.y, toPos.y)
		const width = maxX - minX
		const height = maxY - minY

		const diffX = toPos.x - fromPos.x
		const diffY = toPos.y - fromPos.y
		const vertical = width < height
		let curve = 2
		let bend = 0
		if(!vertical && diffX < 0) {
			curve = 1/(Math.max(diffX, -600)/800);
			bend = diffY < 0 ? Math.max(diffY, 300)/500 : Math.min(diffY, 300)/500;
		}

		const ctrlPt1 = {
			x: vertical ? fromPos.x + diffX*bend : fromPos.x + diffX/curve,
			y: vertical ? fromPos.y + diffY/curve : fromPos.y + diffY*bend
		}

		const ctrlPt2 = {
			x: vertical ? toPos.x - diffX*bend : toPos.x - diffX/curve,
			y: vertical ? toPos.y - diffY/curve : toPos.y - diffY*bend,
		}

		let path = `M0,0 C${ctrlPt1.x},${ctrlPt1.y} ${ctrlPt2.x},${ctrlPt2.y} ${width},${height}`
		console.log(path)

		const styles = {
			width,
			height,
			left: minX,
			top: minY,
		}

		return (
			<svg className={classname('wire', {valid})} viewBox={`0 0 ${width} ${height}`} style={styles}>
				<path d={path} />
			</svg>
		)
	}
}