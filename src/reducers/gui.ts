import { STAGE, DESK, MATRIX } from '../constants/uiViews'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import { Action } from 'redux';
import { UiViewType, DeskItemType } from '../types';

export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_VIEW_UI_STATE = 'UPDATE_VIEW_UI_STATE'
export const UPDATE_ACTIVE_ELEMENT = 'UPDATE_ACTIVE_ELEMENT'
export const CLEAR_ACTIVE_ELEMENT = 'CLEAR_ACTIVE_ELEMENT'

export interface ViewState {
	snapping?: boolean
	showGuides?: boolean
}

export type State = {
	view: UiViewType,
	viewStates: {[key: string]: ViewState},
	activeElement: null | ActiveElement,
}

export type ActiveElement = {
	type: DeskItemType,
	element: null | HTMLElement,
}

interface ReducerAction extends Action {
	view?: UiViewType
	updates?: any // TODO
	element?: HTMLElement
	deskItemType: DeskItemType
}

const initialState:State = {
	view: DESK,
	activeElement: null,
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

export default function(state:State = initialState, action:ReducerAction) {
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
	}
	return state
}

export const updateView = view => ({ type: UPDATE_VIEW, view } as ReducerAction)
export const updateViewUiState = (view, updates = {}) => ({ type: UPDATE_VIEW_UI_STATE, view, updates } as ReducerAction)

export const updateActiveElement = (deskItemType, element) => ({ type: UPDATE_ACTIVE_ELEMENT, deskItemType, element } as ReducerAction)
