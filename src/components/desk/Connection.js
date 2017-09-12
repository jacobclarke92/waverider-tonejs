import React, { Component } from 'react'
import classnames from 'classnames'

export default class DeskItemConnection extends Component {
	render() {
		const { type, flow } = this.props
		return (
			<div className={classnames('connection', type, flow)} />
		)
	}
}