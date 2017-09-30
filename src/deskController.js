import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { Master } from 'tone'
import { getEffectInstance } from './effectsController'
import { getInstrumentInstance } from './instrumentsController'
import { LOAD_DESK, DESK_CONNECT_WIRE, DESK_DISCONNECT_WIRE } from './reducers/desk'
import { MASTER, BUS, INSTRUMENT, FX, LFO } from './constants/deskItemTypes'

let store = null
let oldDesk = []

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
}

function handleUpdate() {
	const { lastAction, desk } = store.getState()
	switch(lastAction.type) {
		case LOAD_DESK: initConnections(desk); break
		case DESK_CONNECT_WIRE: handleNewConnection(lastAction); break
		case DESK_DISCONNECT_WIRE: handleRemoveConnection(lastAction); break
	}
	oldDesk = _cloneDeep(desk)
}

function handleNewConnection(action) {
	connectAudioWires(action.deskItem)
}

function handleRemoveConnection(action) {
	connectAudioWires(action.deskItem, true)
}

function initConnections(desk) {
	for(let deskItem of desk) {
		connectAudioWires(deskItem)
	}
}

function getSource(deskItem) {
	let source = null
	switch(deskItem.type) {
		case MASTER: source = Master; break
		case INSTRUMENT: source = getInstrumentInstance(deskItem.ownerId); break
		case FX: source = getEffectInstance(deskItem.ownerId); break
	}
	return source
}

export function connectAudioWires(fromDeskItem, disconnectFirst = false) {
	if(!fromDeskItem) {
		console.warn('No desk item provided to connectAudioWires')
		return
	}

	const fromSource = getSource(fromDeskItem)
	if(!fromSource) {
		console.warn('Could not find source for output item', fromDeskItem)
		return
	}

	const outputs = fromDeskItem.audioOutputs || {}
	const connections = []
	for(let ownerId in outputs) {
		const toDeskItem = outputs[ownerId].wireTo.deskItem
		// console.log('TO DESK ITEM', toDeskItem)
		if(!toDeskItem) {
			console.warn('Could not find input desk item for ownerId', ownerId)
			continue
		}
		const toSource = getSource(toDeskItem)
		if(!toSource) {
			console.warn('Could not find source for input item', toDeskItem)
			continue
		}
		// console.log('To source', toSource)
		connections.push(toSource.getToneSource())
	}

	const fromToneSource = fromSource.getToneSource()

	if(fromToneSource) {
		if(disconnectFirst) fromToneSource.disconnect()
		if(connections.length > 0) {
			fromToneSource.fan.apply(fromToneSource, connections)
		}
	}else{
		console.warn('Unable to connect', fromSource.id, fromSource.type, 'because tone.js source is not available', fromToneSource)
	}
}

export function getDeskWires() {
	const { desk = [] } = store.getState()
	if(!desk.length) return []
	const connections = []
	for(let fromItem of desk) {
		if(fromItem.audioOutput) Object.keys(fromItem.audioOutputs).forEach(outputId => {
			const wire = fromItem.audioOutputs[outputId]
			connections.push(wire)
		})
		if(fromItem.dataOutput) Object.keys(fromItem.dataOutputs).forEach(outputId => {
			const wire = fromItem.dataOutputs[outputId];
			connections.push(wire)
		})
	}
	return connections
}

export function validateConnection(wireType, wireFrom, wireTo) {
	const { desk = [] } = store.getState()
	const fromDeskItem = _find(desk, {id: wireFrom.deskItem.id})
	const toDeskItem = _find(desk, {id: wireTo.deskItem.id})

	if(!fromDeskItem[wireType+'Output'] || !toDeskItem[wireType+'Input']) {
		console.warn(`Invalid connection -- either ${wireFrom.deskItem.name} does not allow ${wireType} output or  ${wireTo.deskItem.name} does not allow ${wireType} input`);
		return false
	}

	const outputs = fromDeskItem[wireType+'Outputs'] || {}
	if(toDeskItem.ownerId in outputs) {
		console.warn(`Connection already exists between ${wireFrom.deskItem.name} and ${wireTo.deskItem.name}`)
		return false
	}

	return true
}