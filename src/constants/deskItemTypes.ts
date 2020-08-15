import { DeskItem, DeskItemIOType } from '../types'

export const EFFECT: DeskItem = 'EFFECT'
export const BUS: DeskItem = 'BUS'
export const INSTRUMENT: DeskItem = 'INSTRUMENT'
export const MASTER: DeskItem = 'MASTER'
export const LFO: DeskItem = 'LFO'
export const SEQUENCER: DeskItem = 'SEQUENCER'

export const deskItemTypeDefaults: { [key in DeskItem]: DeskItemIOType } = {
	[MASTER]: {
		audioInput: true,
		audioOutput: false,
		dataInput: false,
		dataOutput: false,
		midiInput: false,
		midiOutput: false,
		editable: false,
		removable: false,
	},
	[BUS]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: false,
		dataOutput: false,
		midiInput: false,
		midiOutput: false,
		editable: false,
		removable: true,
	},
	[INSTRUMENT]: {
		audioInput: false,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
		midiInput: true,
		midiOutput: false,
		editable: true,
		removable: true,
	},
	[EFFECT]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
		midiInput: false,
		midiOutput: false,
		editable: true,
		removable: true,
	},
	[LFO]: {
		audioInput: false,
		audioOutput: false,
		dataInput: false,
		dataOutput: true,
		dataOutputs: {},
		midiInput: false,
		midiOutput: false,
		editable: true,
		removable: true,
	},
	[SEQUENCER]: {
		audioInput: false,
		audioOutput: false,
		dataInput: false,
		dataOutput: false,
		midiInput: false,
		midiOutput: true,
		midiOutputs: {},
		editable: true,
		removable: true,
	},
}
