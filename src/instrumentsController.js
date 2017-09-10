import instrumentLibrary from './instrumentLibrary'
import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import { NOTE_ON, NOTE_OFF } from './api/midi'
import { LOAD_INSTRUMENTS, ADD_INSTRUMENT, REMOVE_INSTRUMENT, UPDATE_INSTRUMENT } from './reducers/instruments'


let store = null
let oldInstruments = []

const instances = {}

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
}

export function getInstrumentInstance(id) {
	if(id in instances) return instances[id]
	return false
}

export function isDeviceUsedByInstrument(deviceId) {
	const { instruments } = store.getState()
	const deviceIds = instruments.map(({midiDeviceId}) => midiDeviceId)
	return deviceIds.indexOf(deviceId) >= 0
}

function handleUpdate() {
	const { lastAction, instruments } = store.getState()
	switch(lastAction.type) {
		case LOAD_INSTRUMENTS: initInstruments(instruments); break
		case UPDATE_INSTRUMENT: updateInstrument(lastAction.instrument); break
		case ADD_INSTRUMENT: initInstrument(lastAction.instrument); break
		case NOTE_ON: 
		case NOTE_OFF: handleNoteAction(lastAction, instruments); break

	}
	oldInstruments = _cloneDeep(instruments)
}

function initInstruments(instruments) {
	console.log('Initing instruments', instruments)
	instruments.forEach(instrument => initInstrument(instrument))
}

function initInstrument(instrument) {
	const Instrument = instrumentLibrary[instrument.type].Instrument
	instances[instrument.id] = new Instrument(instrument, store.dispatch)
}

function updateInstrument(instrument) {
	const oldInstrument = _find(oldInstruments, {id: instrument.id})
	if(!(instrument.id in instances)) initInstrument(instrument)
	else instances[instrument.id].update(instrument, oldInstrument)
}

function handleNoteAction({type, deviceId, channel, note, velocity}, instruments) {
	const targetInstruments = instruments.filter(({midiDeviceId, midiChannel}) => (!midiDeviceId || midiDeviceId == deviceId) && (!midiChannel || midiChannel == channel))
	targetInstruments.forEach(instrument => {
		if(type == NOTE_ON) instances[instrument.id].noteDown(note, velocity)
		else if(type == NOTE_OFF) instances[instrument.id].noteUp(note)
	})
}