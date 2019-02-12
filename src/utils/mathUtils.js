export const roundToMultiple = (value, multiple) => {
	const resto = value % multiple
	return resto <= multiple / 2 ? value - resto : value + multiple - resto
}

// gets distance between two points
export const dist = (p1, p2) => Math.sqrt(Math.pow(Math.abs(p2.x - p1.x), 2) + Math.pow(Math.abs(p2.y - p1.y), 2))

// clamps a value so it can't go out of range
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

// check if point is in rect
export const inBounds = (point, x, y, w, h) => point.x >= x && point.y >= y && point.x <= x + w && point.y <= y + h

// returns distance between two points
export const getDistance = (pt1, pt2) => Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2))

// returns angle between two points
export const getAngle = (pt1, pt2) => Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x)
