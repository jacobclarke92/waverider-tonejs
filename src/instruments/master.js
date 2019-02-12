import React from 'react'
import { Master, Gain, Meter, now } from 'tone'
import MasterDeskItem from '../components/desk/Master'
import { allInstrumentDefaults, defaultEnvelope, envelopeParams, voicesParam, oscTypeParam } from '../constants/params'

export class MasterInstrument {
	constructor(value = {}, dispatch) {
		console.log('Mounting master...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.meter = new Meter()
		this.initSynth(() => {
			this.mounted = true
			console.log('Master mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
	}

	initSynth(callback = () => {}) {
		if (this.submaster) this.submaster.dispose()
		this.submaster = new Gain({ gain: 1 })
		this.submaster.connect(this.meter)
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

export const params = [
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
	Editor: () => <div />,
	Instrument: MasterInstrument,
	DeskItem: MasterDeskItem,
	defaultValue,
	params,
}
