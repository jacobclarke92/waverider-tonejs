import { Action } from 'redux'

export const UPDATE_PROJECT_META: string = 'UPDATE_PROJECT_META'

export interface State {
	title?: string
	created?: string
	modified?: string
}

const initialState: State = {}

type UpdateDataType = { [k: string]: string }

export interface ActionObj extends Action {
	updates: UpdateDataType
}

export default function(state: State = initialState, action: ActionObj) {
	switch (action.type) {
		case UPDATE_PROJECT_META:
			return { ...state, ...action.updates }
	}
	return state
}

export const updateProjectMeta = (updates: UpdateDataType) => ({ type: UPDATE_PROJECT_META, updates })
