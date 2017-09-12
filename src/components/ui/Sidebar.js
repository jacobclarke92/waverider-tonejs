import React, { Component } from 'react'

export default ({children, Component}) => 
	<aside className="sidebar">{Component ? <Component /> : children}</aside>