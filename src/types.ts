import BaseEffect from './effects/BaseEffect'
import { ReactType } from 'react'
import { string } from 'prop-types'
import { PointObj } from './utils/Point'

declare global {
	interface Navigator {
		webkitTemporaryStorage: any
		webkitPersistentStorage: any
	}
	interface Document {
		exitPointerLock: () => void
	}
	interface HTMLElement {
		requestPointerLock: () => void
	}
}

export type KeyedObject = { [key: string]: any }
export type NumericObject = { [key: number]: any }

export type UiViewType = 'STAGE' | 'DESK' | 'MATRIX'
export type OscType = 'sine' | 'triangle' | 'square' | 'sawtooth'
export type DeskItem = 'EFFECT' | 'BUS' | 'INSTRUMENT' | 'MASTER' | 'LFO'
export type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'
export type WireType = 'audio' | 'data'
export type CheckerFunc = (a: any, b: any) => boolean
export type GenericProps = { [k: string]: any }

export interface DeskItemType extends DeskItemIOType {
	id?: number
	name: string
	ownerId: number
	ownerType: string
	type: DeskItem
	slug: string
	position: PointObj
}

export interface DeskItemIOType {
	audioInput: boolean
	audioOutput: boolean
	dataInput: boolean
	dataOutput: boolean
	editable: boolean
	removeable: boolean
	audioOutputs?: {}
	audioInputs?: {}
	dataOutputs?: {}
	dataInputs?: {}
}

export interface Wire {
	deskItem: DeskItemType
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
}

export interface Instrument {
	enabled: boolean
	id: number
	type: string // TODO
	instrument: any // TODO
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
	midiDeviceId: null | string
	midiChannel: null | number
}

export interface InstrumentDefaultValueType extends AllInstrumentDefaultValuesType {
	instrument: { [k: string]: any }
}

export type AnyParamType = NumberParamType | OptionsParamType | NoteParamType | BooleanParamType
export type ParamsType = AnyParamType[]

export type BaseEffectType = typeof BaseEffect
export interface EffectType {
	id: number
	name: string
	slug: string
	Effect: BaseEffectType
	Editor: () => any
	defaultValue: EffectDefaultValueType
	params: ParamsType
}

export interface InstrumentType {
	name: string
	slug: string
	Instrument: any
	Editor: ReactType
	DeskItem: ReactType
	defaultValue: InstrumentDefaultValueType
	params: ParamsType
}
