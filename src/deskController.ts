import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { Master } from 'tone'

import { getEffectInstance } from './effectsController'
import { getInstrumentInstance } from './instrumentsController'
import { MASTER, BUS, INSTRUMENT, EFFECT, LFO, SEQUENCER } from './constants/deskItemTypes'
import { deskItemTypeDefaults } from './constants/deskItemTypes'

import { Store } from 'redux'
import {
	ReduxStoreType,
	DeskItemType,
	WireJoins,
	WireJoin,
	WireType,
	Wire,
	Effect,
	Instrument,
	Sequencer,
} from './types'
import {
	LOAD_DESK,
	RELOAD_DESK,
	DESK_CONNECT_WIRE,
	DESK_DISCONNECT_WIRE,
	REINIT_INSTRUMENT_INSTANCE,
	ActionObj as DeskActionObj,
	State as DeskStore,
} from './reducers/desk'
import BaseEffect from './effects/BaseEffect'
import BaseInstrument from './instruments/BaseInstrument'
import { getSequencerInstance } from './sequencersController'

let store: Store
let oldDesk: DeskStore = []

const connectionAttempts = {}

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
}

function handleUpdate() {
	const { lastAction, desk } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
		case RELOAD_DESK:
		case LOAD_DESK:
			initConnections(desk)
			break
		case DESK_CONNECT_WIRE:
			handleNewConnection(lastAction as DeskActionObj)
			break
		case DESK_DISCONNECT_WIRE:
			handleRemoveConnection(lastAction as DeskActionObj)
			break
		case REINIT_INSTRUMENT_INSTANCE:
			handleReinitDeskInstance(lastAction.id)
			break
	}
	oldDesk = _cloneDeep(desk)
}

function initConnections(desk: DeskStore) {
	for (let deskItem of desk) {
		connectAudioWires(deskItem)
	}
}

function handleNewConnection(action: DeskActionObj) {
	connectAudioWires(action.deskItem)
}

function handleRemoveConnection(action: DeskActionObj) {
	connectAudioWires(action.deskItem, true)
}

function handleReinitDeskInstance(deskItemId: number) {
	const { desk } = store.getState() as ReduxStoreType
	const deskItem = _find(desk, { id: deskItemId })
	if (!deskItem) {
		console.warn('Unable to find desk item in order to reinit tone instance', deskItemId)
		return
	}
	console.log('Reiniting tone instance for desk item', deskItem)
	connectAudioWires(deskItem, true)
}

function getSource(deskItem: DeskItemType): false | BaseEffect | BaseInstrument {
	let source = null
	switch (deskItem.type) {
		case MASTER:
			source = Master
			break
		case INSTRUMENT:
			source = getInstrumentInstance(deskItem.ownerId)
			break
		case EFFECT:
			source = getEffectInstance(deskItem.ownerId)
			break
		case SEQUENCER:
			source = getSequencerInstance(deskItem.ownerId)
	}
	return source
}

export function connectAudioWires(fromDeskItem: DeskItemType, disconnectFirst: boolean = false) {
	if (!fromDeskItem) {
		console.warn('No desk item provided to connectAudioWires')
		return
	}

	// Only consider desk items that have audio output
	if (!fromDeskItem.type || !deskItemTypeDefaults[fromDeskItem.type].audioOutput) return

	const fromSource = getSource(fromDeskItem)
	if (!fromSource) {
		console.warn('Could not find source for output item', fromDeskItem)
		return
	}

	const { desk = [] } = store.getState() as ReduxStoreType

	const outputs: WireJoins = fromDeskItem.audioOutputs || {}
	const connections = []
	for (let ownerId in outputs) {
		const toDeskItem = _find(desk, { id: outputs[ownerId].wireTo.deskItemId })
		// console.log('TO DESK ITEM', toDeskItem)
		if (!toDeskItem) {
			console.warn('Could not find input desk item for ownerId', ownerId)
			continue
		}
		const toSource = getSource(toDeskItem)
		if (!toSource) {
			console.warn('Could not find source for input item', toDeskItem)
			continue
		}
		// console.log('To source', toSource)
		connections.push(toSource.getToneSource())
	}

	const attemptConnectingOutputs = () => {
		const fromToneSource = fromSource.getToneSource()
		if (fromToneSource) {
			if (disconnectFirst) fromToneSource.disconnect()
			if (connections.length > 0) {
				fromToneSource.fan.apply(fromToneSource, connections)
				if (fromSource.id in connectionAttempts)
					console.log(`Connected ${fromDeskItem.type} after ${connectionAttempts[fromSource.id]} attempts`)
			}
		} else {
			console.warn(
				`Unable to connect ${fromDeskItem.type} (${fromSource.id}) because tone.js source is not available yet`
			)
			if (!(fromSource.id in connectionAttempts)) connectionAttempts[fromSource.id] = 0
			if (connectionAttempts[fromSource.id] < 5) {
				connectionAttempts[fromSource.id] += 1
				setTimeout(() => {
					console.log(`Attempting ${fromDeskItem.type} output connection #${connectionAttempts[fromSource.id]}...`)
					attemptConnectingOutputs()
				}, 500)
			} else {
				console.warn('Max reconnection attempts reached')
			}
		}
	}

	attemptConnectingOutputs()
}

