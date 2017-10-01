import autoFilter from './effects/autoFilter'
import bitCrusher from './effects/bitCrusher'
import chorus from './effects/chorus'

export const effectSchema = '++id,enabled,type,effect'

export default {
	chorus,
	bitCrusher,
	autoFilter,
}