import { ParamsType } from '../types'
import { Master, Gain, Meter, now } from 'tone'
import BaseInstrument from './BaseInstrument'
import MasterDeskItem from '../components/desk/Master'

export class MasterInstrument extends BaseInstrument {
	submaster: Gain

	constructor(value = {}, dispatch) {
		super()
		console.log('Mounting master...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.meter = new Meter(0.5)
		this.initSynth(() => {
			this.mounted = true
			console.log('Master mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
	}

	initSynth(callback = () => {}) {
		// @ts-ignore
		if (this.submaster) this.submaster.dispose()
		this.submaster = new Gain(1)
		// @ts-ignore
		this.submaster.connect(this.meter)
		// @ts-ignore
		this.submaster.connect(Master)
		callback()
	}

	noteUp() {}
	noteDown() {}

	getToneSource() {
		return this.mounted && this.submaster ? this.submaster : false
	}
}

export const defaultValue = {
	instrument: {
		gain: 0.5,
	},
}

export const params: ParamsType = [
	{
		label: 'Gain',
		path: 'gain',
		defaultValue: 0.5,
		min: 0,
		max: 1,
		step: 0.01,
	},
]

export default {
	name: 'Master',
	slug: 'master',
	Editor: () => null,
	Instrument: MasterInstrument,
	DeskItem: MasterDeskItem,
	defaultValue,
	params,
}
