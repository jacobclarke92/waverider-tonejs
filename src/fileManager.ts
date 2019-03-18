import { Store } from 'redux'
import { ReduxStoreType, ThunkDispatchType } from './types'
import { downloadData } from './utils/blobUtils'
import { updateProjectMeta } from './reducers/project'
import { overwriteInstruments } from './reducers/instruments'
import { overwriteEffects } from './reducers/effects'
import { overwriteDesk } from './reducers/desk'

let store: Store = null

export function init(_store: Store) {
	store = _store
}

export function saveProjectFile() {
	const { project, desk, devices, effects, instruments } = store.getState() as ReduxStoreType
	if (!project.title) {
		const title = prompt('Please name your project', 'Untitled')
		if (!title) return
		store.dispatch(updateProjectMeta({ title }))
		setTimeout(saveProjectFile, 100)
		return
	}
	const state = { project, desk, devices, effects, instruments }
	const data = JSON.stringify(state, null, 2)
	downloadData(data, 'text/json', `${project.title || 'project'}.json`)
}

export function loadProjectFile(file: string) {
	let data: ReduxStoreType = null
	try {
		data = JSON.parse(file) as ReduxStoreType
	} catch (error) {
		console.warn('Unable to load file', error)
		return false
	}
	if (!data) return false
	if (data.instruments) (store.dispatch as ThunkDispatchType)(overwriteInstruments(data.instruments))
	if (data.effects) (store.dispatch as ThunkDispatchType)(overwriteEffects(data.effects))
	if (data.desk) (store.dispatch as ThunkDispatchType)(overwriteDesk(data.desk))
}
