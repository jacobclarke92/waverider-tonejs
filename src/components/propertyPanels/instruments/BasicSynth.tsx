import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, InstrumentPropertiesPanelProps } from '../../../types'
import { updateInstrument } from '../../../reducers/instruments'
import { defaultValue } from '../../../instruments/basicSynth'

import MidiInput from '../../input/MidiInput'
import KnobInput from '../../input/KnobInput'
import SelectInput from '../../input/SelectInput'
import DeviceAndChannel from '../../DeviceAndChannel'

class BasicSynth extends Component<ThunkDispatchProp & InstrumentPropertiesPanelProps> {
	render() {
		const { dispatch, id, type, instrument = {}, midiDeviceId, midiChannel } = this.props
		const { voices, portamento, envelope = {}, oscillator = {} } = instrument
		const { attack, decay, sustain, release } = envelope
		const midiInputProps = { id, type: 'instrument', slug: type }
		return (
			<div className="pluck-synth">
				<div className="flex">
					<div className="flex-column">
						<DeviceAndChannel instrumentId={id} deviceId={midiDeviceId} midiChannel={midiChannel} type="input" />
						<br />
						<SelectInput
							empty={false}
							value={oscillator.type}
							defaultValue={defaultValue.instrument.oscillator.type}
							options={['square', 'triangle', 'sine', 'sawtooth'].map(value => ({ value, text: value }))}
							onChange={type =>
								dispatch(updateInstrument(id, { instrument: { ...instrument, oscillator: { ...oscillator, type } } }))
							}
						/>
						<br />
						<MidiInput {...midiInputProps} paramPath="voices">
							<KnobInput
								label="Voices"
								min={1}
								max={12}
								step={1}
								defaultValue={defaultValue.instrument.voices}
								value={voices}
								onChange={voices => dispatch(updateInstrument(id, { instrument: { ...instrument, voices } }))}
							/>
						</MidiInput>
						<MidiInput {...midiInputProps} paramPath="portamento">
							<KnobInput
								label="Portamento"
								min={0}
								max={1}
								step={0.05}
								value={portamento}
								defaultValue={defaultValue.instrument.portamento}
								onChange={portamento => dispatch(updateInstrument(id, { instrument: { ...instrument, portamento } }))}
							/>
						</MidiInput>
					</div>
					<div className="flex-column flex flex-grow justify-flex-end">
						<MidiInput {...midiInputProps} paramPath="envelope.attack">
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
						</MidiInput>
						<MidiInput {...midiInputProps} paramPath="envelope.decay">
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
						</MidiInput>
						<MidiInput {...midiInputProps} paramPath="envelope.sustain">
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
						</MidiInput>
						<MidiInput {...midiInputProps} paramPath="envelope.release">
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
						</MidiInput>
					</div>
				</div>
			</div>
		)
	}
}

export default connect()(BasicSynth)
