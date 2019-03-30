import { Store } from 'redux'
import { ReduxStoreType, Sequencer } from './types'
import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'

import sequencerLibrary from './sequencerLibrary'
import BaseSequencer from './sequencers/BaseSequencer'
import {
	RELOAD_SEQUENCERS,
	LOAD_SEQUENCERS,
	UPDATE_SEQUENCER,
	ADD_SEQUENCER,
	REMOVE_SEQUENCER,
	State as SequencersStore,
	ActionObj as SequencersActionObj,
} from './reducers/sequencers'

let store: Store = null
let oldSequencers: SequencersStore = []

const instances: { [k: number]: BaseSequencer } = {}

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
}

export function getSequencerInstance(id: number): BaseSequencer | false {
	if (id in instances) return instances[id]
	return false
}

function handleUpdate() {
	const { lastAction, sequencers } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
		case RELOAD_SEQUENCERS:
			sequencers.forEach(sequencer => removeSequencerInstance(sequencer.id))
		case LOAD_SEQUENCERS:
			initSequencers(sequencers)
			break
		case UPDATE_SEQUENCER:
			updateSequencer((lastAction as SequencersActionObj).id, sequencers)
			break
		case ADD_SEQUENCER:
			initSequencer((lastAction as SequencersActionObj).sequencer)
			break
		case REMOVE_SEQUENCER:
			removeSequencerInstance((lastAction as SequencersActionObj).id)
			break
	}
	oldSequencers = _cloneDeep(sequencers)
}

function initSequencers(sequencers: SequencersStore) {
	console.log('Initing sequencers', sequencers)
	sequencers.forEach(sequencer => initSequencer(sequencer))
}

function initSequencer(sequencer: Sequencer) {
	const sequencerConstructor = sequencerLibrary[sequencer.type]
	const Sequencer = sequencerConstructor.Sequencer
	instances[sequencer.id] = new Sequencer(sequencer, store.dispatch)
}

function updateSequencer(id: number, sequencers: SequencersStore) {
	if (!id) return
	const sequencer = _find(sequencers, { id })
	const oldSequencer = _find(oldSequencers, { id })
	if (!(id in instances)) initSequencer(sequencer)
	else instances[id].update(sequencer, oldSequencer)
}

function removeSequencerInstance(id: number) {
	if (!id) return
	if (id in instances) {
		// const source = instances[id].getToneSource()
		// if (source) source.dispose()
		delete instances[id]
	}
}
