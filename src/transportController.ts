import { Transport, State } from 'tone'
import { ReduxStoreType } from './types'
import { Store } from 'redux'
import { TRANSPORT_PAUSE, TRANSPORT_PLAY, TRANSPORT_STOP, TRANSPORT_SEEK } from './reducers/transport'

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
			Transport.pause('now')
			break
		case TRANSPORT_PLAY:
			Transport.start()
			break
		case TRANSPORT_STOP:
			Transport.stop()
			break
	}
}
