import { allInstrumentDefaults } from '../instrumentLibrary'

export default {
	name: 'Sampler',
	slug: 'sampler',
	Editor: null,
	defaultValue: {
		...allInstrumentDefaults,
		instrument: {},
	},
}