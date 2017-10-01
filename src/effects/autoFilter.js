import { AutoFilter, Meter } from 'tone'
import _debounce from 'lodash/throttle'
import { paramUpdateDebounce, voicesUpdateDebounce } from '../constants/timings'
import { checkDifferenceAny, checkDifferenceAll } from '../utils/lifecycleUtils'
import { noteNumberToName } from '../utils/noteUtils'

export class AutoFilterEffect {

	constructor(value = {}, dispatch) {
		console.log('Mounting autoFilter...')
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => this[key] = value[key])
		this.meter = new Meter()
		this.initEffect(() => {
			this.mounted = true
			console.log('autoFilter mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => this[key] = value[key])
		// if(checkDifferenceAny(value.instrument, oldValue.instrument, ['portamento', 'oscillator.type', 'envelope.attack', 'envelope.decay', 'envelope.sustain', 'envelope.release'])) {
		// 	this.triggerUpdateVoiceParams()
		// }
	}

	initEffect(callback = () => {}) {
		if(this.instance) {
			console.log(this.instance)
			this.instance.dispose()
		}
		this.instance = new AutoFilter()
		this.instance.connect(this.meter)
		callback()
	}

	getToneSource() {
		return (this.mounted && this.instance) ? this.instance : false
	}
}

export const params = [
	{
		label: 'Frequency',
		path: 'frequency',
		description: 'The rate of the LFO',
		defaultValue: 1,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		label: 'Base Frequency',
		path: 'baseFrequency',
		description: 'The lower value of the LFOs oscillation',
		defaultValue: 200,
		min: 1,
		max: 10000,
		step: 1,
	},
	{
		label: 'Octaves',
		path: 'octaves',
		description: 'The number of octaves above the baseFrequency',
		defaultValue: 2.6,
		min: 0,
		max: 10,
		step: 0.2,
	}
]

export const defaultValue = {
	effect: params.reduce((obj, {path, defaultValue}) => ({...obj, [path]: defaultValue}), {}),
}

export default {
	name: 'Auto Filter',
	slug: 'autoFilter',
	Effect: AutoFilterEffect,
	Editor: () => null,
	// DeskItem: AutoFilterDeskItem,
	defaultValue,
	params,
}