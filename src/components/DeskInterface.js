import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import classname from 'classname'
import { connect } from 'react-redux'

import Point from '../Point'
import { addKeyListener, removeKeyListener } from '../utils/keyUtils'
import { FX, BUS, INSTRUMENT, MASTER, LFO } from '../constants/deskItemTypes'
import { getDeskWires } from '../deskController'
import instrumentLibrary from '../instrumentLibrary'

class DeskInterface extends Component {
	constructor(props) {
		super(props)
		this.clearActiveItem = this.clearActiveItem.bind(this)
		this.removeActiveItem = this.removeActiveItem.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
		this.handleMouseMove = _throttle(this.handleMouseMove.bind(this), 1000/60)
		this.state = {
			mouseDown: false,
			mouseMoved: false,
			overIO: false,
			wireFrom: null,
			wireTo: null,
			wireToValid: false,
			ioType: null,
			wireType: null,
			selectedWire: null,
			selectedDeskItem: null,
			dragTarget: null,
		}
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

	handleMouseDown(event) {
		this.setState({
			mouseDown: true,
			mouseMoved: false,
			dragTarget: null,
			mouseDownPosition: new Point(event.clientX, event.clientY),
		})
	}

	handleMouseUp(event) {
		this.setState({
			mouseDown: false,
			dragTarget: null,
			wireFrom: null,
			wireTo: null,
			wireToValid: false,
			ioType: null,
			wireType: null,
			selectedWire: null,
			selectedDeskItem: null,
		})
	}

	clearActiveItem() {

	}

	removeActiveItem() {

	}

	render() {
		const { desk, instruments } = this.props
		const connections = getDeskWires()
		return (
			<div ref={elem => this.container = elem} className="desk-interface-container">
				<div ref={elem => this.interface = elem} className="desk-interface" onMouseMove={e => this.handleMouseMove(e)}>
					{desk.map(deskItem => <DeskItem key={deskItem.id} {...deskItem} />)}
				</div>
			</div>
		)
	}
}

class DeskItem extends Component {
	render() {
		const { type, slug } = this.props
		let DeskComponent = null
		if(type == INSTRUMENT) DeskComponent = instrumentLibrary[slug].DeskItem
		return (
			<DeskComponent />
		)
	}
}

export default connect(({desk, instruments}) => ({desk, instruments}))(DeskInterface)