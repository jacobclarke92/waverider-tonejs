import React, { Component } from 'react'

export default ({children, Component}) => 
	<nav className="navbar">{Component ? <Component /> : children}</nav>