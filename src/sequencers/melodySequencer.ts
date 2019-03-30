import { SequencerType, ParamsType, KeyedObject } from '../types'
import BaseSequencer from './BaseSequencer'
import MelodySequencerDeskItem from '../components/desk/MelodySequencer'

export class MelodySequencer extends BaseSequencer {
	constructor(value = {}, dispatch) {
		super()
		this.mounted = false
		this.dispatch = dispatch
		Object.keys(value).forEach(key => (this[key] = value[key]))
		this.initSequencer(() => {
			this.mounted = true
			console.log('melodySequencer mounted', this)
		})
	}

	initSequencer(callback) {
		callback()
	}
}

// TODO
export const defaultValue: KeyedObject = {
	sequencer: {
		bars: 4,
		beats: 4,
	},
}

export const params: ParamsType = [
	{
		label: 'Bars',
		path: 'bars',
		defaultValue: 4,
		min: 1,
		max: 64,
		step: 1,
	},
	{
		label: 'Beats',
		path: 'beats',
		defaultValue: 4,
		min: 2,
		max: 13,
		step: 1,
	},
	{
		label: 'Octaves',
		path: 'octaves',
		defaultValue: 2,
		min: 1,
		max: 4,
		step: 1,
	},
	{
		label: 'Mode / Scale',
		path: 'scale',
		defaultValue: 'chromatic',
		options: [
			'chromatic',
			'ionian',
			'dorian',
			'phrygian',
			'lydian',
			'mixolydian',
			'aeolian',
			'locrian',
			'pentatonic',
			'whole-tone',
			'octatonic',
		],
	},
]

const sequencer: SequencerType = {
	name: 'Melody Sequencer',
	slug: 'melodySequencer',
	Sequencer: MelodySequencer,
	Editor: null,
	DeskItem: MelodySequencerDeskItem,
	defaultValue,
	params,
}

export default sequencer
