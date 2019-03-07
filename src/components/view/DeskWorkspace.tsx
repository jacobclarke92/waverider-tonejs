import React, { Component } from 'react'
import _throttle from 'lodash/throttle'
import _find from 'lodash/find'
import classname from 'classname'
import { connect } from 'react-redux'

import Point, { PointObj } from '../../utils/Point'
import { addKeyListener, removeKeyListener } from '../../utils/keyUtils'
import {
	getRelativeMousePosition,
	getMousePosition,
	getPositionWithinElem,
	getRect,
	MousePosition,
} from '../../utils/screenUtils'
import { getDeskWires, getOwnerByDeskItem, validateConnection } from '../../deskController'
import { EFFECT, BUS, INSTRUMENT, MASTER, LFO } from '../../constants/deskItemTypes'
import { DESK } from '../../constants/uiViews'
import { updateActiveElement } from '../../reducers/gui'
import { removeEffect } from '../../reducers/effects'
import { removeInstrument } from '../../reducers/instruments'
import { moveDeskItem, connectWire, disconnectWire } from '../../reducers/desk'
import instrumentLibrary from '../../instrumentLibrary'
import Wire from '../desk/Wire'
import MasterDeskItem from '../desk/Master'
import DefaultDeskItem from '../desk/DefaultDeskItem'

import { NumericObject, ThunkDispatchProp, ReduxStoreType, IOType, WireType, DeskItemType } from '../../types'
import { PinMouseEventProps, PinParams, PinMouseEventType } from '../desk/Pin'
import { DeskItemMouseEventType } from '../desk/DeskItemWrapper'
import { State as GuiStore } from '../../reducers/gui'
import { State as DeskStore } from '../../reducers/desk'
import { State as InstrumentsStore } from '../../reducers/instruments'

const snapGrid = 10

interface Props {}

interface StateProps {
	gui: GuiStore
	desk: DeskStore
	instruments: InstrumentsStore
}

interface DeskWireReference {
	param: string
	deskItem: DeskItemType
	position: PointObj
	relativePosition: PointObj
}

interface State {
	mouseDown: boolean
	mouseMoved: boolean
	overIO: boolean
	overPin: boolean
	ioType: null | IOType
	wireType: null | WireType
	wireToValid: boolean
	wireFrom: DeskWireReference // TODO
	wireTo: DeskWireReference // TODO
	selectedWire: any // TODO
	selectedDeskItem: DeskItemType // TODO
	dragTarget: any //TOOD
	mouseDownTargetOffset?: MousePosition
	mouseDownPosition?: PointObj
	mouseDownPan?: PointObj
	pan: PointObj
	pointer?: Point
	stagePointer?: Point
}

class DeskWorkspace extends Component<ThunkDispatchProp & StateProps & Props, State> {
	container: HTMLDivElement
	interface: HTMLDivElement
	handleMouseMove: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
	deskItemRefs: NumericObject

