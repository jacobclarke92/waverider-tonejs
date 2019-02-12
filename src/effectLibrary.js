import autoFilter from './effects/autoFilter'
import bitCrusher from './effects/bitCrusher'
import chorus from './effects/chorus'
import distortion from './effects/distortion'
import feedbackDelay from './effects/feedbackDelay'
import feedbackEffect from './effects/feedbackEffect'

export const effectSchema = '++id,enabled,type,effect'

export default {
	feedbackEffect,
	feedbackDelay,
	distortion,
	chorus,
	bitCrusher,
	autoFilter,
}
