import BaseEffect from './effects/BaseEffect'

export type UiViewType = 'STAGE' | 'DESK' | 'MATRIX'
export type OscType = 'sine' | 'triangle' | 'square' | 'sawtooth'
export type DeskItem = 'EFFECT' | 'BUS' | 'INSTRUMENT' | 'MASTER' | 'LFO'
export type NoteString = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B'

export interface DeskItemType {
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

export interface EnvelopeType {
	attack: number
	decay: number
	sustain: number
	release: number
}

export interface NumberParamType {
	label: string
	path: string
	description?: string
	defaultValue: number
	min: number
	max: number
	step: number
}

export type ParamDefaultValueType = {
	effect: { [k: string]: number }
}

export interface OptionsParamType {
	label: string
	path: string
	description?: string
	defaultValue: string
	options: string[]
}

export type AnyParamType = NumberParamType | OptionsParamType
export type ParamsType = AnyParamType[]

type BaseEffectType = typeof BaseEffect
export interface EffectType {
	name: string
	slug: string
	Effect: BaseEffectType
	Editor: () => any
	defaultValue: ParamDefaultValueType
	params: ParamsType
}
