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

document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock

export const hasPointerLock = (): boolean =>
	'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document
export const exitPointerLock = () => document.exitPointerLock()
export const requestPointerLock = (element: HTMLElement) => {
	if (!element) return
	element.requestPointerLock =
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

export const getRect = <ElemType>(elem: ElemType): ClientRect | DOMRect => {
	if (elem instanceof HTMLElement) return elem.getBoundingClientRect()
}

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

export const getMousePosition = <ElemType>(
	e: React.MouseEvent<ElemType, MouseEvent> | React.TouchEvent<ElemType>
): PointObj => {
	if (e.nativeEvent instanceof TouchEvent)
		return { x: e.nativeEvent.touches[0].pageX, y: e.nativeEvent.touches[0].pageY }
	return { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY }
}

export const getNativeMousePosition = (e: MouseEvent | TouchEvent) => {
	if (e instanceof TouchEvent) return { x: e.touches[0].pageX, y: e.touches[0].pageY }
	return { x: e.pageX, y: e.pageY }
}

export interface MousePosition extends PointObj {
	percent: PointObj
}

export const getRelativeMousePosition = <EventElemType, ElemType>(
	e: React.MouseEvent<EventElemType, MouseEvent> | React.TouchEvent<EventElemType>,
	elem: ElemType,
	contain: boolean = true
): MousePosition => {
	const rect = getRect<ElemType>(elem)
	const mouse = getMousePosition<EventElemType>(e)
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

export const getRelativeMousePositionNative = <ElemType>(
	e: MouseEvent | TouchEvent,
	elem: ElemType,
	contain: boolean = true
): MousePosition => {
	const rect = getRect<ElemType>(elem)
	const mouse = getNativeMousePosition(e)
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
