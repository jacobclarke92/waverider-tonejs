import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, SequencerPropertiesPanelProps, NumberParamType } from '../../../types'
import { updateSequencer } from '../../../reducers/sequencers'
import { params, defaultValue } from '../../../sequencers/melodySequencer'

import MidiInput from '../../input/MidiInput'
import KnobInput from '../../input/KnobInput'

class MelodySequencer extends Component<ThunkDispatchProp & SequencerPropertiesPanelProps> {
	render() {
		const { dispatch, id, type, sequencer } = this.props
		const { bars, subdivisions, octaves, scale } = sequencer
		const midiInputProps = { id, type: 'sequencer', slug: type }
		console.log(this.props, sequencer)
		return (
			<div>
				<MidiInput {...midiInputProps} paramPath="bars">
					<KnobInput
						{...params.find(({ path }) => path == 'bars') as NumberParamType}
						value={bars || defaultValue.sequencer.bars}
						onChange={bars => dispatch(updateSequencer(id, { sequencer: { ...sequencer, bars } }))}
					/>
				</MidiInput>
				<MidiInput {...midiInputProps} paramPath="subdivisions">
					<KnobInput
						{...params.find(({ path }) => path == 'subdivisions') as NumberParamType}
						value={subdivisions || defaultValue.sequencer.subdivisions}
						onChange={subdivisions => dispatch(updateSequencer(id, { sequencer: { ...sequencer, subdivisions } }))}
					/>
				</MidiInput>
				<MidiInput {...midiInputProps} paramPath="octaves">
					<KnobInput
						{...params.find(({ path }) => path == 'octaves') as NumberParamType}
						value={octaves || defaultValue.sequencer.octaves}
						onChange={octaves => dispatch(updateSequencer(id, { sequencer: { ...sequencer, octaves } }))}
					/>
				</MidiInput>
			</div>
		)
	}
}

export default connect()(MelodySequencer)
