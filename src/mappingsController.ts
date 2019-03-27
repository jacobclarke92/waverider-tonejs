import { Store } from 'redux'
import _set from 'lodash/set'
import _throttle from 'lodash/throttle'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import { ReduxStoreType, MappingType, ThunkDispatchType, AnyParamType, KeyedObject } from './types'

import { scale } from './utils/mathUtils'
import { addControlChangeListener } from './api/midi'
import { addMapping } from './reducers/mappings'
import { updateEffect } from './reducers/effects'
import { updateInstrument } from './reducers/instruments'
import instrumentLibrary from './instrumentLibrary'
import effectLibrary from './effectLibrary'
import { ccMappingDebounce } from './constants/timings'

let store: Store = null

const effectUpdates: { [key: number]: KeyedObject } = {}
const instrumentUpdates: { [key: number]: KeyedObject } = {}

export function init(_store: Store) {
	store = _store
	store.subscribe(handleUpdate)
	addControlChangeListener(handleControlChange)
}

function handleUpdate() {
	const { lastAction } = store.getState() as ReduxStoreType
	switch (lastAction.type) {
	}
}

const throttledUpdateInstrument = _throttle((id: number) => {
	const updates = instrumentUpdates[id]
	if (updates) {
		;(store.dispatch as ThunkDispatchType)(updateInstrument(id, updates))
		delete instrumentUpdates[id]
	}
}, ccMappingDebounce)

const throttledUpdateEffect = _throttle((id: number) => {
	const updates = effectUpdates[id]
	if (updates) {
		;(store.dispatch as ThunkDispatchType)(updateEffect(id, updates))
		delete effectUpdates[id]
	}
}, ccMappingDebounce)

function handleControlChange(deviceId: string, channel: number, cc: number, value: number) {
	const { gui, mappings } = store.getState() as ReduxStoreType
	const { activeControl, midiMappingEnabled } = gui
	if (midiMappingEnabled && activeControl) {
		const mapping: MappingType = { ...activeControl, deviceId, channel, cc }

		// Attempt to find corresponding param from instrument/effect library
		let param: AnyParamType = null
		if (activeControl.type == 'instrument') {
			const instrument = instrumentLibrary[activeControl.ownerType]
			if (instrument && instrument.params)
				param = instrument.params.find(({ path }) => path === activeControl.paramPath)
		} else if (activeControl.type == 'effect') {
			const effect = effectLibrary[activeControl.ownerType]
			if (effect && effect.params) param = effect.params.find(({ path }) => path === activeControl.paramPath)
		}

		if (param) {
			console.log('found param', param)
			if ('min' in param && 'max' in param) {
				mapping.min = param.min
				mapping.max = param.max
				mapping.actualMin = param.min
				mapping.actualMax = param.max
				;(store.dispatch as ThunkDispatchType)(addMapping(mapping))
			} else {
				console.warn('Param not compatible -- missing min/max')
			}
		} else {
			console.warn(
				'Param not found',
				activeControl.type,
				activeControl.ownerType,
				activeControl.ownerId,
				activeControl.paramPath
			)
		}
	}
	const affectedMappings = mappings.filter(
		mapping => mapping.deviceId === deviceId && mapping.channel === channel && mapping.cc === cc
	)
	for (let mapping of affectedMappings) {
		const mappedValue = scale(value, 0, 127, mapping.min, mapping.max)
		if (mapping.type == 'instrument') {
			instrumentUpdates[mapping.ownerId] = _merge(_cloneDeep(instrumentUpdates[mapping.ownerId] || {}), {
				instrument: _set({}, mapping.paramPath, mappedValue),
			})
			throttledUpdateInstrument(mapping.ownerId)
		} else if (mapping.type == 'effect') {
			effectUpdates[mapping.ownerId] = _merge(_cloneDeep(effectUpdates[mapping.ownerId] || {}), {
				effect: _set({}, mapping.paramPath, mappedValue),
			})
			throttledUpdateEffect(mapping.ownerId)
		}
	}
}
