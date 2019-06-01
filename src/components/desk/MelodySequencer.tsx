import React, { Component, CSSProperties, memo } from 'react'
import throttle from 'lodash/throttle'
import DeskItemWrapper, { DeskItemPointerEventType } from './DeskItemWrapper'
import Canvas from '../Canvas'
import { Transport } from 'tone'
import { ThunkDispatchProp, Sequencer } from '../../types'
import { PinMouseEventProps } from './Pin'
import { DeskItemProps } from '../view/DeskWorkspace'
import { getRelativeMousePositionNative } from '../../utils/screenUtils'
import { checkDifferenceAny } from '../../utils/lifecycleUtils'
import { updateSequencer } from '../../reducers/sequencers'
import { getCurrentSubdivisionIndex } from '../../utils/timeUtils'

export default class MelodySequencerDeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		if (!this.props.owner) return null
		const owner: Sequencer = this.props.owner as Sequencer
		const sequencer: SequencerDataProps = owner.sequencer
		return (
			<DeskItemWrapper {...this.props}>
				<div className="desk-item melody-sequencer">
					<MelodySequencer
						{...sequencer}
						updateData={data => this.props.dispatch(updateSequencer(owner.id, { sequencer: { ...sequencer, data } }))}
					/>
				</div>
			</DeskItemWrapper>
		)
	}
}

type Coord = [number, number]

interface SequencerDataProps {
	id: number
	bars: number
	subdivisions: number
	octaves: number
	scale: string
	data: string[]
}

interface Props extends SequencerDataProps {
	cellSize?: number
	cellGap?: number
	updateData: (data: string[]) => void
}

interface State {
	cols: number
	rows: number
	notesInScale: number
	canvasWidth: number
	canvasHeight: number
	over: boolean
	hoverCell: Coord
	subdivisonIndex: number
}

const coordToStr = (coord: Coord): string => coord.join('.')
const strToCoord = (str: string): Coord => {
	const parts = str.split('.')
	return parts.length === 2 ? [parseInt(parts[0]), parseInt(parts[1])] : [-1, -1]
}

class MelodySequencer extends Component<Props, State> {
	ctx: CanvasRenderingContext2D
	canvas: HTMLCanvasElement
	tickEvent: number

	static defaultProps = {
		bars: 4,
		subdivisions: 8,
		octaves: 2,
		scale: 'major', // TODO
		data: [],
		cellSize: 16,
		cellGap: 4,
	}

	constructor(props: Props) {
		super(props)
		this.state = {
			...this.getNewStateFromProps(props),
			over: false,
			hoverCell: [-1, -1],
			subdivisonIndex: 0,
		}
		this.handleMouseMove = throttle(this.handleMouseMove.bind(this), 1000 / 60)
	}

	componentDidMount() {
		document.addEventListener('mousemove', this.handleMouseMove)
		document.addEventListener('touchmove', this.handleMouseMove)
		this.tickEvent = Transport.scheduleRepeat(this.tick, this.props.subdivisions + 'n')
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.handleMouseMove)
		document.removeEventListener('touchmove', this.handleMouseMove)
		if (this.tickEvent) Transport.cancel(this.tickEvent)
	}

	componentWillReceiveProps(nextProps: Props) {
		if (checkDifferenceAny(this.props, nextProps, ['bars', 'subdivisions', 'scale', 'cellSize', 'cellGap'])) {
			this.setState(this.getNewStateFromProps(nextProps))
		}
	}

	getNewStateFromProps(props: Props = this.props) {
		const cols = props.subdivisions * props.bars
		const notesInScale = 7 // TODO getNotesInScale(props.scale).length
		const rows = notesInScale * props.octaves
		return {
			cols,
			rows,
			notesInScale,
			canvasWidth: cols * props.cellSize + (cols - 1) * props.cellGap,
			canvasHeight: rows * props.cellSize + (rows - 1) * props.cellGap,
		}
	}

	tick = (time: number) => {
		const { subdivisions, bars } = this.props
		const { subdivisonIndex } = getCurrentSubdivisionIndex(subdivisions, bars)
		this.setState({ subdivisonIndex })
	}

	handleCellToggle(coord: Coord = this.state.hoverCell) {
		const { data, updateData } = this.props
		const coordStr = coordToStr(coord)
		if (data.indexOf(coordStr) >= 0) {
			updateData(data.filter(str => str != coordStr))
		} else {
			updateData([...data, coordStr])
		}
	}

	handlePointerDown(event: DeskItemPointerEventType) {
		event.stopPropagation()
	}

	handlePointerUp(event: DeskItemPointerEventType) {
		const { over, hoverCell } = this.state
		if (over && hoverCell && hoverCell[0] >= 0 && hoverCell[1] >= 0) {
			this.handleCellToggle(hoverCell)
		}
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
		const { cellSize, cellGap, bars, subdivisions, octaves, data } = this.props
		const { cols, rows, notesInScale, canvasWidth, canvasHeight, hoverCell, subdivisonIndex } = this.state
		const totalCellSize = cellSize + cellGap

		// Clear canvas
		this.ctx.fillStyle = '#000000'
		this.ctx.fillRect(0, 0, canvasWidth, canvasHeight)

		// Draw playhead
		this.ctx.fillStyle = '#4a8fe9'
		this.ctx.fillRect(subdivisonIndex * totalCellSize, 0, cellSize, canvasHeight)

		// Draw cells
		for (let x = 0; x < cols; x++) {
			for (let y = 0; y < rows; y++) {
				const coordStr = coordToStr([x, y])
				const isHover = hoverCell && hoverCell[0] === x && hoverCell[1] === y
				const isActive = data.indexOf(coordStr) >= 0
				if (isHover && isActive) {
					this.ctx.fillStyle = '#CCCCCC'
					this.ctx.fillRect(x * totalCellSize, y * totalCellSize, cellSize, cellSize)
				} else if (isHover) {
					this.ctx.fillStyle = '#777777'
					this.ctx.fillRect(x * totalCellSize, y * totalCellSize, cellSize, cellSize)
				} else if (isActive) {
					this.ctx.fillStyle = '#FFFFFF'
					this.ctx.fillRect(x * totalCellSize, y * totalCellSize, cellSize, cellSize)
				} else {
					this.ctx.strokeStyle = '#FFFFFF'
					this.ctx.strokeRect(x * totalCellSize, y * totalCellSize, cellSize, cellSize)
				}
			}
		}

		// Draw bar & octave divider lines
		this.ctx.fillStyle = '#aaaaaa'
		for (let b = 1; b < bars; b++) {
			this.ctx.fillRect(b * subdivisions * totalCellSize - cellGap, 0, cellGap, canvasHeight)
		}
		for (let o = 1; o < octaves; o++) {
			this.ctx.fillRect(0, o * notesInScale * totalCellSize - cellGap, canvasWidth, cellGap)
		}
	}

	componentWillUpdate() {
		// TODO: only redraw if relevant state/props have changed
		this.drawCanvas()
	}

	render() {
		const { canvasWidth, canvasHeight } = this.state

		return (
			<div
				className="melody-sequencer-main"
				onMouseOver={this.handleMouseOver}
				onMouseOut={this.handleMouseOut}
				onMouseDown={e => this.handlePointerDown(e)}
				onTouchStart={e => this.handlePointerDown(e)}
				onMouseUp={e => this.handlePointerUp(e)}
				onTouchEnd={e => this.handlePointerUp(e)}>
				<Canvas width={canvasWidth} height={canvasHeight} onReady={this.handleCanvasReady} />
			</div>
		)
	}
}
