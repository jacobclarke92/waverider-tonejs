import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { getEffectInstance } from './effectsController'
import { getInstrumentInstance } from './instrumentsController'
import { DESK_CONNECT_WIRE, DESK_DISCONNECT_WIRE } from './reducers/desk'

let store = null
let oldDesk = []

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
}

function handleUpdate() {
	const { lastAction, desk } = store.getState()
	switch(lastAction.type) {
		case DESK_CONNECT_WIRE: handleNewConnection(lastAction); break
		case DESK_DISCONNECT_WIRE: handleRemoveConnection(lastAction); break
	}
	oldDesk = _cloneDeep(desk)
}

function handleNewConnection(action) {
	return
	// connectAudioWires(...)
}

function handleRemoveConnection(action) {
	return
	// handleRemoveConnection(...)
}

export function connectAudioWires(source, id, disconnectFirst = false) {
	if(!source) console.warn('no audio source to connect from', source, id)
	if(!source || !id) return
	
	const { desk } = store.getState()
	const deskItem = _find(desk, {ownerId: id})
	if(!deskItem) return

	const connections = []
	Object.keys(deskItem.audioOutputs).forEach(connectToId => {
		if(connectToId == 'master') {
			connections.push(/*Tone.Master*/Submaster)
		}else{
			const effectInstance = getEffectInstance(connectToId)
			if(effectInstance) connections.push(effectInstance)
			// todo: buses
		}
	})
	
	if(disconnectFirst) source.disconnect()
	if(connections.length) {
		console.log('Connecting sound source '+id+' to', connections)
		source.fan.apply(source, connections)
	}
}

export function getDeskWires() {
	const { desk = [] } = store.getState()
	if(!desk.length) return []
	const connections = []
	for(let fromItem of desk) {
		if(fromItem.audioOutput) Object.keys(fromItem.audioOutputs).forEach(outputId => {
			const wire = fromItem.audioOutputs[outputId]
			const toItem = _find(desk, {ownerId: outputId})
			if(toItem) connections.push({
				type: 'audio',
				id: fromItem.ownerId+'___'+toItem.ownerId,
				wireFrom: {
					deskItem: fromItem,
					position: {...wire.outputPosition},
					relativePosition: {...wire.outputRelativePosition},
				},
				wireTo: {
					deskItem: toItem,
					position: {...wire.inputPosition},
					relativePosition: {...wire.inputRelativePosition},
				},
			})
		})
		if(fromItem.dataOutput) Object.keys(fromItem.dataOutputs).forEach(outputId => {
			const wire = fromItem.dataOutputs[outputId];
			const toItem = _find(desk, {ownerId: outputId})
			if(toItem) connections.push({
				type: 'data',
				id: fromItem.ownerId+'___'+toItem.ownerId,
				wireFrom: {
					deskItem: fromItem,
					position: {...wire.outputPosition},
					relativePosition: {...wire.outputRelativePosition},
				},
				wireTo: {
					deskItem: toItem,
					position: {...wire.inputPosition},
					relativePosition: {...wire.inputRelativePosition},
				},
			})
		})
	}
	return connections
}

export function validateConnection(wireType, wireFrom, wireTo) {
	const { desk = [] } = store.getState()
	const fromDeskItem = _find(desk, {id: wireFrom.deskItem.id})
	const toDeskItem = _find(desk, {id: wireTo.deskItem.id})
	console.log(fromDeskItem)
	console.log(toDeskItem)

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