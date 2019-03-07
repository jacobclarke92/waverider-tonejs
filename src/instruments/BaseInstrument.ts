import { InstrumentDefaultValueType, GenericProps } from '../types'
import { Meter } from 'tone'

export interface BaseInstrumentConstructor {
	new (value: GenericProps, dispatch: Function): BaseInstrument
}

export default class BaseInstrument implements InstrumentDefaultValueType {
	id?: any
	midiDeviceId: null
	midiChannel: null
	instrument: any
	mounted: boolean
	dispatch: Function
	meter: Meter
	reinitSynth: () => void
	triggerUpdateVoiceParams: () => void
}
