import { ElementType } from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { BaseEffectConstructor } from './effects/BaseEffect'
import { BaseInstrumentConstructor } from './instruments/BaseInstrument'
import { PointObj } from './utils/Point'
import { State as DeskState } from './reducers/desk'
import { State as DevicesState } from './reducers/devices'
import { State as EffectsState } from './reducers/effects'
import { State as GuiState } from './reducers/gui'
import { State as InstrumentsState } from './reducers/instruments'
import { State as LastActionState } from './reducers/lastAction'

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
export type DeskItem = 'EFFECT' | 'BUS' | 'INSTRUMENT' | 'MASTER' | 'LFO'
export type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
export type WireType = 'audio' | 'data'
export type SizeType = 'xs' | 's' | 'm' | 'l' | 'xl'
export type IOType = 'input' | 'output'
export type CheckerFunc = (a: any, b: any) => boolean
export type GenericProps = { [k: string]: any }

export interface Wire {
	param?: any // TODO
	deskItem: DeskItemType
	position: PointObj
	relativePosition: PointObj
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
	editable: boolean
	removeable: boolean
	audioOutputs?: WireJoins
	audioInputs?: WireJoins
	dataOutputs?: WireJoins
	dataInputs?: WireJoins
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
export interface Device extends WebMidi.MIDIPort {
	disconnected: boolean
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
	id: number
	type: string // TODO
	instrument: any // TODO
	midiChannel: null | number
	midiDeviceId: null | string
}

export interface Effect {
	enabled: boolean
	id: number
	type: string // TODO
	midiChannel: null | number
	midiDeviceId: null | string
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
	instrument: { [k: string]: any }
}

export type AnyParamType = NumberParamType | OptionsParamType | NoteParamType | BooleanParamType
export type ParamsType = AnyParamType[]

export interface EffectType {
	id?: number
	name: string
	slug: string
	Effect: BaseEffectConstructor
	Editor: ElementType
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

export interface ReduxStoreType {
	desk: DeskState
	devices: DevicesState
	effects: EffectsState
	gui: GuiState
	instruments: InstrumentsState
	lastAction: LastActionState
}

export type ThunkDispatchType = ThunkDispatch<ReduxStoreType, void, AnyAction>

export interface ThunkDispatchProp {
	dispatch: ThunkDispatchType
}
