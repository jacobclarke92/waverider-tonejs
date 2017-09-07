import { noteStrings } from '../constants/noteStrings'

export const parseNoteToNumber = input => {
	if(typeof input == 'number') input = input.toString()
	input = input.toUpperCase().replace(' ', '')

	const regex = /([A-Z]){1}(#|B)?(\d){1,2}/g
	const matches = regex.exec(input)
	if(!matches) return false 
		
	const letter = matches[1]
	const intonation = (matches[2] || '').toLowerCase()
	const scale = parseInt(matches[3] || '4')

	const relativeNote = fixNote(letter+intonation)
	const noteIndex = noteStrings.indexOf(relativeNote)
	if(!relativeNote || noteIndex < 0) return false
	return 12*scale + noteIndex
}

const fixNote = note => {
	switch(note) {
		case 'Db': return 'C#'
		case 'Eb': return 'D#'
		case 'E#': return 'F'
		case 'Fb': return 'E'
		case 'Gb': return 'F#'
		case 'Ab': return 'G#'
		case 'Bb': return 'A#'
		case 'Cb': 
		case 'B#': return false
	}
	return note
}

export const noteNumberToName = number => noteStrings[number%12] + Math.floor(number/12)