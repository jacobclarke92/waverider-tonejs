import { allInstrumentDefaults } from '../constants/params'

export const defaultValue = {
	...allInstrumentDefaults,
	instrument: {},
}

export const params = [

]

export default {
	name: 'Sampler',
	slug: 'sampler',
	Editor: null,
	defaultValue,
	params,
}