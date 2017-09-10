import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import classname from 'classname'
import { connect } from 'react-redux'

import { clamp, inBounds } from '../utils/mathUtils'
import { addKeyListener, removeKeyListener } from '../utils/keyUtils'

import DeskInterfaceRenderer from './pixi/DeskInterfaceRenderer'

class DeskInterface extends Component {
	constructor(props) {
		super(props)
		this.removeActiveItem = this.removeActiveItem.bind(this)
		this.clearActiveItem = this.clearActiveItem.bind(this)
	}

	componentDidMount() {
		addKeyListener('backspace', this.removeActiveItem)
		addKeyListener('delete', this.removeActiveItem)
		addKeyListener('esc', this.clearActiveItem)
	}

	componentWillUnmount() {
		removeKeyListener('backspace', this.removeActiveItem)
		removeKeyListener('delete', this.removeActiveItem)
		removeKeyListener('esc', this.clearActiveItem)
	}

	handleMouseMove(event) {

	}

	clearActiveItem() {

	}

	removeActiveItem() {

	}

	render() {
		return (
			<div ref={elem => this.container = elem} className="desk-interface-container">
				<div ref={elem => this.interface = elem}className="desk-interface" onMouseMove={e => this.handleMouseMove(e)}>
					
				</div>
			</div>
		)
	}
}

export default connect(({instruments}) => ({instruments}))(DeskInterface)