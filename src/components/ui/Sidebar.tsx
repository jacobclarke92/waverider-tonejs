import React, { FunctionComponent, ComponentType } from 'react'

interface Props {
	Component?: ComponentType | null
	children?: React.ReactNode
}

const Sidebar: FunctionComponent<Props> = ({ children = null, Component }) => (
	<aside className="sidebar">{Component ? <Component /> : children}</aside>
)
export default Sidebar
