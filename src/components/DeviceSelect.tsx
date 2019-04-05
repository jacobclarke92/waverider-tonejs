import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectInput from './input/SelectInput'
import { ReduxStoreType, Device, ThunkDispatchProp, IOType } from '../types'

interface Props {
	value: null | string
	type?: IOType
	onChange: (value: null | string) => void
}

interface StateProps {
	devices: Device[]
}

class DeviceSelect extends Component<ThunkDispatchProp & StateProps & Props> {
	render() {
		const { devices, type, ...rest } = this.props
		const deviceOptions = [
			{ value: null, text: 'All Devices' },
			...devices.map(({ id, name, disconnected }) => ({
				value: id,
				disabled: disconnected,
				text: !type ? `[${type}] ${name}` : name,
			})),
		]
		return <SelectInput {...rest} empty={false} defaultValue={null} options={deviceOptions} />
	}
}

export default connect(
	({ devices }: ReduxStoreType, { type }: Props): StateProps => ({
		devices: type ? devices.filter(device => device.type === type) : devices,
	})
)(DeviceSelect)
