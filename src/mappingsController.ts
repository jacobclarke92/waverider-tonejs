import { Store } from 'redux'
import _set from 'lodash/set'
import { ReduxStoreType, MappingType, ThunkDispatchType, AnyParamType } from './types'

import { scale } from './utils/mathUtils'
import { addControlChangeListener } from './api/midi'
import { addMapping } from './reducers/mappings'
import { updateEffect } from './reducers/effects'
import { updateInstrument } from './reducers/instruments'
import instrumentLibrary from './instrumentLibrary'
import effectLibrary from './effectLibrary'

let store: Store = null

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
			;(store.dispatch as ThunkDispatchType)(
				updateInstrument(mapping.ownerId, { instrument: _set({}, mapping.paramPath, mappedValue) })
			)
		} else if (mapping.type == 'effect') {
			;(store.dispatch as ThunkDispatchType)(
				updateEffect(mapping.ownerId, { effect: _set({}, mapping.paramPath, mappedValue) })
			)
		}
	}
}
