import _find from 'lodash/find'
import _difference from 'lodash/difference'
import { updateDevices, internalPiano } from '../reducers/devices'
import { isDeviceUsedByInstrument } from '../instrumentsController'
import { Device, ThunkDispatchType, ReduxStoreType } from '../types'
import { Store } from 'redux'

export const NOTE_ON: number = 144
export const NOTE_OFF: number = 128
export const CONTROL_CHANGE: number = 176
export const POLY_AFTERTOUCH = 160
export const PROGRAM_CHANGE = 192
export const PITCH_BEND = 224

export const deviceSchema = 'id,type,name,manufacturer,version,disconnected,sequencerId'

export type MidiListenerFunction = (deviceId: string, channel: number, note: number, velocity: number) => void
export type MidiMessageAction = {
	type: number
	deviceId: string
	channel: number
	note: number
	velocity: number
}

let midi: WebMidi.MIDIAccess

let listeners: MidiListenerFunction[] = []
let noteDownListeners: MidiListenerFunction[] = []
let noteUpListeners: MidiListenerFunction[] = []
let controlChangeListeners: MidiListenerFunction[] = []

let store: Store

export const addListener = (func: MidiListenerFunction) => listeners.push(func)
export const removeListener = (func: MidiListenerFunction) =>
	(listeners = listeners.filter(listener => listener != func))

export const addNoteDownListener = (func: MidiListenerFunction) => noteDownListeners.push(func)
export const removeNoteDownListener = (func: MidiListenerFunction) =>
	(noteDownListeners = noteDownListeners.filter(listener => listener != func))

export const addNoteUpListener = (func: MidiListenerFunction) => noteUpListeners.push(func)
export const removeNoteUpListener = (func: MidiListenerFunction) =>
	(noteUpListeners = noteUpListeners.filter(listener => listener != func))

export const addControlChangeListener = (func: MidiListenerFunction) => controlChangeListeners.push(func)
export const removeControlChangeListener = (func: MidiListenerFunction) =>
	(controlChangeListeners = controlChangeListeners.filter(listener => listener != func))

export function init(_store?: Store) {
	if (_store) store = _store
	if (navigator.requestMIDIAccess) {
		navigator.requestMIDIAccess({ sysex: false }).then(handleMidiSuccess, handleMidiFailure)
	} else {
		console.warn('No MIDI support in your browser.')
	}
}

const handleMidiSuccess = (midiAccess: WebMidi.MIDIAccess) => {
	midi = midiAccess
	midi.onstatechange = (e: WebMidi.MIDIConnectionEvent) => handleDeviceUpdates()
	handleDeviceUpdates()
}

const handleMidiFailure = (e: any) =>
	console.warn("No access to MIDI devices or your browser doesn't support WebMIDI API.", e)

const handleDeviceUpdates = () => {
	if (!midi) return init()
	const state = store.getState() as ReduxStoreType
	const oldDevices = state.devices
	const devices: Device[] = state.devices.filter(device => device.id === internalPiano.id || device.sequencerId)

	const inputs: IterableIterator<WebMidi.MIDIInput> = midi.inputs.values()
	for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
		const device: WebMidi.MIDIInput = input.value
		device.onmidimessage = (message: WebMidi.MIDIMessageEvent) => handleMidiMessage(message, device)

		const deviceObj = { disconnected: false }
		for (let key in device) {
			// i'm not sure what this achieving -- will need to revisit
			// @ts-ignore
			if (typeof device[key] == 'string') deviceObj[key] = device[key]
		}
		devices.push(deviceObj as Device)
	}

	const outputs: IterableIterator<WebMidi.MIDIOutput> = midi.outputs.values()
	for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
		const device: WebMidi.MIDIOutput = output.value
		const deviceObj = { disconnected: false }
		for (let key in device) {
			// i'm not sure what this achieving -- will need to revisit
			// @ts-ignore
			if (typeof device[key] == 'string') deviceObj[key] = device[key]
		}
		devices.push(deviceObj as Device)
	}

	const unpluggedDeviceIds: string[] = _difference(oldDevices.map(({ id }) => id), devices.map(({ id }) => id))
	for (let deviceId of unpluggedDeviceIds) {
		const usedByInstrument = isDeviceUsedByInstrument(deviceId)
		console.log(`Device unplugged: ${deviceId} (${usedByInstrument ? 'was' : 'was not'} used by instrument)`)
		const device = _find(oldDevices, { id: deviceId })
		if (device) devices.push({ ...device, disconnected: true })
	}
	;(store.dispatch as ThunkDispatchType)(updateDevices(devices))
}

const handleMidiMessage = (message: WebMidi.MIDIMessageEvent, device: WebMidi.MIDIInput) => {
	const { data, target } = message
	const command: number = data[0] >> 4
	const channel: number = data[0] & 0xf
	let type: number = data[0] & 0xf0

	const note: number = data[1]
	const velocity: number = data[2]

	if (type == NOTE_ON && velocity === 0) type = NOTE_OFF

	switch (type) {
		case NOTE_ON:
			triggerNoteDownListeners(device.id, channel, note, velocity)
			store.dispatch({ type: NOTE_ON, deviceId: device.id, channel, note, velocity } as MidiMessageAction)
			break
		case NOTE_OFF:
			triggerNoteUpListeners(device.id, channel, note, velocity)
			store.dispatch({ type: NOTE_OFF, deviceId: device.id, channel, note, velocity } as MidiMessageAction)
			break
		case CONTROL_CHANGE:
			triggerControlChangeListeners(device.id, channel, note, velocity)
			break
	}
}

const triggerNoteDownListeners = (deviceId: string, channel: number, note: number, velocity: number) =>
	noteDownListeners.forEach(listener => listener(deviceId, channel, note, velocity))
const triggerNoteUpListeners = (deviceId: string, channel: number, note: number, velocity: number) =>
	noteUpListeners.forEach(listener => listener(deviceId, channel, note, velocity))
const triggerControlChangeListeners = (deviceId: string, channel: number, cc: number, value: number) =>
	controlChangeListeners.forEach(listener => listener(deviceId, channel, cc, value))
