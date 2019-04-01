import { ElementType } from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { BaseEffectConstructor } from './effects/BaseEffect'
import { BaseInstrumentConstructor } from './instruments/BaseInstrument'
import { BaseSequencerConstructor } from './sequencers/BaseSequencer'
import { PointObj } from './utils/Point'
import { State as ProjectState } from './reducers/project'
import { State as DeskState } from './reducers/desk'
import { State as DevicesState } from './reducers/devices'
import { State as EffectsState } from './reducers/effects'
import { State as SequencersState } from './reducers/sequencers'
import { State as GuiState } from './reducers/gui'
import { State as InstrumentsState } from './reducers/instruments'
import { State as LastActionState } from './reducers/lastAction'
import { State as MappingsState } from './reducers/mappings'
import { State as TransportState } from './reducers/transport'

declare global {
	interface Navigator {
		webkitTemporaryStorage: any
		webkitPersistentStorage: any
	}
	interface Document {
		exitPointerLock: () => void
		mozExitPointerLock: () => void
		webkitExitPointerLock: () => void
	}
	interface HTMLElement {
		requestPointerLock: () => void
		mozRequestPointerLock: () => void
		webkitRequestPointerLock: () => void
	}
}

export type KeyedObject = { [key: string]: any }
export type NumericObject = { [key: number]: any }

export type UiView = 'STAGE' | 'DESK' | 'MATRIX'
export type Osc = 'sine' | 'triangle' | 'square' | 'sawtooth'
export type DeskItem = 'EFFECT' | 'BUS' | 'INSTRUMENT' | 'MASTER' | 'LFO' | 'SEQUENCER'
export type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
export type WireType = 'audio' | 'data' | 'midi'
export type SizeType = 'xs' | 's' | 'm' | 'l' | 'xl'
export type IOType = 'input' | 'output'
export type TimeSignature = [number, number]
export type Fraction = [number, number]
export type CheckerFunc = (a: any, b: any) => boolean
export type GenericProps = { [k: string]: any }

export interface Wire {
	param?: any // TODO
	deskItemId: number
	position: PointObj
	relativePosition: PointObj
	deskItem?: DeskItemType
}

export interface WireJoin {
	type: WireType
	id: string
	wireFrom: Wire
	wireTo: Wire
}

export type WireJoins = { [k: number]: WireJoin }

export interface DeskItemIOType {
	audioInput: boolean
	audioOutput: boolean
	dataInput: boolean
	dataOutput: boolean
	midiInput: boolean
	midiOutput: boolean
	editable: boolean
	removeable: boolean
	audioOutputs?: WireJoins
	audioInputs?: WireJoins
	dataOutputs?: WireJoins
	dataInputs?: WireJoins
	midiOutputs?: WireJoins
	midiInputs?: WireJoins
}

export interface DeskItemType extends DeskItemIOType {
	id?: number
	name: string
	ownerId: number
	ownerType: string
	type: DeskItem
	slug: string
	position: PointObj
}

export interface MappingType {
	id?: number
	type: string
	ownerId: number
	ownerType: string
	paramPath: string
	min?: number
	max?: number
	actualMin?: number
	actualMax?: number
	deviceId?: string
	channel?: number
	cc?: number
}

export interface Device extends WebMidi.MIDIPort {
	disconnected: boolean
	sequencerId?: number
}

export interface FileType {
	id: number
	filename: string
	size: number
	type: string
	date: string
	hash: string
	blob?: Blob
	data?: Blob
	note?: number
}

export interface Instrument {
	enabled: boolean
	id?: number
	type: string
	instrument: any // TODO
	midiChannel: null | number
	midiDeviceId: null | string
}

export interface Effect {
	enabled: boolean
	id?: number
	type: string // TODO
	effect: any // TODO
	midiChannel: null | number
	midiDeviceId: null | string
}

export interface Sequencer {
	enabled: boolean
	id?: number
	type: string
	sequencer: any // TODO
}

export interface EnvelopeType {
	attack: number
	decay: number
	sustain: number
	release: number
}

export interface BaseParamType {
	label: string
	path: string
	description?: string
	pathHasValue?: boolean
}

export interface NumberParamType extends BaseParamType {
	defaultValue: number
	min: number
	max: number
	step: number
}

export interface OptionsParamType extends BaseParamType {
	defaultValue: string
	options: string[]
}

export interface NoteParamType extends BaseParamType {
	type: 'note'
	defaultValue: number
	min: 0
	max: 127
	step: 1
}

export interface BooleanParamType extends BaseParamType {
	type: 'boolean'
	defaultValue: boolean
}

export type EffectDefaultValueType = {
	effect: { [k: string]: number }
}

export interface AllInstrumentDefaultValuesType {
	midiDeviceId?: string
	midiChannel?: number
}

export interface InstrumentDefaultValueType extends AllInstrumentDefaultValuesType {
	instrument: KeyedObject
}

export interface SequencerDefaultValueType {
	sequencer: KeyedObject
}

export type AnyParamType = NumberParamType | OptionsParamType | NoteParamType | BooleanParamType
export type ParamsType = AnyParamType[]

export interface EffectType {
	id?: number
	name: string
	slug: string
	Effect: BaseEffectConstructor
	Editor: ElementType
	DeskItem?: ElementType
	defaultValue: EffectDefaultValueType
	params: ParamsType
}

export interface InstrumentType {
	id?: number
	name: string
	slug: string
	Instrument: BaseInstrumentConstructor
	Editor: ElementType
	DeskItem: ElementType
	defaultValue: InstrumentDefaultValueType
	params: ParamsType
}

export interface SequencerType {
	id?: number
	name: string
	slug: string
	Sequencer: BaseSequencerConstructor
	Editor: ElementType
	DeskItem: ElementType
	defaultValue: any // TODO
	params: ParamsType
}

export interface EffectPropertiesPanelProps extends Effect {
	params: ParamsType
	defaultValue: EffectDefaultValueType
}

export interface InstrumentPropertiesPanelProps extends Instrument {
	params: ParamsType
	defaultValue: InstrumentDefaultValueType
}

export interface ReduxStoreType {
	project: ProjectState
	desk: DeskState
	devices: DevicesState
	effects: EffectsState
	sequencers: SequencersState
	gui: GuiState
	instruments: InstrumentsState
	lastAction: LastActionState
	mappings: MappingsState
	transport: TransportState
}

export type ThunkDispatchType = ThunkDispatch<ReduxStoreType, void, AnyAction>

export interface ThunkDispatchProp {
	dispatch: ThunkDispatchType
}
