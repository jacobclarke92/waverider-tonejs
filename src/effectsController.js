import _cloneDeep from 'lodash/cloneDeep'
import effectLibrary from './effectLibrary'
import { LOAD_EFFECTS, ADD_EFFECT, REMOVE_EFFECT, UPDATE_EFFECT } from './reducers/effects'

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
		case LOAD_EFFECTS: initEffects(effects); break
		case UPDATE_EFFECT: updateEffect(lastAction, effects); break
		case ADD_EFFECT: initEffect(lastAction.effect); break
		case REMOVE_EFFECT: removeEffect(lastAction.id); break
	}
	oldEffects = _cloneDeep(effects)
}

function initEffects(effects) {
	console.log('Initing effects', effects)
	effects.forEach(effect => initEffect(effect))
}

function initEffect(effect) {
	const Effect = effectLibrary[effect.type].Effect
	instances[effect.id] = new Effect(effect, store.dispatch)
}

function updateEffect({id}, effects) {
	const effect = _find(effects, {id})
	const oldEffect = _find(oldEffects, {id})
	if(!(id in instances)) initEffect(effect)
	else instances[id].update(effect, oldEffect)
}

function removeEffect(id) {
	if(id in instances) {
		const source = instances[id].getToneSource()
		if(source) source.dispose()
		delete instances[id]
	}
}