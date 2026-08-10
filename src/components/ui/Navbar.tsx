import React, { ComponentType, FunctionComponent } from 'react'

interface Props {
	Component?: ComponentType | null
	children?: React.ReactNode
}

const Navbar: FunctionComponent<Props> = ({ children, Component }) => (
	<nav className="navbar">{Component ? <Component /> : children || null}</nav>
)
export default Navbar
