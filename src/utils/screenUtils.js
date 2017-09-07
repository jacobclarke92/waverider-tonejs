import _debounce from 'lodash/debounce'

let debounce = 100 //ms

const resizeCallbacks = []

export const getWindowWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
export const getWindowHeight = () => Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
export const getPixelDensity = () => window.devicePixelRatio || 1
export const setDebounce = db => debounce = db

let screenWidth = getWindowWidth()
let screenHeight = getWindowHeight()


document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock
export const hasPointerLock = () => ('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document)
export const exitPointerLock = () => document.exitPointerLock()
export function requestPointerLock(element) {
	if(!element) return
	element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
	element.requestPointerLock()
}

export const addResizeCallback = func => resizeCallbacks.push(func)
export const triggerResize = () => _resizeCallback()
export function removeResizeCallback(func) {
	const index = resizeCallbacks.indexOf(func)
	if(index >= 0) resizeCallbacks.splice(index, 1)
}
function _resizeCallback() {
	screenWidth = getWindowWidth()
	screenHeight = getWindowHeight()
	for(let callback of resizeCallbacks) {
		callback(screenWidth, screenHeight)
	}
}

const resizeCallback = _debounce(_resizeCallback, 100)
window.addEventListener('resize', resizeCallback)