export function getDeskWires(): WireJoin[] {
	const { desk = [] } = store.getState() as ReduxStoreType
	if (!desk.length) return []
	const connections: WireJoin[] = []
	for (let fromItem of desk) {
		if (fromItem.audioOutput)
			Object.keys(fromItem.audioOutputs).forEach(outputId => {
				const wire: WireJoin = fromItem.audioOutputs[outputId]
				connections.push(wire)
			})
		if (fromItem.dataOutput)
			Object.keys(fromItem.dataOutputs).forEach(outputId => {
				const wire: WireJoin = fromItem.dataOutputs[outputId]
				connections.push(wire)
			})
		if (fromItem.midiOutput)
			Object.keys(fromItem.midiOutputs).forEach(outputId => {
				const wire: WireJoin = fromItem.midiOutputs[outputId]
				connections.push(wire)
			})
	}
	return connections
}

export function getDeskItemsConnectedTo(targetDeskItem: DeskItemType): DeskItemType[] {
	const { desk = [] } = store.getState() as ReduxStoreType
	return desk.filter(deskItem => {
		if (deskItem.audioOutput && Object.keys(deskItem.audioOutputs).length > 0) {
			for (let key in deskItem.audioOutputs) {
				const connection = deskItem.audioOutputs[key]
				if (connection.wireTo.deskItemId == targetDeskItem.id) return true
			}
		}
		return false
	})
}

export function getWiresRoutedTo(targetDeskItem: DeskItemType): WireJoin[] {
	const wireJoins: WireJoin[] = []
	const { desk = [] } = store.getState() as ReduxStoreType
	desk
		.filter(({ audioOutput, audioOutputs }) => audioOutput && Object.keys(audioOutputs).length > 0)
		.forEach(deskItem => {
			for (let key in deskItem.audioOutputs) {
				const connection = deskItem.audioOutputs[key]
				if (connection.wireTo.deskItemId == targetDeskItem.id) wireJoins.push(connection)
			}
		})
	return wireJoins
}

export function validateConnection(wireType: WireType, wireFrom: Wire, wireTo: Wire): boolean {
	const { desk } = store.getState() as ReduxStoreType
	const fromDeskItem: DeskItemType = _find(desk, { id: wireFrom.deskItemId })
	const toDeskItem: DeskItemType = _find(desk, { id: wireTo.deskItemId })

	if (!fromDeskItem[wireType + 'Output'] || !toDeskItem[wireType + 'Input']) {
		console.warn(
			`Invalid connection -- either ${fromDeskItem.name} does not allow ${wireType} output or  ${toDeskItem.name} does not allow ${wireType} input`
		)
		return false
	}

	const outputs = fromDeskItem[wireType + 'Outputs'] || {}
	if (toDeskItem.ownerId in outputs) {
		console.warn(`Connection already exists between ${fromDeskItem.name} and ${toDeskItem.name}`)
		return false
	}

	return true
}

export function getOwnerByDeskItem(deskItem: DeskItemType): Effect | Instrument | Sequencer | null {
	const { instruments, effects, sequencers } = store.getState() as ReduxStoreType
	if (deskItem.type == EFFECT) return _find(effects, { id: deskItem.ownerId })
	if (deskItem.type == INSTRUMENT) return _find(instruments, { id: deskItem.ownerId })
	if (deskItem.type == SEQUENCER) return _find(sequencers, { id: deskItem.ownerId })
	return null
}
