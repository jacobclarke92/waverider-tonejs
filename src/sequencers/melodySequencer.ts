import { SequencerType, ParamsType, KeyedObject, Sequencer } from '../types'
import BaseSequencer from './BaseSequencer'
import MelodySequencerDeskItem from '../components/desk/MelodySequencer'
import MelodySequencerEditor from '../components/propertyPanels/sequencers/MelodySequencer'
import { Transport, Time } from 'tone'
import { checkDifferenceAny } from '../utils/lifecycleUtils'

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

	initSequencer(callback?: () => void) {
		console.log('initing sequencer to trigger every 1/' + this.sequencer.subdivisions + ' of a bar')
		this.tickEvent = Transport.scheduleRepeat(this.tick, this.sequencer.subdivisions + 'n')
		callback && callback()
	}

	tick(time: number) {
		console.log('tick', new Time(time).toBarsBeatsSixteenths())
	}

	update(oldData: Sequencer, newData: Sequencer) {
		if (checkDifferenceAny(oldData, newData, ['sequencer.subdivisions', 'sequencer.bars'])) {
			if (this.tickEvent) Transport.clear(this.tickEvent)
			this.initSequencer()
		}
	}
}

// TODO
export const defaultValue: KeyedObject = {
	sequencer: {
		bars: 4,
		subdivisions: 8,
		octaves: 2,
		octave: 4,
		data: [],
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
		label: 'Subdivisions',
		path: 'subdivisions',
		defaultValue: 8,
		min: 2,
		max: 64,
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
		label: 'Octave',
		path: 'octave',
		defaultValue: 4,
		min: 0,
		max: 8,
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
	Editor: MelodySequencerEditor,
	DeskItem: MelodySequencerDeskItem,
	defaultValue,
	params,
}

export default sequencer
