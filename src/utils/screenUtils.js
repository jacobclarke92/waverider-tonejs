import _debounce from 'lodash/debounce'
import { clamp } from './mathUtils'

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


export const getRect = elem => elem.getBoundingClientRect()
export const getMousePosition = e => ({
	x: !!e.touches ? e.touches[0].pageX : e.pageX, 
	y: !!e.touches ? e.touches[0].pageY : e.pageY,
})
export const getRelativeMousePosition = (e, elem, contain = true) => {
	const rect = getRect(elem)
	const mouse = getMousePosition(e)
	const position = {
		x: mouse.x - rect.left,
		y: mouse.y - rect.top,
	}
	position.percent = {
		x: position.x / rect.width,
		y: position.y / rect.height,
	}
	if(contain) {
		position.percent.x = clamp(position.percent.x, 0, 1)
		position.percent.y = clamp(position.percent.y, 0, 1)
	}
	return position
}