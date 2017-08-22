const NOTE_ON = 144
const NOTE_OFF = 128

let midi = null
let listeners = []

export function init() {
	if (navigator.requestMIDIAccess) {
	    navigator.requestMIDIAccess({sysex: false}).then(handleMidiSuccess, handleMidiFailure)
	} else {
	    console.warn('No MIDI support in your browser.')
	}
}

export const addListener = func => listeners.push(func)
export const removeListener = func => listeners = listeners.filter(listener => listener != func)

const handleMidiSuccess = midiAccess => {
    midi = midiAccess

    const inputs = midi.inputs.values()
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    	input.value.onmidimessage = handleMidiMessage
    }
}

const handleMidiFailure = e => console.warn('No access to MIDI devices or your browser doesn\'t support WebMIDI API.', e)

const handleMidiMessage = ({data}) => {
	const command = data[0] >> 4
	const channel = data[0] & 0xf
	let type = data[0] & 0xf0

	const note = data[1]
	const velocity = data[2]

	if(type == NOTE_ON && velocity === 0) type = NOTE_OFF

	switch(type) {
		case NOTE_ON: console.log('Note on'); break
		case NOTE_OFF: console.log('Note off'); break
	}
}