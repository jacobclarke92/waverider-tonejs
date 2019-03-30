import { Store } from 'redux'
import { ReduxStoreType } from './types'

import sequencerLibrary from './sequencerLibrary'

let store: Store = null

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
}

function handleUpdate() {
	const { lastAction, sequencers, desk } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
	}
}
