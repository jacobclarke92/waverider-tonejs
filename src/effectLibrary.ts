import { EffectType } from './types'
import autoFilter from './effects/autoFilter'
import bitCrusher from './effects/bitCrusher'
import chorus from './effects/chorus'
import distortion from './effects/distortion'
import feedbackDelay from './effects/feedbackDelay'
import oscilloscope from './effects/oscilloscope'

export const effectSchema = '++id,enabled,type,effect'

const effects: { [k: string]: EffectType } = {
	feedbackDelay,
	distortion,
	chorus,
	bitCrusher,
	autoFilter,
	oscilloscope,
}

export default effects
