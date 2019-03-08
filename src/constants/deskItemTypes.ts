import { DeskItem, DeskItemIOType } from '../types'

export const EFFECT: DeskItem = 'EFFECT'
export const BUS: DeskItem = 'BUS'
export const INSTRUMENT: DeskItem = 'INSTRUMENT'
export const MASTER: DeskItem = 'MASTER'
export const LFO: DeskItem = 'LFO'

export const deskItemTypeDefaults: { [key in DeskItem]: DeskItemIOType } = {
	[MASTER]: {
		audioInput: true,
		audioOutput: false,
		dataInput: false,
		dataOutput: false,
		editable: false,
		removeable: false,
	},
	[BUS]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: false,
		dataOutput: false,
		editable: false,
		removeable: true,
	},
	[INSTRUMENT]: {
		audioInput: false,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
		editable: true,
		removeable: true,
	},
	[EFFECT]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
		editable: true,
		removeable: true,
	},
	[LFO]: {
		audioInput: false,
		audioOutput: false,
		dataInput: false,
		dataOutput: true,
		dataOutputs: {},
		editable: true,
		removeable: true,
	},
}
