import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateInstrument } from '../../reducers/instruments'
import { defaultValue } from '../../instruments/basicSynth'

import KnobInput from '../input/KnobInput'
import SelectInput from '../input/SelectInput'
import DeviceSelect from '../DeviceSelect'
import ChannelSelect from '../ChannelSelect'

class BasicSynth extends Component {
	render() {
		const { dispatch, id, instrument = {}, midiDeviceId, midiChannel } = this.props
		const { voices, portamento, envelope = {}, oscillator = {} } = instrument
		const { attack, decay, sustain, release } = envelope
		return (
			<div className="pluck-synth">
				<DeviceSelect value={midiDeviceId} onChange={midiDeviceId => dispatch(updateInstrument(id, {midiDeviceId}))} />
				<ChannelSelect value={midiChannel} onChange={midiChannel => dispatch(updateInstrument(id, {midiChannel}))} />
				<KnobInput 
					label="Voices" 
					min={1} 
					max={12} 
					step={1} 
					value={voices} 
					defaultValue={defaultValue.instrument.voices}
					onChange={voices => dispatch(updateInstrument(id, {instrument: {...instrument, voices}}))} />
				<KnobInput 
					label="Portamento" 
					min={0} 
					max={1} 
					step={0.05} 
					value={portamento} 
					defaultValue={defaultValue.instrument.portamento}
					onChange={portamento => dispatch(updateInstrument(id, {instrument: {...instrument, portamento}}))} />

				<SelectInput
					empty={false}
					value={oscillator.type}
					defaultValue={defaultValue.instrument.oscillator.type}
					options={['square', 'triangle', 'sine', 'sawtooth'].map(value => ({value, text: value}))}
					onChange={type => dispatch(updateInstrument(id, {instrument: {...instrument, oscillator: {...oscillator, type}}}))} />
				
				<KnobInput
					label="Attack"
					value={attack}
					min={0}
					max={5}
					step={0.01}
					valueDisplay={value => value+'s'}
					defaultValue={defaultValue.instrument.envelope.attack}
					onChange={attack => dispatch(updateInstrument(id, {instrument: {...instrument, envelope: {...envelope, attack}}}))} />
				<KnobInput
					label="Decay"
					value={decay}
					min={0}
					max={5}
					step={0.01}
					valueDisplay={value => value+'s'}
					defaultValue={defaultValue.instrument.envelope.decay}
					onChange={decay => dispatch(updateInstrument(id, {instrument: {...instrument, envelope: {...envelope, decay}}}))} />
				<KnobInput
					label="Sustain"
					value={sustain}
					min={0}
					max={1}
					step={0.01}
					valueDisplay={value => Math.round(value*100)+'%'}
					defaultValue={defaultValue.instrument.envelope.sustain}
					onChange={sustain => dispatch(updateInstrument(id, {instrument: {...instrument, envelope: {...envelope, sustain}}}))} />
				<KnobInput
					label="Release"
					value={release}
					min={0}
					max={10}
					step={0.01}
					valueDisplay={value => value+'s'}
					defaultValue={defaultValue.instrument.envelope.release}
					onChange={release => dispatch(updateInstrument(id, {instrument: {...instrument, envelope: {...envelope, release}}}))} />
			</div>
		)
	}
}

export default connect()(BasicSynth)