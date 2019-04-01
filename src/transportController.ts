import { Transport, State } from 'tone'
import { ReduxStoreType } from './types'
import { Store } from 'redux'
import {
	TRANSPORT_PAUSE,
	TRANSPORT_PLAY,
	TRANSPORT_STOP,
	TRANSPORT_SEEK,
	TRANSPORT_UPDATE_BPM,
} from './reducers/transport'

let store: Store = null

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
	// Transport.on('start/stop/pause', () => {})
}

function handleUpdate() {
	const { lastAction, transport } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
		case TRANSPORT_PAUSE:
			// this doesn't seem to work, not sure why
			Transport.pause('now')
			break
		case TRANSPORT_PLAY:
			console.log('▶️ playing transport')
			Transport.start()
			break
		case TRANSPORT_STOP:
			console.log('⏸ stopping transport')
			Transport.stop()
			break
		case TRANSPORT_UPDATE_BPM:
			Transport.bpm.value = lastAction.bpm
			// Transport.bpm.rampTo(lastAction.bpm, '4n')
			break
	}
}
