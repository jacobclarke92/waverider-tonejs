import { Transport, Time } from 'tone'

export const getCurrentSubdivisionIndex = (subdivisions: number, bars: number = 1) => {
	const barSeconds = (60 / Transport.bpm.value) * (Transport.timeSignature as number)
	const position = Transport.position
	// There's probably a better way to do this instead of regexing timecodes
	const relativeTransportPosition = position.replace(/\d+(:\d+:[\d\.]+)/, '0$1')
	const relativeSeconds = new Time(relativeTransportPosition).toSeconds()
	const currentSubdivisionInBar = Math.round((relativeSeconds / barSeconds) * subdivisions)
	const currentBar = parseInt(position.replace(/(\d+):\d+:[\d\.]+/, '$1')) % bars
	return {
		subdivision: currentSubdivisionInBar,
		bar: currentBar,
		subdivisonIndex: currentBar * subdivisions + currentSubdivisionInBar,
	}
}
