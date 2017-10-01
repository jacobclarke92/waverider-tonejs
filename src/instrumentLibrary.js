import master from './instruments/master'
import simpler from './instruments/simpler'
import sampler from './instruments/sampler'
import basicSynth from './instruments/basicSynth'
import pluckSynth from './instruments/pluckSynth'
import membraneSynth from './instruments/membraneSynth'

export const instrumentSchema = '++id,enabled,type,midiChannel,midiDeviceId,instrument'

export default {
	master,
	simpler,
	sampler,
	basicSynth,
	pluckSynth,
	membraneSynth,
}