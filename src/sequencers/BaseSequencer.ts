import { SequencerDefaultValueType, GenericProps, ThunkDispatchType, Sequencer } from '../types'
import { Time, Transport } from 'tone'
import { getFractionFromDecimal } from '../utils/mathUtils'

export interface BaseSequencerConstructor {
	new (value: GenericProps, dispatch: ThunkDispatchType): BaseSequencer
}

export default class BaseSequencer implements SequencerDefaultValueType {
	id?: number
	sequencer: any // TODO
	mounted: boolean
	dispatch: Function
	tickEvent: number

	triggerNoteDown(note: number, velocity: number): void {}
	triggerNoteUp(note: number): void {}
	update(oldData: Sequencer, newData: Sequencer): void {}

	// TODO this is all very bad and confusing
	getSubdivisionFromTime(time: number): number {
		const timeSignature = getFractionFromDecimal(Transport.timeSignature as number)
		const { subdivisions } = this.sequencer
		const measuresStr: string = new Time(time).toBarsBeatsSixteenths()
		const measures: number[] = measuresStr
			.split(':')
			.map(parseFloat)
			.map(Math.floor)
		const sixteenths = measures[1] * 4 + measures[2]
		return Math.round((sixteenths / 16) * subdivisions)
	}
}
