import React, { Component } from 'react'
import SelectInput from './input/SelectInput'

export default class ChannelSelect extends Component {
	render() {
		const deviceOptions = [
			{value: null, text: 'All Channels'},
			...Array.apply(null, Array(16)).map((x, i) => ({value: i+1, text: 'Channel '+(i+1)}))
		]
		return (
			<SelectInput {...this.props} empty={false} defaultValue={null} options={deviceOptions} />
		)
	}
}