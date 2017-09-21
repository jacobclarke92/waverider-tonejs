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
		case DESK_CONNECT_WIRE: handleNewConnection(action); break
		case DESK_CONNECT_WIRE: handleRemoveConnection(action); break
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
				from: {x: fromItem.position.x + wire.outputPosition.x, y: fromItem.position.y + wire.outputPosition.y},
				to: {x: toItem.position.x + wire.inputPosition.x, y: toItem.position.y + wire.inputPosition.y},
				outputOwnerId: fromItem.ownerId,
				inputOwnerId: toItem.ownerId,
			})
		})
		if(fromItem.dataOutput) Object.keys(fromItem.dataOutputs).forEach(outputId => {
			const wire = fromItem.dataOutputs[outputId];
			const toItem = _find(desk, {ownerId: outputId})
			if(toItem) connections.push({
				type: 'data',
				id: fromItem.ownerId+'___'+toItem.ownerId,
				from: {x: fromItem.position.x + wire.outputPosition.x, y: fromItem.position.y + wire.outputPosition.y},
				to: {x: toItem.position.x + wire.inputPosition.x, y: toItem.position.y + wire.inputPosition.y},
				outputOwnerId: fromItem.ownerId,
				inputOwnerId: toItem.ownerId,
				inputParamKey: wire.inputParam.key,
			})
		})
	}
	return connections
}