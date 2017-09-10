import React, { Component } from 'react'
import classname from 'classname'

export default class PropertiesPanel extends Component {

	static defaultProps = {
		icon: null,
		status: 'noraml',
		title: 'Properties',
	}

	constructor(props) {
		super(props)
		this.state = {
			collapsed: true,
		}
	}

	render() {
		const { collapsed } = this.state
		const { children, icon, status, title } = this.props
		return (
			<div className={classname('properties-panel', {collapsed})}>
				<div className="properties-panel-tab tab" onClick={() => this.setState({collapsed: !collapsed})}>
					<div className="tab-inner">
						<div className="tab-title">{title}</div>
					</div>
				</div>
				<div className="properties-panel-inner">
					{children}
				</div>
			</div>
		)
	}
}