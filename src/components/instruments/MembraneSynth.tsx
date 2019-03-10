import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, Instrument } from '../../types'
import { updateInstrument } from '../../reducers/instruments'
import { defaultValue } from '../../instruments/membraneSynth'

import KnobInput from '../input/KnobInput'
import SelectInput from '../input/SelectInput'
import DeviceAndChannel from '../DeviceAndChannel'

class MembraneSynth extends Component<ThunkDispatchProp & Instrument> {
	render() {
		const { dispatch, id, instrument, midiDeviceId, midiChannel } = this.props
		const { voices, pitchDecay, octaves, envelope, oscillator } = instrument
		const { attack, decay, sustain, release } = envelope
		return (
			<div className="membrane-synth">
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
					label="Pitch Decay"
					min={0}
					max={1}
					step={0.01}
					value={pitchDecay}
					defaultValue={defaultValue.instrument.pitchDecay}
					onChange={pitchDecay => dispatch(updateInstrument(id, { instrument: { ...instrument, pitchDecay } }))}
				/>
				<KnobInput
					label="Octaves"
					min={0}
					max={12}
					step={1}
					value={octaves}
					defaultValue={defaultValue.instrument.octaves}
					onChange={octaves => dispatch(updateInstrument(id, { instrument: { ...instrument, octaves } }))}
				/>

				<SelectInput
					empty={false}
					value={oscillator.type}
					defaultValue={defaultValue.instrument.oscillator.type}
					options={['square', 'triangle', 'sine', 'sawtooth'].map(value => ({ value, text: value }))}
					onChange={type =>
						dispatch(updateInstrument(id, { instrument: { ...instrument, oscillator: { ...oscillator, type } } }))
					}
				/>

				<KnobInput
					label="Attack"
					value={attack}
					min={0}
					max={5}
					step={0.01}
					valueDisplay={value => value + 's'}
					defaultValue={defaultValue.instrument.envelope.attack}
					onChange={attack =>
						dispatch(updateInstrument(id, { instrument: { ...instrument, envelope: { ...envelope, attack } } }))
					}
				/>
				<KnobInput
					label="Decay"
					value={decay}
					min={0}
					max={5}
					step={0.01}
					valueDisplay={value => value + 's'}
					defaultValue={defaultValue.instrument.envelope.decay}
					onChange={decay =>
						dispatch(updateInstrument(id, { instrument: { ...instrument, envelope: { ...envelope, decay } } }))
					}
				/>
				<KnobInput
					label="Sustain"
					value={sustain}
					min={0}
					max={1}
					step={0.01}
					valueDisplay={value => Math.round(value * 100) + '%'}
					defaultValue={defaultValue.instrument.envelope.sustain}
					onChange={sustain =>
						dispatch(updateInstrument(id, { instrument: { ...instrument, envelope: { ...envelope, sustain } } }))
					}
				/>
				<KnobInput
					label="Release"
					value={release}
					min={0}
					max={10}
					step={0.01}
					valueDisplay={value => value + 's'}
					defaultValue={defaultValue.instrument.envelope.release}
					onChange={release =>
						dispatch(updateInstrument(id, { instrument: { ...instrument, envelope: { ...envelope, release } } }))
					}
				/>
			</div>
		)
	}
}

export default connect()(MembraneSynth)
