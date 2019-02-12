import _debounce from 'lodash/debounce'
import { clamp } from './mathUtils'
import { isNumber } from './typeUtils'
import { PointObj } from './Point'

export type ResizeCallbackFunc = (screenWidth: number, screenHeight: number) => void

let debounce: number = 100 //ms

const resizeCallbacks: ResizeCallbackFunc[] = []

export const getWindowWidth = (): number => Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
export const getWindowHeight = (): number => Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
export const getPixelDensity = (): number => window.devicePixelRatio || 1
export const setDebounce = (db: number) => (debounce = db)

let screenWidth: number = getWindowWidth()
let screenHeight: number = getWindowHeight()

// @ts-ignore
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock

export const hasPointerLock = (): boolean =>
	'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
export const exitPointerLock = () => document.exitPointerLock()
export const requestPointerLock = (element: HTMLElement) => {
	if (!element) return
	element.requestPointerLock =
		// @ts-ignore
		element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock
	element.requestPointerLock()
}

export const addResizeCallback = (func: ResizeCallbackFunc) => resizeCallbacks.push(func)
export const triggerResize = () => _resizeCallback()
export const removeResizeCallback = (func: ResizeCallbackFunc) => {
	const index = resizeCallbacks.indexOf(func)
	if (index >= 0) resizeCallbacks.splice(index, 1)
}
function _resizeCallback() {
	screenWidth = getWindowWidth()
	screenHeight = getWindowHeight()
	for (let callback of resizeCallbacks) {
		callback(screenWidth, screenHeight)
	}
}

const resizeCallback = _debounce(_resizeCallback, 100)
window.addEventListener('resize', resizeCallback)

export const getRect = (elem: HTMLElement): ClientRect | DOMRect => elem.getBoundingClientRect()

export const getPositionWithinElem = (
	child: HTMLElement,
	parent: HTMLElement,
	childOrigin: PointObj | number = { x: 0, y: 0 },
	parentOrigin: PointObj | number = { x: 0, y: 0 }
): PointObj => {
	if (isNumber(childOrigin)) childOrigin = { x: childOrigin, y: childOrigin } as PointObj
	if (isNumber(parentOrigin)) parentOrigin = { x: parentOrigin, y: parentOrigin } as PointObj
	const childRect = getRect(child)
	const parentRect = getRect(parent)
	return {
		x:
			childRect.left +
			childRect.width * (childOrigin as PointObj).x -
			(parentRect.left + parentRect.width * (parentOrigin as PointObj).x),
		y:
			childRect.top +
			childRect.height * (childOrigin as PointObj).y -
			(parentRect.top + parentRect.height * (parentOrigin as PointObj).y),
	}
}

export const getMousePosition = (e: any): PointObj => ({
	x: !!e.touches ? e.touches[0].pageX : e.pageX,
	y: !!e.touches ? e.touches[0].pageY : e.pageY,
})

export const getRelativeMousePosition = (e: any, elem: HTMLElement, contain: boolean = true): PointObj => {
	const rect = getRect(elem)
	const mouse = getMousePosition(e)
	const position = {
		x: mouse.x - rect.left,
		y: mouse.y - rect.top,
		percent: { x: 0, y: 0 },
	}
	position.percent = {
		x: position.x / rect.width,
		y: position.y / rect.height,
	}
	if (contain) {
		position.percent.x = clamp(position.percent.x, 0, 1)
		position.percent.y = clamp(position.percent.y, 0, 1)
	}
	return position
}
