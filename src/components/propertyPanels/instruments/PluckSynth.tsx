import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, InstrumentPropertiesPanelProps } from '../../../types'
import { updateInstrument } from '../../../reducers/instruments'
import { defaultValue } from '../../../instruments/pluckSynth'

import MidiInput from '../../input/MidiInput'
import KnobInput from '../../input/KnobInput'
import DeviceAndChannel from '../../DeviceAndChannel'

class PluckSynth extends Component<ThunkDispatchProp & InstrumentPropertiesPanelProps> {
	render() {
		const { dispatch, id, type, instrument, midiDeviceId, midiChannel } = this.props
		const { voices, attackNoise, dampening, resonance } = instrument
		const midiInputProps = { id, type: 'instrument', slug: type }
		return (
			<div className="pluck-synth">
				<DeviceAndChannel instrumentId={id} deviceId={midiDeviceId} midiChannel={midiChannel} type="input" />
				{/* <KnobInput
					label="Voices"
					min={1}
					max={12}
					step={1}
					value={voices}
					defaultValue={defaultValue.instrument.voices}
					onChange={voices => dispatch(updateInstrument(id, { instrument: { ...instrument, voices } }))}
				/> */}
				<MidiInput {...midiInputProps} paramPath="attackNoise">
					<KnobInput
						label="Attack Noise"
						min={0.1}
						max={20}
						step={0.1}
						value={attackNoise}
						defaultValue={defaultValue.instrument.attackNoise}
						onChange={attackNoise => dispatch(updateInstrument(id, { instrument: { ...instrument, attackNoise } }))}
					/>
				</MidiInput>
				<MidiInput {...midiInputProps} paramPath="resonance">
					<KnobInput
						label="Resonance"
						min={0.1}
						max={20}
						step={0.1}
						value={resonance}
						defaultValue={defaultValue.instrument.resonance}
						onChange={resonance => dispatch(updateInstrument(id, { instrument: { ...instrument, resonance } }))}
					/>
				</MidiInput>
				<MidiInput {...midiInputProps} paramPath="dampening">
					<KnobInput
						label="Dampening"
						min={100}
						max={8000}
						step={10}
						value={dampening}
						defaultValue={defaultValue.instrument.dampening}
						onChange={dampening => dispatch(updateInstrument(id, { instrument: { ...instrument, dampening } }))}
					/>
				</MidiInput>
			</div>
		)
	}
}

export default connect()(PluckSynth)
