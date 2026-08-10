import React, { Component } from 'react'
import cn from 'classnames'

interface Props {
	icon?: string
	status?: string
	title?: string
	children?: React.ReactNode
}

interface State {
	collapsed: boolean
}

export default class PropertiesPanel extends Component<Props, State> {
	static defaultProps = {
		icon: null,
		status: 'normal',
		title: 'Properties',
	}

	state = { collapsed: true }

	render() {
		const { collapsed } = this.state
		const { children, icon, status, title } = this.props
		return (
			<div className={cn('properties-panel', { collapsed })}>
				<div className="properties-panel-tab tab" onClick={() => this.setState({ collapsed: !collapsed })}>
					<div className="tab-inner">
						<div className="tab-title">{title}</div>
					</div>
				</div>
				<div className="properties-panel-inner">{children}</div>
			</div>
		)
	}
}
