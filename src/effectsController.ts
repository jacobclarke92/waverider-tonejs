import _find from 'lodash/find'
import _cloneDeep from 'lodash/cloneDeep'
import effectLibrary from './effectLibrary'
import {
	LOAD_EFFECTS,
	ADD_EFFECT,
	REMOVE_EFFECT,
	UPDATE_EFFECT,
	State as EffectsStore,
	ActionObj as EffectsActionObj,
} from './reducers/effects'
import { Store } from 'redux'
import BaseEffect from './effects/BaseEffect'
import { ReduxStoreType, Effect } from './types'

let store: Store = null
let oldEffects: EffectsStore = []

const instances: { [k: number]: BaseEffect } = {}

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
}

export function getEffectInstance(id: number): BaseEffect | false {
	if (id in instances) return instances[id]
	return false
}

function handleUpdate() {
	const { lastAction, effects } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
		case LOAD_EFFECTS:
			initEffects(effects)
			break
		case UPDATE_EFFECT:
			updateEffect((lastAction as EffectsActionObj).id, effects)
			break
		case ADD_EFFECT:
			initEffect((lastAction as EffectsActionObj).effect)
			break
		case REMOVE_EFFECT:
			removeEffect((lastAction as EffectsActionObj).id)
			break
	}
	oldEffects = _cloneDeep(effects)
}

function initEffects(effects: EffectsStore) {
	console.log('Initing effects', effects)
	effects.forEach(effect => initEffect(effect))
}

function initEffect(effect: Effect) {
	const Effect = effectLibrary[effect.type].Effect
	instances[effect.id] = new Effect(effect, store.dispatch)
}

function updateEffect(id: number, effects: EffectsStore) {
	if (!id) return
	const effect = _find(effects, { id })
	const oldEffect = _find(oldEffects, { id })
	if (!(id in instances)) initEffect(effect)
	else instances[id].update(effect, oldEffect)
}

function removeEffect(id: number) {
	if (!id) return
	if (id in instances) {
		const source = instances[id].getToneSource()
		if (source) source.dispose()
		delete instances[id]
	}
}
