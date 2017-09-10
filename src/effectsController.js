import _cloneDeep from 'lodash/cloneDeep'

let store = null
let oldEffects = []

const instances = {}

export function init(_store) {
	store = _store
	store.subscribe(handleUpdate)
}

export function getEffectInstance(id) {
	if(id in instances) return instances[id]
	return false
}

function handleUpdate() {
	const { lastAction, effects } = store.getState()
	switch(lastAction.type) {

	}
	oldEffects = _cloneDeep(effects)
}