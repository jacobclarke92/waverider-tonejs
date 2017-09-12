import simpler from './instruments/simpler'
import sampler from './instruments/sampler'
import basicSynth from './instruments/basicSynth'
import pluckSynth from './instruments/pluckSynth'
import membraneSynth from './instruments/membraneSynth'

export const instrumentSchema = '++id,type,midiChannel,midiDeviceId,instrument'

export default {
	simpler,
	sampler,
	basicSynth,
	pluckSynth,
	membraneSynth,
}