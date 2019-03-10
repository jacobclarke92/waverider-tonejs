import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, Instrument } from '../../types'
import { updateInstrument } from '../../reducers/instruments'
import { defaultValue } from '../../instruments/pluckSynth'

import KnobInput from '../input/KnobInput'
import DeviceAndChannel from '../DeviceAndChannel'

class PluckSynth extends Component<ThunkDispatchProp & Instrument> {
	render() {
		const { dispatch, id, instrument, midiDeviceId, midiChannel } = this.props
		const { voices, attackNoise, dampening, resonance } = instrument
		return (
			<div className="pluck-synth">
				<DeviceAndChannel instrumentId={id} deviceId={midiDeviceId} midiChannel={midiChannel} />
				{/* <KnobInput
					label="Voices"
					min={1}
					max={12}
					step={1}
					value={voices}
					defaultValue={defaultValue.instrument.voices}
					onChange={voices => dispatch(updateInstrument(id, { instrument: { ...instrument, voices } }))}
				/> */}
				<KnobInput
					label="Attack Noise"
					min={0.1}
					max={20}
					step={0.1}
					value={attackNoise}
					defaultValue={defaultValue.instrument.attackNoise}
					onChange={attackNoise => dispatch(updateInstrument(id, { instrument: { ...instrument, attackNoise } }))}
				/>
				<KnobInput
					label="Resonance"
					min={0.1}
					max={20}
					step={0.1}
					value={resonance}
					defaultValue={defaultValue.instrument.resonance}
					onChange={resonance => dispatch(updateInstrument(id, { instrument: { ...instrument, resonance } }))}
				/>
				<KnobInput
					label="Dampening"
					min={100}
					max={8000}
					step={10}
					value={dampening}
					defaultValue={defaultValue.instrument.dampening}
					onChange={dampening => dispatch(updateInstrument(id, { instrument: { ...instrument, dampening } }))}
				/>
			</div>
		)
	}
}

export default connect()(PluckSynth)
