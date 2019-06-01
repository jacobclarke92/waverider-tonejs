import _uniq from 'lodash/uniq'
import { SequencerType, ParamsType, KeyedObject, Sequencer } from '../types'
import BaseSequencer from './BaseSequencer'
import MelodySequencerDeskItem from '../components/desk/MelodySequencer'
import MelodySequencerEditor from '../components/propertyPanels/sequencers/MelodySequencer'
import { Transport } from 'tone'
import { checkDifferenceAny } from '../utils/lifecycleUtils'
import { getCurrentSubdivisionIndex } from '../utils/timeUtils'
import { NOTE_ON, MidiMessageAction, NOTE_OFF } from '../api/midi'

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
		if (this.tickEvent) Transport.clear(this.tickEvent)
		this.tickEvent = Transport.scheduleRepeat(this.tick, this.sequencer.subdivisions + 'n')
		callback && callback()
	}

	tick = (time: number) => {
		const { octave, subdivisions, bars, data = [] } = this.sequencer
		const { subdivisonIndex } = getCurrentSubdivisionIndex(subdivisions, bars)
		const noteIndexesToTrigger = _uniq<number>(
			data.filter(str => str.indexOf(subdivisonIndex + '.') === 0).map(str => parseInt(str.split('.')[1]))
		)

		// Here down is temporary and disgusting -- notes should be scheduled via Tone not trigger in runtime
		if (noteIndexesToTrigger.length > 0)
			noteIndexesToTrigger.forEach(noteIndex => {
				const scale = [0, 1, 3, 5, 7, 8, 10] // phrygian
				const note = octave * 12 + scale[noteIndex % 7]
				const actionParams = {
					deviceId: `melodySequencer${this.id}`,
					channel: 1,
					note,
				}
				this.dispatch({ type: NOTE_ON, ...actionParams, velocity: 96 } as MidiMessageAction)
				setTimeout(() => {
					this.dispatch({ type: NOTE_OFF, ...actionParams, velocity: 0 } as MidiMessageAction), 10
				})
			})
	}

	update(oldData: Sequencer, newData: Sequencer) {
		if (checkDifferenceAny(oldData, newData, ['sequencer.subdivisions', 'sequencer.bars'])) {
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
