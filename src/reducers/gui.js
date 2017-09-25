import { STAGE, DESK, MATRIX } from '../constants/uiViews'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'

export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_VIEW_UI_STATE = 'UPDATE_VIEW_UI_STATE'
export const UPDATE_ACTIVE_ELEMENT = 'UPDATE_ACTIVE_ELEMENT'
export const CLEAR_ACTIVE_ELEMENT = 'CLEAR_ACTIVE_ELEMENT'

const initialState = {
	view: DESK,
	viewStates: {
		[STAGE]: {
			snapping: false,
			showGuides: true,
		},
		[DESK]: {
			snapping: true,
		},
		[MATRIX]: {

		},
	},
	activeElement: null,
};

export default function (state = initialState, action) {
	switch(action.type) {
		case UPDATE_VIEW: return {...state, view: action.view}
		case UPDATE_VIEW_UI_STATE: 
			const newViewState = _merge(_cloneDeep(state.viewStates[action.view]), action.updates)
			return _merge(state, {viewState: {[action.view]: newViewState}})
		case CLEAR_ACTIVE_ELEMENT: return {...statee, activeElement: null}
		case UPDATE_ACTIVE_ELEMENT: return {...state, activeElement: {type: action.deskItemType, element: action.element}}
	}
	return state
}

export const updateView = view => ({type: UPDATE_VIEW, view})
export const updateViewUiState = (view, updates = {}) => ({type: UPDATE_VIEW_UI_STATE, view, updates})

export const updateActiveElement = (deskItemType, element)  => ({type: UPDATE_ACTIVE_ELEMENT, deskItemType, element})