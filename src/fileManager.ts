import { Store } from 'redux'
import { ReduxStoreType } from './types'
import { downloadData } from './utils/blobUtils'
import { updateProjectMeta } from './reducers/project'

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