	constructor(props) {
		super(props)
		this.clearActiveItem = this.clearActiveItem.bind(this)
		this.removeActiveItem = this.removeActiveItem.bind(this)
		this.handlePointerDown = this.handlePointerDown.bind(this)
		this.handlePointerUp = this.handlePointerUp.bind(this)
		this.handleThrottledMouseMove = _throttle(this.handleThrottledMouseMove.bind(this), 1000 / 60)
		this.handleMouseMove = e => {
			e.persist()
			this.handleThrottledMouseMove(e)
		}
		this.deskItemRefs = {}
		this.state = {
			mouseDown: false,
			mouseMoved: false,
			overIO: false,
			overPin: false,
			wireFrom: null,
			wireTo: null,
			wireToValid: false,
			ioType: null,
			wireType: null,
			selectedWire: null,
			selectedDeskItem: null,
			dragTarget: null,
			pan: { x: 0, y: 0 },
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

		this.setState({ pointer, stagePointer })

		const {
			mouseDown,
			mouseMoved,
			mouseDownPosition,
			mouseDownTargetOffset,
			mouseDownPan,
			dragTarget,
			overIO,
		} = this.state

		// enforce a minimum distance before allowing any kind of movement
		if (!mouseMoved) {
			if (mouseDown && pointer.distance(mouseDownPosition) < 10) return true
			else this.setState({ mouseMoved: true })
		}

		if (mouseDown) {
			if (dragTarget) {
				let placementPosition = new Point(stagePointer).subtract(mouseDownTargetOffset)

				if (overIO) {
					console.log('mousemove IO')
				} else {
					if (snapping) placementPosition = placementPosition.round(snapGrid)
					dispatch(moveDeskItem(dragTarget, placementPosition))
				}
			} else {
				this.setState({
					pan: {
						x: mouseDownPan.x + (pointer.x - mouseDownPosition.x),
						y: mouseDownPan.y + (pointer.y - mouseDownPosition.y),
					},
				})
			}
		}
	}

	handlePointerDown(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		console.log('pointer down for stage')
		this.setState({
			mouseDown: true,
			mouseMoved: false,
			dragTarget: null,
			mouseDownPosition: getMousePosition(event),
			mouseDownPan: { ...this.state.pan },
		})
	}

	handlePointerUp(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		console.log('pointer up for stage')
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

	handleItemPointerDown(event: DeskItemMouseEventType, element: HTMLElement, deskItem: DeskItemType) {
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

	handleItemPointerUp(event: DeskItemMouseEventType, element: HTMLElement, deskItem: DeskItemType) {
		console.log('pointer up for desk item')
		event.stopPropagation()
		event.nativeEvent.stopImmediatePropagation()
		if (!this.state.mouseMoved) {
			event.stopPropagation()
			this.setState({
				selectedDeskItem: deskItem,
				mouseDown: false,
				dragTarget: null,
				selectedWire: null,
			})
			this.props.dispatch(updateActiveElement(deskItem.type, deskItem))
		} else {
			this.setState({
				mouseDown: false,
				dragTarget: null,
				selectedWire: null,
				wireFrom: null,
				wireTo: null,
				wireToValid: null,
			})
		}
	}

	handlePinOver(event: PinMouseEventType, deskItem: DeskItemType, { wireType, ioType, label, param }: PinParams) {
		this.setState({ overPin: true })
		if (this.state.wireFrom) {
			const pinStagePosition = getPositionWithinElem(event.target as HTMLElement, this.interface, 0.5)
			const pinDeskItemPosition = new Point(pinStagePosition).subtract(new Point(deskItem.position))
			this.setState({
				wireToValid: this.state.wireType == wireType && this.state.ioType != ioType,
				wireTo: {
					param,
					deskItem,
					position: pinStagePosition,
					relativePosition: pinDeskItemPosition,
				},
			})
		}
	}

	handlePinOut(event: PinMouseEventType) {
		this.setState({
			overIO: false,
			wireTo: null,
			wireToValid: null,
		})
	}

	handlePinPointerDown(event: PinMouseEventType, deskItem: DeskItemType, { wireType, ioType, param }: PinParams) {
		event.stopPropagation()
		event.preventDefault()
		event.nativeEvent.stopImmediatePropagation()
		console.log('WIRE DOWN', deskItem, wireType, ioType)
		const pinStagePosition = getPositionWithinElem(event.target as HTMLElement, this.interface, { x: 0.5, y: 0.5 })
		const pinDeskItemPosition = new Point(pinStagePosition).subtract(new Point(deskItem.position))
		this.setState({
			wireType,
			ioType,
			wireFrom: {
				param,
				deskItem,
				position: pinStagePosition,
				relativePosition: pinDeskItemPosition,
			},
		})
	}

	handlePinPointerUp(event: PinMouseEventType, deskItem: DeskItemType, { wireType, ioType }: PinParams) {
		event.stopPropagation()
		event.preventDefault()
		event.nativeEvent.stopImmediatePropagation()
		if (this.state.wireToValid) {
			const wireFrom = ioType == 'input' ? this.state.wireFrom : this.state.wireTo
			const wireTo = ioType == 'input' ? this.state.wireTo : this.state.wireFrom
			console.log('PLS CREATE WIRE')
			console.log('params', { wireType, ioType })
			console.log('wireFrom', wireFrom)
			console.log('wireTo', wireTo)
			if (validateConnection(wireType, wireFrom, wireTo)) {
				this.props.dispatch(connectWire(wireFrom, wireTo, { wireType }))
			}
		}
		this.setState({
			mouseDown: false,
			dragTarget: null,
			selectedWire: null,
			wireFrom: null,
			wireTo: null,
			wireToValid: null,
		})
	}

	clearActiveItem() {}

	handleRemoveDeskItem(deskItem: DeskItemType) {
		if (deskItem.type == EFFECT) this.props.dispatch(removeEffect(deskItem.ownerId))
		if (deskItem.type == INSTRUMENT) this.props.dispatch(removeInstrument(deskItem.ownerId))
	}

	removeActiveItem() {
		const { selectedWire, selectedDeskItem } = this.state
		if (selectedWire) {
			this.props.dispatch(disconnectWire(selectedWire))
		} else if (selectedDeskItem) {
			this.handleRemoveDeskItem(selectedDeskItem)
		}
	}

	render() {
		const { dispatch, desk = [], instruments = [] } = this.props
		const {
			pan,
			dragTarget,
			mouseDown,
			mouseMoved,
			stagePointer,
			selectedDeskItem,
			selectedWire,
			wireFrom,
			wireTo,
			wireToValid,
		} = this.state
		const panning = mouseDown && mouseMoved && !dragTarget
		const connections = getDeskWires()
		// console.log(connections)
		return (
			<div
				ref={(elem: HTMLDivElement) => (this.container = elem)}
				className={classname('desk-interface-container', { panning })}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handlePointerDown}
				onMouseUp={this.handlePointerUp}>
				<div
					ref={(elem: HTMLDivElement) => (this.interface = elem)}
					className="desk-interface"
					style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}>
					{connections.map(wire => (
						<Wire
							key={wire.id}
							wireFrom={{ ...wire.wireFrom, deskItem: _find(desk, { id: wire.wireFrom.deskItem.id }) }}
							wireTo={{ ...wire.wireTo, deskItem: _find(desk, { id: wire.wireTo.deskItem.id }) }}
							stagePointer={stagePointer}
							selected={selectedWire && selectedWire.id === wire.id}
							onSelect={() => this.setState({ selectedWire: wire })}
						/>
					))}

					{desk.map(deskItem => (
						<DeskItem
							key={deskItem.id}
							ref={elem => (this.deskItemRefs[deskItem.id] = elem)}
							dispatch={dispatch}
							deskItem={deskItem}
							owner={getOwnerByDeskItem(deskItem)}
							wiring={!!wireFrom}
							validWire={wireToValid}
							editable={deskItem.editable}
							removeable={deskItem.removeable}
							selected={selectedDeskItem && selectedDeskItem.id === deskItem.id}
							dragging={dragTarget && dragTarget.id === deskItem.id}
							onRemove={() => this.handleRemoveDeskItem(deskItem)}
							onPointerDown={(e, elem) => this.handleItemPointerDown(e, elem, deskItem)}
							onPointerUp={(e, elem) => this.handleItemPointerUp(e, elem, deskItem)}
							onPinOut={event => this.handlePinOut(event)}
							onPinOver={(event, params) => this.handlePinOver(event, deskItem, params)}
							onPinPointerDown={(event, params) => this.handlePinPointerDown(event, deskItem, params)}
							onPinPointerUp={(event, params) => this.handlePinPointerUp(event, deskItem, params)}
						/>
					))}

					{wireFrom && (
						<Wire active valid={wireToValid} wireFrom={wireFrom} wireTo={wireTo} stagePointer={stagePointer} />
					)}
				</div>
			</div>
		)
	}
}

export interface DeskItemProps {
	deskItem: DeskItemType
	selected?: boolean
	dragging?: boolean
	editable?: boolean
	removeable?: boolean
	owner?: any // TODO
	onEdit?: () => void
	onRemove: () => void
	onPointerDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, elem: HTMLElement) => void
	onPointerUp: (event: React.MouseEvent<HTMLDivElement, MouseEvent>, elem: HTMLElement) => void
	wiring: boolean
	validWire: boolean
}

class DeskItem extends Component<ThunkDispatchProp & PinMouseEventProps & DeskItemProps> {
	render() {
		const { type, ownerType } = this.props.deskItem
		let DeskComponent = null
		if (type == MASTER) DeskComponent = MasterDeskItem
		if (type == INSTRUMENT) DeskComponent = instrumentLibrary[ownerType].DeskItem
		if (!DeskComponent) DeskComponent = DefaultDeskItem
		return <DeskComponent {...this.props} />
	}
}

export default connect(({ gui, desk, instruments }: ReduxStoreType): StateProps => ({ gui, desk, instruments }))(
	DeskWorkspace
)
