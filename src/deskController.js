import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { getEffectInstance } from './effectsController'
import { getInstrumentInstance } from './instrumentsController'

let store = null
let oldDesk = []

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
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

function handleUpdate() {
	const { lastAction, desk } = store.getState()
	switch(lastAction.type) {

	}
	oldDesk = _cloneDeep(desk)
}