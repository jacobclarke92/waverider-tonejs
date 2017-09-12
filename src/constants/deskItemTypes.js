export const FX = 'FX'
export const BUS = 'BUS'
export const INSTRUMENT = 'INSTRUMENT'
export const MASTER = 'MASTER'
export const LFO = 'LFO'

export const deskItemTypeDefaults = {
	[MASTER]: {
		audioInput: true,
		audioOutput: false,
		dataInput: false,
		dataOutput: false,
	},
	[BUS]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: false,
		dataOutput: false,
	},
	[INSTRUMENT]: {
		audioInput: false,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
	},
	[FX]: {
		audioInput: true,
		audioOutput: true,
		audioOutputs: {},
		dataInput: true,
		dataOutput: false,
	},
	[LFO]: {
		audioInput: false,
		audioOutput: false,
		dataInput: false,
		dataOutput: true,
		dataOutputs: {},
	},
}