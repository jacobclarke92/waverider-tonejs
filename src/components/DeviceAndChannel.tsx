import React, { FunctionComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { updateInstrument } from '../reducers/instruments'
import { ThunkDispatchProp } from '../types'

import DeviceSelect from './DeviceSelect'
import ChannelSelect from './ChannelSelect'

interface Props {
	instrumentId: number
	deviceId: string
	midiChannel: number
}

const DeviceTarget: FunctionComponent<ThunkDispatchProp & Props> = ({
	dispatch,
	instrumentId,
	deviceId,
	midiChannel,
}) => (
	<Fragment>
		<DeviceSelect
			value={deviceId}
			onChange={midiDeviceId => dispatch(updateInstrument(instrumentId, { midiDeviceId }))}
		/>
		<ChannelSelect
			value={midiChannel}
			onChange={midiChannel => dispatch(updateInstrument(instrumentId, { midiChannel }))}
		/>
	</Fragment>
)

export default connect()(DeviceTarget)
