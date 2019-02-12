import _find from 'lodash/find'
import _difference from 'lodash/difference'
import { updateDevices } from '../reducers/devices'
import { isDeviceUsedByInstrument } from '../instrumentsController'

export const NOTE_ON = 144
export const NOTE_OFF = 128

export const deviceSchema = 'id,type,name,manufacturer,version,disconnected'

let midi = null

let listeners = []
let noteDownListeners = []
let noteUpListeners = []

let store = null

export const addListener = func => listeners.push(func)
export const addNoteDownListener = func => noteDownListeners.push(func)
export const addNoteUpListener = func => noteUpListeners.push(func)
export const removeListener = func => (listeners = listeners.filter(listener => listener != func))
export const removeNoteDownListener = func =>
	(noteDownListeners = noteDownListeners.filter(listener => listener != func))
export const removeNoteUpListener = func => (noteUpListeners = noteUpListeners.filter(listener => listener != func))

export function init(_store) {
	store = _store
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess({ sysex: false }).then(handleMidiSuccess, handleMidiFailure)
	} else {
		console.warn('No MIDI support in your browser.')
	}
}

const handleMidiSuccess = midiAccess => {
	midi = midiAccess
	midi.onstatechange = ({ port }) => handleDeviceUpdates()
	handleDeviceUpdates()
}

const handleMidiFailure = e => console.warn("No access to MIDI devices or your browser doesn't support WebMIDI API.", e)

const handleDeviceUpdates = () => {
	if (!midi) return init()

	const devices = []
	const inputs = midi.inputs.values()
	for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
		const device = input.value
		device.onmidimessage = message => handleMidiMessage(message, device)

		const deviceObj = { disconnected: false }
		for (let key in device) {
			if (typeof device[key] == 'string') deviceObj[key] = device[key]
		}
		devices.push(deviceObj)
	}

	const oldDevices = store.getState().devices
	const unpluggedDeviceIds = _difference(oldDevices.map(({ id }) => id), devices.map(({ id }) => id))
	for (let deviceId of unpluggedDeviceIds) {
		const usedByInstrument = isDeviceUsedByInstrument(deviceId)
		console.log(`Device unplugged: ${deviceId} (${usedByInstrument ? 'was' : 'was not'} used by instrument)`)
		devices.push({ ..._find(oldDevices, { id: deviceId }), disconnected: true })
	}

	store.dispatch(updateDevices(devices))
}

const handleMidiMessage = (message, device) => {
	const { data, target } = message
	const command = data[0] >> 4
	const channel = data[0] & 0xf
	let type = data[0] & 0xf0

	const note = data[1]
	const velocity = data[2]

	if (type == NOTE_ON && velocity === 0) type = NOTE_OFF

	switch (type) {
		case NOTE_ON:
			triggerNoteDownListeners(target.id, channel, note, velocity)
			store.dispatch({ type: NOTE_ON, deviceId: target.id, channel, note, velocity })
			break
		case NOTE_OFF:
			triggerNoteUpListeners(target.id, channel, note, velocity)
			store.dispatch({ type: NOTE_OFF, deviceId: target.id, channel, note, velocity })
			break
	}
}

const triggerNoteDownListeners = (deviceId, channel, note, velocity) =>
	noteDownListeners.forEach(listener => listener(deviceId, channel, note, velocity))
const triggerNoteUpListeners = (deviceId, channel, note, velocity) =>
	noteUpListeners.forEach(listener => listener(deviceId, channel, note, velocity))
