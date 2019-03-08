import React, { ComponentType, FunctionComponent } from 'react'

interface Props {
	Component: ComponentType
}

const Navbar: FunctionComponent<Props> = ({ children, Component }) => (
	<nav className="navbar">{Component ? <Component /> : children || null}</nav>
)
export default Navbar
