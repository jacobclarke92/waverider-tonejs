import React, { Component, CSSProperties, memo } from 'react'
import throttle from 'lodash/throttle'
import DeskItemWrapper from './DeskItemWrapper'
import Canvas from '../Canvas'
import { ThunkDispatchProp, Sequencer } from '../../types'
import { PinMouseEventProps } from './Pin'
import { DeskItemProps } from '../view/DeskWorkspace'
import { getRelativeMousePositionNative } from '../../utils/screenUtils'

export default class MelodySequencerDeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		if (!this.props.owner) return null
		const sequencer: Props = (this.props.owner as Sequencer).sequencer
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item melody-sequencer">
					<MelodySequencer {...sequencer} />
				</div>
			</DeskItemWrapper>
		)
	}
}

interface Props {
	bars: number
	beats: number
	octaves: number
	scale: string
	cellSize?: number
	cellGap?: number
}

interface State {
	cols: number
	rows: number
	canvasWidth: number
	canvasHeight: number
	over: boolean
	hoverCell: [number, number]
}

class MelodySequencer extends Component<Props, State> {
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement

	static defaultProps = {
		bars: 4,
		beats: 4,
		octaves: 1,
		scale: 'major', // TODO
		cellSize: 16,
		cellGap: 4,
	}

	constructor(props: Props) {
		super(props)
		const cols = props.beats * props.bars
		const notesInScale = 7 // TODO getNotesInScale(props.scale).length
		const rows = notesInScale * props.octaves
		this.state = {
			cols,
			rows,
			canvasWidth: cols * props.cellSize + (cols - 1) * props.cellGap,
			canvasHeight: rows * props.cellSize + (rows - 1) * props.cellGap,
			over: false,
			hoverCell: [-1, -1],
		}
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = throttle(this.handleMouseMove.bind(this), 1000 / 60)
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleMouseUp)
		document.addEventListener('touchend', this.handleMouseUp)
		document.addEventListener('mousemove', this.handleMouseMove)
		document.addEventListener('touchmove', this.handleMouseMove)
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleMouseUp)
		document.removeEventListener('touchend', this.handleMouseUp)
		document.removeEventListener('mousemove', this.handleMouseMove)
		document.removeEventListener('touchmove', this.handleMouseMove)
	}

	handleMouseUp(event: MouseEvent | TouchEvent) {
		// idk
	}

	handleMouseOver = () => {
		this.setState({ over: true })
	}

	handleMouseOut = () => {
		this.setState({ over: false, hoverCell: null })
	}

	handleMouseMove(event: MouseEvent | TouchEvent) {
		if (!this.state.over) return
		const { cellSize, cellGap } = this.props
		const mousePosition = getRelativeMousePositionNative(event, this.canvas)
		const realCellSize = cellSize + cellGap
		const col = Math.floor(mousePosition.x / realCellSize)
		const row = Math.floor(mousePosition.y / realCellSize)
		if (
			mousePosition.x >= col * realCellSize &&
			mousePosition.x < (col + 1) * realCellSize - cellGap &&
			mousePosition.y >= row * realCellSize &&
			mousePosition.y < (row + 1) * realCellSize - cellGap
		) {
			this.setState({ hoverCell: [col, row] })
		} else {
			this.setState({ hoverCell: null })
		}
	}

	handleCanvasReady = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
		this.ctx = ctx
		this.canvas = canvas
		this.drawCanvas()
	}

	drawCanvas() {
		const { cellSize, cellGap } = this.props
		const { cols, rows, canvasWidth, canvasHeight, hoverCell } = this.state
		this.ctx.fillStyle = '#000000'
		this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				if (hoverCell && hoverCell[0] === x && hoverCell[1] === y) {
					this.ctx.fillStyle = '#777777'
					this.ctx.fillRect(x * cellSize + x * cellGap, y * cellSize + y * cellGap, cellSize, cellSize)
				} else {
					this.ctx.strokeStyle = '#FFFFFF'
					this.ctx.strokeRect(x * cellSize + x * cellGap, y * cellSize + y * cellGap, cellSize, cellSize)
				}
			}
		}
	}

	componentWillUpdate() {
		this.drawCanvas()
	}

	render() {
		const { canvasWidth, canvasHeight } = this.state

		return (
			<div className="melody-sequencer-main" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				<Canvas width={canvasWidth} height={canvasHeight} onReady={this.handleCanvasReady} />
			</div>
		)
	}
}
