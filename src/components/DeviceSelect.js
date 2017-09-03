import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectInput from './input/SelectInput'

class DeviceSelect extends Component {
	render() {
		const { devices, ...rest } = this.props
		const deviceOptions = [
			{value: null, text: 'All Devices'},
			...devices.map(({id, name, manufacturer}) => ({value: id, text: `${manufacturer && '('+manufacturer+')'} ${name}`}))
		]
		return (
			<SelectInput {...rest} empty={false} defaultValue={null} options={deviceOptions} />
		)
	}
}

export default connect(({devices}) => ({devices}))(DeviceSelect)