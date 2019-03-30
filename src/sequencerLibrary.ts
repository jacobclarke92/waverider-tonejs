import { SequencerType } from './types'
import melodySequencer from './sequencers/melodySequencer'

export const sequencerSchema = '++id,enabled,type,sequencer'

const sequencers: { [k: string]: SequencerType } = {
	melodySequencer,
}

export default sequencers
