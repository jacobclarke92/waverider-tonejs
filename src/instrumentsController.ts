import { NumericObject, Instrument } from './types'
import instrumentLibrary from './instrumentLibrary'
import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { NOTE_ON, NOTE_OFF, MidiMessageAction } from './api/midi'
import { DESK_CONNECT_WIRE, DESK_DISCONNECT_WIRE } from './reducers/desk'
import { LOAD_INSTRUMENTS, ADD_INSTRUMENT, REMOVE_INSTRUMENT, UPDATE_INSTRUMENT } from './reducers/instruments'

let store: any = null // TODO
let oldInstruments: Instrument[] = []

const instances: NumericObject = {}

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
}

export function getInstrumentInstance(id: number) {
	if (id in instances) return instances[id]
	return false
}

export function isDeviceUsedByInstrument(deviceId: string): boolean {
	const { instruments }: { instruments: Instrument[] } = store.getState() as any // TODO
	const deviceIds = instruments.map(({ midiDeviceId }) => midiDeviceId)
	return deviceIds.indexOf(deviceId) >= 0
}

function handleUpdate() {
	const { lastAction, instruments, desk } = store.getState() as any // TODO
	switch (lastAction.type) {
		case LOAD_INSTRUMENTS:
			initInstruments(instruments)
			break
		case UPDATE_INSTRUMENT:
			updateInstrument(lastAction, instruments)
			break
		case ADD_INSTRUMENT:
			initInstrument(lastAction.instrument)
			break
		case REMOVE_INSTRUMENT:
			removeInstrument(lastAction.id)
			break
		case NOTE_ON:
		case NOTE_OFF:
			handleNoteAction(lastAction, instruments)
			break
		case DESK_CONNECT_WIRE:
			handleWireConnection(lastAction, desk)
			break
		case DESK_DISCONNECT_WIRE:
			handleWireDisconnection(lastAction, desk)
			break
	}
	oldInstruments = _cloneDeep(instruments)
}

function initInstruments(instruments: Instrument[]) {
	console.log('Initing instruments', instruments)
	instruments.forEach(instrument => initInstrument(instrument))
}

function initInstrument(instrument: Instrument) {
	const Instrument = instrumentLibrary[instrument.type].Instrument
	instances[instrument.id] = new Instrument(instrument, store.dispatch)
}

// TODO
function updateInstrument({ id }, instruments: Instrument[]) {
	const instrument = _find(instruments, { id })
	if (!instrument) return
	const oldInstrument = _find(oldInstruments, { id })
	if (!(id in instances)) initInstrument(instrument as Instrument)
	else instances[id].update(instrument, oldInstrument)
}

// TODO
function removeInstrument(id: number) {
	if (id in instances) {
		const source = instances[id].getToneSource()
		if (source) source.dispose()
		delete instances[id]
	}
}

function handleNoteAction({ type, deviceId, channel, note, velocity }: MidiMessageAction, instruments: Instrument[]) {
	const targetInstruments = instruments.filter(
		({ enabled, midiDeviceId, midiChannel }) =>
			enabled && (!midiDeviceId || midiDeviceId == deviceId) && (!midiChannel || midiChannel == channel)
	)
	targetInstruments.forEach(instrument => {
		if (type == NOTE_ON) instances[instrument.id].noteDown(note, velocity)
		else if (type == NOTE_OFF) instances[instrument.id].noteUp(note)
	})
}

function handleWireConnection(action, desk) {}

function handleWireDisconnection(action, desk) {}
