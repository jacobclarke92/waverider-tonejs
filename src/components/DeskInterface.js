import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import classname from 'classname'
import { connect } from 'react-redux'

import Point from '../Point'
import { addKeyListener, removeKeyListener } from '../utils/keyUtils'
import { getRelativeMousePosition, getMousePosition } from '../utils/screenUtils'
import { FX, BUS, INSTRUMENT, MASTER, LFO } from '../constants/deskItemTypes'
import { DESK } from '../constants/uiViews'
import { moveDeskItem } from '../reducers/desk'
import { getDeskWires } from '../deskController'
import instrumentLibrary from '../instrumentLibrary'
import MasterDeskItem from './desk/Master'

class DeskInterface extends Component {
	constructor(props) {
		super(props)
		this.clearActiveItem = this.clearActiveItem.bind(this)
		this.removeActiveItem = this.removeActiveItem.bind(this)
		this.handlePointerDown = this.handlePointerDown.bind(this)
		this.handlePointerUp = this.handlePointerUp.bind(this)
		this.handleThrottledMouseMove = _throttle(this.handleThrottledMouseMove.bind(this), 1000/60)
		this.handleMouseMove = e => {
			e.persist()
			this.handleThrottledMouseMove(e)
		}
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
			mouseDownTargetOffset: null,
			pan: {x: 0, y: 0},
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

	handleThrottledMouseMove(event) {
		const { dispatch, gui } = this.props
		const { snapping } = gui.viewStates[DESK]

		const pointer = new Point(getMousePosition(event))
		const stagePointer = new Point(getRelativeMousePosition(event, this.interface))
		
		this.setState({pointer, stagePointer})


		const { mouseDown, mouseMoved, mouseDownPosition, mouseDownTargetOffset, mouseDownPan, dragTarget, overIO } = this.state

		// enforce a minimum distance before allowing any kind of movement
		if(!mouseMoved) {
			if(mouseDown && pointer.distance(mouseDownPosition) < 10) return true
			else this.setState({mouseMoved: true})
		}

		if(mouseDown) {
			if(dragTarget) {
				let placementPosition = new Point(stagePointer).subtract(mouseDownTargetOffset)

				if(overIO) {
					console.log('mousemove IO');
				}else{
					if(snapping) placementPosition = placementPosition.round(15)
					dispatch(moveDeskItem(dragTarget, placementPosition))
				}
			}else{
				this.setState({pan: {
					x: mouseDownPan.x + (pointer.x - mouseDownPosition.x),
					y: mouseDownPan.y + (pointer.y - mouseDownPosition.y),
				}})
			}
		}

	}

	handlePointerDown(event) {
		console.log('pointer down for stage')
		this.setState({
			mouseDown: true,
			mouseMoved: false,
			dragTarget: null,
			mouseDownPosition: getMousePosition(event),
			mouseDownPan: {...this.state.pan},
		})
	}

	handlePointerUp(event) {
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

	handleItemPointerDown(event, element, deskItem) {
		console.log('pointer down for ', deskItem)
		event.stopPropagation()
		event.nativeEvent.stopImmediatePropagation()
		this.setState({
			mouseMoved: false,
			mouseDown: true,
			dragTarget: deskItem,
			mouseDownPosition: getMousePosition(event),
			mouseDownTargetOffset: getRelativeMousePosition(event, element),
		})
	}

	handleItemPointerUp(event, element, deskItem) {
		event.stopPropagation()
		event.nativeEvent.stopImmediatePropagation()
		if(!this.state.mouseMoved) {
			event.stopPropagation();
			this.setState({
				selectedDeskItem: deskItem,
				mouseDown: false,
				dragTarget: null,
				selectedWire: null,
			})
		}else{
			this.setState({
				mouseDown: false,
				dragTarget: null,
				selectedWire: null,
			})
		}
	}

	handleOutIO() {

	}

	handleOverIO(event, deskItem, wireType, ioType, label) {

	}

	handlePointerDownIO(event, deskItem, wireType, ioType) {

	}

	clearActiveItem() {

	}

	removeActiveItem() {

	}

	render() {
		const { desk, instruments } = this.props
		const { pan, dragTarget, mouseDown, mouseMoved } = this.state
		const panning = mouseDown && mouseMoved && !dragTarget
		const connections = getDeskWires()
		return (
			<div 
				ref={elem => this.container = elem} 
				className={classname('desk-interface-container', {panning})}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handlePointerDown} 
				onMouseUp={this.handlePointerUp}>

				<div 
					ref={elem => this.interface = elem} 
					className="desk-interface"
					style={{transform: `translate(${pan.x}px, ${pan.y}px)`}}>

					{desk.map(deskItem => 
						<DeskItem 
							key={deskItem.id} 
							deskItem={deskItem}
							dragging={dragTarget && dragTarget.id === deskItem.id}
							onPointerDown={(e, elem) => this.handleItemPointerDown(e, elem, deskItem)}
							onPointerUp={(e, elem) => this.handleItemPointerUp(e, elem, deskItem)}
							onOutIO={event => this.handleOutIO(event)}
							onOverIO={(event, wireType, ioType, label) => this.handleOverIO(event, deskItem, wireType, ioType, label)} 
							onPointerDownIO={(event, wireType, ioType) => this.handlePointerDownIO(event, deskItem, wireType, ioType)} />
					)}

				</div>
			</div>
		)
	}
}

class DeskItem extends Component {
	render() {
		const { type, ownerType } = this.props.deskItem
		let DeskComponent = null
		if(type == MASTER) DeskComponent = MasterDeskItem
		if(type == INSTRUMENT) DeskComponent = instrumentLibrary[ownerType].DeskItem
		return (
			<DeskComponent {...this.props}  />
		)
	}
}

export default connect(({gui, desk, instruments}) => ({gui, desk, instruments}))(DeskInterface)

