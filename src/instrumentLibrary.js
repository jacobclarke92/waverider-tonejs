import simpler from './instruments/simpler'
import sampler from './instruments/sampler'

export const instrumentSchema = '++id,type,midiChannel,midiDeviceId,instrument'

export const defaultEnvelope = {
	attack: 0.005,
	decay: 0.1,
	sustain: 0.9,
	release: 1,
}

export const allInstrumentDefaults = {
	midiDeviceId: null,
	midiChannel: null,
}

export default {
	simpler,
	sampler,
}