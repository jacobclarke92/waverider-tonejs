import { InstrumentDefaultValueType, GenericProps, ThunkDispatchType, Instrument } from '../types'
import { Meter, Source, AudioNode } from 'tone'

export interface BaseInstrumentConstructor {
	new (value: GenericProps, dispatch: ThunkDispatchType): BaseInstrument
}

export default class BaseInstrument implements InstrumentDefaultValueType {
	id?: number
	midiDeviceId: null
	midiChannel: null
	instrument: any
	mounted: boolean
	dispatch: Function
	meter: Meter
	reinitSynth(): void {}
	triggerUpdateVoiceParams(): void {}
	noteDown(note: number, velocity: number): void {}
	noteUp(note: number): void {}
	getToneSource(): any {}
	update(oldData: Instrument, newData: Instrument): void {}
}
