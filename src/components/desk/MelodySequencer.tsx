import React, { Component, CSSProperties, memo } from 'react'
import DeskItemWrapper from './DeskItemWrapper'
import { ThunkDispatchProp, Sequencer } from '../../types'
import { PinMouseEventProps } from './Pin'
import { DeskItemProps } from '../view/DeskWorkspace'

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
}

class MelodySequencer extends Component<Props> {
	static defaultProps = {
		bars: 4,
		beats: 4,
		octaves: 1,
		scale: 'chromatic',
		cellSize: 16,
	}
	render() {
		const { bars, beats, octaves, scale, cellSize } = this.props
		const notesInScale = 12 // TODO getNotesInScale(scale).length

		const totalColumns = bars * beats
		const totalRows = notesInScale * octaves
		const gridStyle: CSSProperties = {
			gridTemplateColumns: `${cellSize}px `.repeat(totalColumns),
			gridTemplateRows: `${cellSize}px `.repeat(totalRows),
		}
		return (
			<div className="melody-sequencer-main">
				<div className="melody-sequencer-grid" style={gridStyle}>
					{new Array(totalColumns * totalRows).fill(0).map((v, i) => (
						<Cell key={i} index={i} active={false} onPointerDown={() => console.log('active')} />
					))}
				</div>
			</div>
		)
	}
}

interface CellProps {
	index: number
	span?: number
	active: boolean
	onPointerDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Cell = memo<CellProps>(({ index, span = 1, onPointerDown }) => {
	return <div className="sequencer-cell" style={{ gridArea: `span 1 / span ${span}` }} onMouseDown={onPointerDown} />
})
