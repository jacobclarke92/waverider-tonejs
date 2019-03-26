import { STAGE, DESK, MATRIX } from '../constants/uiViews'
import _merge from 'lodash/merge'
import _cloneDeep from 'lodash/cloneDeep'
import { Action } from 'redux'
import { UiView, DeskItem, DeskItemType, KeyedObject, MappingType } from '../types'

export const UPDATE_VIEW = 'UPDATE_VIEW'
export const UPDATE_VIEW_UI_STATE = 'UPDATE_VIEW_UI_STATE'
export const UPDATE_ACTIVE_ELEMENT = 'UPDATE_ACTIVE_ELEMENT'
export const UPDATE_ACTIVE_CONTROL = 'UPDATE_ACTIVE_CONTROL'
export const CLEAR_ACTIVE_ELEMENT = 'CLEAR_ACTIVE_ELEMENT'
export const TOGGLE_KEYBOARD_PIANO = 'TOGGLE_KEYBOARD_PIANO'
export const TOGGLE_MIDI_MAPPING = 'TOGGLE_MIDI_MAPPING'

export interface ViewState {
	snapping?: boolean
	showGuides?: boolean
}

export type State = {
	view: UiView
	keyboardPianoEnabled: boolean
	midiMappingEnabled: boolean
	viewStates: { [key: string]: ViewState }
	activeElement: null | ActiveElement
	activeControl: null | MappingType
}

export type ActiveElement = {
	type: DeskItem
	element: DeskItemType
}

interface ReducerAction extends Action {
	view?: UiView
	updates?: KeyedObject
	element?: DeskItemType
	control?: MappingType
	deskItemType: DeskItem
}

const initialState: State = {
	view: DESK,
	activeElement: null,
	activeControl: null,
	keyboardPianoEnabled: true,
	midiMappingEnabled: false,
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
		case UPDATE_ACTIVE_CONTROL:
			return { ...state, activeControl: action.control }
		case TOGGLE_KEYBOARD_PIANO:
			return { ...state, keyboardPianoEnabled: !state.keyboardPianoEnabled }
		case TOGGLE_MIDI_MAPPING:
			return {
				...state,
				midiMappingEnabled: !state.midiMappingEnabled,
				activeControl: state.midiMappingEnabled ? null : state.activeControl,
			}
	}
	return state
}

export const updateView = (view: UiView) => ({ type: UPDATE_VIEW, view } as ReducerAction)
export const updateViewUiState = (view: UiView, updates: KeyedObject = {}) =>
	({ type: UPDATE_VIEW_UI_STATE, view, updates } as ReducerAction)

export const updateActiveElement = (deskItemType: DeskItem, element: DeskItemType) =>
	({ type: UPDATE_ACTIVE_ELEMENT, deskItemType, element } as ReducerAction)

export const updateActiveControl = (control: MappingType) => ({ type: UPDATE_ACTIVE_CONTROL, control } as ReducerAction)

export const toggleKeyboardPiano = () => ({ type: TOGGLE_KEYBOARD_PIANO } as Action)

export const toggleMidiMapping = () => ({ type: TOGGLE_MIDI_MAPPING } as Action)
