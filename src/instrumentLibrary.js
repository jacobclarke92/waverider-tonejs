import simpler from './instruments/simpler'
import sampler from './instruments/sampler'
import basicSynth from './instruments/basicSynth'
import pluckSynth from './instruments/pluckSynth'

export const instrumentSchema = '++id,type,midiChannel,midiDeviceId,instrument'

export const defaultEnvelope = {
	attack: 0.01,
	decay: 0,
	sustain: 1,
	release: 0.2,
}

export const allInstrumentDefaults = {
	midiDeviceId: null,
	midiChannel: null,
}

export default {
	simpler,
	sampler,
	basicSynth,
	pluckSynth,
}