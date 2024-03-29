import keycode from 'keycode'

let shiftKeyPressed: boolean = false
let ctrlKeyPressed: boolean = false
let altKeyPressed: boolean = false
let leftKeyPressed: boolean = false
let rightKeyPressed: boolean = false
let upKeyPressed: boolean = false
let downKeyPressed: boolean = false
let leftCommandKeyPressed: boolean = false
let rightCommandKeyPressed: boolean = false

export const isShiftKeyPressed = () => shiftKeyPressed
export const isCtrlKeyPressed = () => ctrlKeyPressed
export const isAltKeyPressed = () => altKeyPressed
export const isCommandKeyPressed = () => leftCommandKeyPressed || rightCommandKeyPressed
export const isLeftKeyPressed = () => leftKeyPressed
export const isRightKeyPressed = () => rightKeyPressed
export const isUpKeyPressed = () => upKeyPressed
export const isDownKeyPressed = () => downKeyPressed

type CallbackListenerObj = { [key: string]: Function[] }

const keyCallbacks: CallbackListenerObj = {}
const keyUpCallbacks: CallbackListenerObj = {}

function handleKeyDown(event: Event) {
	const inputIsFocused = isInputFocused()
	const key = keycode(event)
	switch (key) {
		case 'shift':
			shiftKeyPressed = true
			break
		case 'ctrl':
			ctrlKeyPressed = true
			break
		case 'alt':
			altKeyPressed = true
			break
		case 'left command':
			leftCommandKeyPressed = true
			break
		case 'right command':
			rightCommandKeyPressed = true
			break
	}
	if (key == 'up') upKeyPressed = true
	if (key == 'down') downKeyPressed = true
	if (key == 'left') leftKeyPressed = true
	if (key == 'right') rightKeyPressed = true

	for (let checkKey of Object.keys(keyCallbacks)) {
		if (checkKey == key) {
			for (let callback of keyCallbacks[checkKey]) {
				callback(event, inputIsFocused)
			}
		}
	}
}

function handleKeyUp(event) {
	const inputIsFocused = isInputFocused()
	const key = keycode(event)
	switch (key) {
		case 'shift':
			shiftKeyPressed = false
			break
		case 'ctrl':
			ctrlKeyPressed = false
			break
		case 'alt':
			altKeyPressed = false
			break
		case 'left command':
			leftCommandKeyPressed = false
			break
		case 'right command':
			rightCommandKeyPressed = false
			break
	}
	if (key == 'up') upKeyPressed = false
	if (key == 'down') downKeyPressed = false
	if (key == 'left') leftKeyPressed = false
	if (key == 'right') rightKeyPressed = false

	for (let checkKey of Object.keys(keyUpCallbacks)) {
		if (checkKey == key) {
			for (let callback of keyUpCallbacks[checkKey]) {
				callback(event, inputIsFocused)
			}
		}
	}
}

export function init(element: HTMLElement | Document = document) {
	element.addEventListener('keydown', handleKeyDown)
	element.addEventListener('keyup', handleKeyUp)
}

export function addKeyListener(keyCode: string, func: Function) {
	if (Object.keys(keyCallbacks).indexOf(keyCode) < 0) keyCallbacks[keyCode] = []
	keyCallbacks[keyCode].push(func)
}

export function removeKeyListener(keyCode: string, func: Function) {
	if (Object.keys(keyCallbacks).indexOf(keyCode) >= 0) {
		for (let i = 0; i < keyCallbacks[keyCode].length; i++) {
			if (keyCallbacks[keyCode][i] == func) keyCallbacks[keyCode].splice(i, 1)
		}
	}
}

export const addKeyDownListener = addKeyListener
export const removeKeyDownListener = removeKeyListener

export function addKeyUpListener(keyCode: string, func: Function) {
	if (Object.keys(keyUpCallbacks).indexOf(keyCode) < 0) keyUpCallbacks[keyCode] = []
	keyUpCallbacks[keyCode].push(func)
}

export function removeKeyUpListener(keyCode: string, func: Function) {
	if (Object.keys(keyUpCallbacks).indexOf(keyCode) >= 0) {
		for (let i = 0; i < keyUpCallbacks[keyCode].length; i++) {
			if (keyUpCallbacks[keyCode][i] == func) keyUpCallbacks[keyCode].splice(i, 1)
		}
	}
}

export function isInputFocused() {
	return document.activeElement && ['INPUT', 'TEXTAREA'].indexOf(document.activeElement.tagName) >= 0
}
