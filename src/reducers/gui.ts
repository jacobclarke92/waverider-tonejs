import { STAGE, DESK, MATRIX } from '../constants/uiViews'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import { Action } from 'redux'
import { UiView, DeskItem, DeskItemType, GenericProps } from '../types'

export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_VIEW_UI_STATE = 'UPDATE_VIEW_UI_STATE'
export const UPDATE_ACTIVE_ELEMENT = 'UPDATE_ACTIVE_ELEMENT'
export const CLEAR_ACTIVE_ELEMENT = 'CLEAR_ACTIVE_ELEMENT'
export const TOGGLE_KEYBOARD_PIANO = 'TOGGLE_KEYBOARD_PIANO'

export interface ViewState {
	snapping?: boolean
	showGuides?: boolean
}

export type State = {
	view: UiView
	keyboardPianoEnabled: boolean
	viewStates: { [key: string]: ViewState }
	activeElement: null | ActiveElement
}

export type ActiveElement = {
	type: DeskItem
	element: DeskItemType
}

interface ReducerAction extends Action {
	view?: UiView
	updates?: any // TODO
	element?: DeskItemType
	deskItemType: DeskItem
}

const initialState: State = {
	view: DESK,
	activeElement: null,
	keyboardPianoEnabled: true,
	viewStates: {
		[STAGE]: {
			snapping: false,
			showGuides: true,
		},
		[DESK]: {
			snapping: true,
		},
		[MATRIX]: {},
	},
}

export default function(state: State = initialState, action: ReducerAction) {
	switch (action.type) {
		case UPDATE_VIEW:
			return { ...state, view: action.view }
		case UPDATE_VIEW_UI_STATE:
			const newViewState = _merge(_cloneDeep(state.viewStates[action.view]), action.updates)
			return _merge(state, { viewState: { [action.view]: newViewState } })
		case CLEAR_ACTIVE_ELEMENT:
			return { ...state, activeElement: null }
		case UPDATE_ACTIVE_ELEMENT:
			return { ...state, activeElement: { type: action.deskItemType, element: action.element } }
		case TOGGLE_KEYBOARD_PIANO:
			return { ...state, keyboardPianoEnabled: !state.keyboardPianoEnabled }
	}
	return state
}

export const updateView = (view: UiView) => ({ type: UPDATE_VIEW, view } as ReducerAction)
export const updateViewUiState = (view: UiView, updates: GenericProps = {}) =>
	({ type: UPDATE_VIEW_UI_STATE, view, updates } as ReducerAction)

export const updateActiveElement = (deskItemType: DeskItem, element: DeskItemType) =>
	({ type: UPDATE_ACTIVE_ELEMENT, deskItemType, element } as ReducerAction)

export const toggleKeyboardPiano = () => ({ type: TOGGLE_KEYBOARD_PIANO })
