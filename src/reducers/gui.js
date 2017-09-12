import { STAGE, DESK, MATRIX } from '../constants/uiViews'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'

export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_VIEW_UI_STATE = 'UPDATE_VIEW_UI_STATE'

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
};

export default function (state = initialState, action) {
	switch(action.type) {
		case UPDATE_VIEW: return {...state, view: action.view}
		case UPDATE_VIEW_UI_STATE: 
			const newViewState = _merge(_cloneDeep(state.viewStates[action.view]), action.updates)
			return _merge(state, {viewState: {[action.view]: newViewState}})
	}
	return state
}

export const updateView = view => ({type: UPDATE_VIEW, view})
export const updateViewUiState = (view, updates = {}) => ({type: UPDATE_VIEW_UI_STATE, view, updates})