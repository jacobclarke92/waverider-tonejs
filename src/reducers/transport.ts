import { Encoding } from 'tone'
import { Action } from 'redux'
import { KeyedObject, TimeSignature } from '../types'

export const TRANSPORT_PLAY: string = 'TRANSPORT_PLAY'
export const TRANSPORT_PAUSE: string = 'TRANSPORT_PAUSE'
export const TRANSPORT_STOP: string = 'TRANSPORT_STOP'
export const TRANSPORT_SEEK: string = 'TRANSPORT_SEEK'
export const TRANSPORT_UPDATE_BPM: string = 'TRANSPORT_UPDATE_BPM'
export const TRANSPORT_UPDATE_TIME_SIGNATURE: string = 'TRANSPORT_UPDATE_TIME_SIGNATURE'

interface ReducerAction extends Action {
	updates?: KeyedObject
	bpm?: number
	timeSignature?: TimeSignature
}

export type State = {
	playing: boolean
	bpm: number
	swing: number
	swingSubdivision: Encoding.Time
	timeSignature: TimeSignature
	pausedTime?: Encoding.Time
}

const initialState: State = {
	playing: false,
	bpm: 120,
	swing: 0,
	swingSubdivision: '8n',
	timeSignature: [4, 4],
}

export default function(state: State = initialState, action: ReducerAction) {
	switch (action.type) {
		case TRANSPORT_PAUSE:
		case TRANSPORT_STOP:
			return { ...state, playing: false }
		case TRANSPORT_PLAY:
			return { ...state, playing: true }
		case TRANSPORT_UPDATE_BPM:
			return { ...state, bpm: action.bpm }
		case TRANSPORT_UPDATE_TIME_SIGNATURE:
			return { ...state, timeSignature: action.timeSignature }
	}
	return state
}

export const transportPlay = () => ({ type: TRANSPORT_PLAY })
export const transportPause = () => ({ type: TRANSPORT_PAUSE })
export const transportStop = () => ({ type: TRANSPORT_STOP })
export const updateBpm = (bpm: number) => ({ type: TRANSPORT_UPDATE_BPM, bpm })
export const updateTimeSignature = (timeSignature: TimeSignature) => ({
	type: TRANSPORT_UPDATE_TIME_SIGNATURE,
	timeSignature,
})
