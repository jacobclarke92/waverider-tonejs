import { SequencerDefaultValueType, GenericProps, ThunkDispatchType, Sequencer } from '../types'
import { Meter, Source, AudioNode } from 'tone'

export interface BaseSequencerConstructor {
	new (value: GenericProps, dispatch: ThunkDispatchType): BaseSequencer
}

export default class BaseSequencer implements SequencerDefaultValueType {
	id?: number
	sequencer: any // TODO
	mounted: boolean
	dispatch: Function

	triggerNoteDown(note: number, velocity: number): void {}
	triggerNoteUp(note: number): void {}
	update(oldData: Sequencer, newData: Sequencer): void {}
}
