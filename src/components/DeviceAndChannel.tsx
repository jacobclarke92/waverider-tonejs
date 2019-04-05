import React, { FunctionComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { updateInstrument } from '../reducers/instruments'
import { ThunkDispatchProp, IOType } from '../types'

import DeviceSelect from './DeviceSelect'
import ChannelSelect from './ChannelSelect'

interface Props {
	instrumentId: number
	deviceId: string
	midiChannel: number
	type?: IOType
}

const DeviceTarget: FunctionComponent<ThunkDispatchProp & Props> = ({
	dispatch,
	instrumentId,
	deviceId,
	midiChannel,
	type,
}) => (
	<Fragment>
		<DeviceSelect
			value={deviceId}
			onChange={midiDeviceId => dispatch(updateInstrument(instrumentId, { midiDeviceId }))}
			type={type}
		/>
		<ChannelSelect
			value={midiChannel}
			onChange={midiChannel => dispatch(updateInstrument(instrumentId, { midiChannel }))}
		/>
	</Fragment>
)

export default connect()(DeviceTarget)
