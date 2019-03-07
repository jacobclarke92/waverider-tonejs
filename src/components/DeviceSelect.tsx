import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectInput from './input/SelectInput'
import { ReduxStoreType, Device, ThunkDispatchProp } from '../types'

interface Props {
	value: null | string
	onChange: (value: null | string) => void
}

interface StateProps {
	devices: Device[]
}

class DeviceSelect extends Component<ThunkDispatchProp & StateProps & Props> {
	render() {
		const { devices, ...rest } = this.props
		const deviceOptions = [
			{ value: null, text: 'All Devices' },
			...devices.map(({ id, name, disconnected }) => ({
				value: id,
				disabled: disconnected,
				text: name,
			})),
		]
		return <SelectInput {...rest} empty={false} defaultValue={null} options={deviceOptions} />
	}
}

export default connect(({ devices }: ReduxStoreType): StateProps => ({ devices }))(DeviceSelect)
