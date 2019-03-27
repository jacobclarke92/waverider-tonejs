import Point, { PointObj } from './Point'
import { polynomial } from 'regression'

export const roundToMultiple = (value: number, multiple: number): number => {
	const resto = value % multiple
	return resto <= multiple / 2 ? value - resto : value + multiple - resto
}

// gets distance between two points
export const dist = (p1: Point | PointObj, p2: Point | PointObj): number =>
	Math.sqrt(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2))

// clamps a value so it can't go out of range
export const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max)

// check if point is in rect
export const inBounds = (point: Point | PointObj, x: number, y: number, w: number, h: number): boolean =>
	point.x >= x && point.y >= y && point.x <= x + w && point.y <= y + h

// returns distance between two points
export const getDistance = (pt1: Point | PointObj, pt2: Point | PointObj): number =>
	Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2))

// returns angle between two points
export const getAngle = (pt1: Point | PointObj, pt2: Point | PointObj): number =>
	Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x)

export const scale = (val: number, rangeStart: number, rangeEnd: number, mapStart: number, mapEnd: number) => {
	return val === 1 / 0 || val === -1 / 0
		? val
		: ((val - rangeStart) * (mapEnd - mapStart)) / (rangeEnd - rangeStart) + mapStart
}

export function curvesHashTable(points: [number, number][] = [[0, 0], [255, 255]], min: number = 0, max: number = 255) {
	const result = polynomial(points, { order: points.length - 1 })
	const coefficients = result.equation
	const curvesHashTable = []
	for (var x = min; x <= max; x++) {
		curvesHashTable[x] = 0
		for (var c = points.length - 1; c >= 0; c--) {
			curvesHashTable[x] += coefficients[c] * Math.pow(x, c)
		}
		curvesHashTable[x] = clamp(curvesHashTable[x], min, max)
	}
	return curvesHashTable
}
