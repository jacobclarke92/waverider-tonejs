import { DeskItem, DeskItemType } from '../types'

export const EFFECT = 'EFFECT'
export const BUS = 'BUS'
export const INSTRUMENT = 'INSTRUMENT'
export const MASTER = 'MASTER'
export const LFO = 'LFO'

export const deskItemTypeDefaults: { [key in DeskItem]: DeskItemType } = {
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
