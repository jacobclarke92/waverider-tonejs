const NOTE_ON = 144
const NOTE_OFF = 128

let midi = null
let devices = []

let listeners = []
let noteDownListeners = []
let noteUpListeners = []

export const addListener = func => listeners.push(func)
export const addNoteDownListener = func => noteDownListeners.push(func)
export const addNoteUpListener = func => noteUpListeners.push(func)
export const removeListener = func => listeners = listeners.filter(listener => listener != func)
export const removeNoteDownListener = func => noteDownListeners = noteDownListeners.filter(listener => listener != func)
export const removeNoteUpListener = func => noteUpListeners = noteUpListeners.filter(listener => listener != func)

export function init() {
	if (navigator.requestMIDIAccess) {
	    navigator.requestMIDIAccess({sysex: false}).then(handleMidiSuccess, handleMidiFailure)
	} else {
	    console.warn('No MIDI support in your browser.')
	}
}

const handleMidiSuccess = midiAccess => {
    midi = midiAccess
    midi.onstatechange = ({port}) => updateDevices()
    updateDevices()
}

const handleMidiFailure = e => console.warn('No access to MIDI devices or your browser doesn\'t support WebMIDI API.', e)

const updateDevices = () => {
	if(!midi) return init()
	
	devices = []
	const inputs = midi.inputs.values()
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    	devices.push(input.value)
    	input.value.onmidimessage = handleMidiMessage
    }
}

const handleMidiMessage = ({data}) => {
	const command = data[0] >> 4
	const channel = data[0] & 0xf
	let type = data[0] & 0xf0

	const note = data[1]
	const velocity = data[2]

	if(type == NOTE_ON && velocity === 0) type = NOTE_OFF

	switch(type) {
		case NOTE_ON: triggerNoteDownListeners(channel, note, velocity); break
		case NOTE_OFF: triggerNoteUpListeners(channel, note, velocity); break
	}
}

const triggerNoteDownListeners = (channel, note, velocity) => noteDownListeners.forEach(listener => listener(channel, note, velocity))
const triggerNoteUpListeners = (channel, note, velocity) => noteUpListeners.forEach(listener => listener(channel, note, velocity))