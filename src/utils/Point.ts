export interface PointObj {
	x: number
	y: number
}

export default class Point {
	x: number
	y: number

	/**
	 * Loaded constructor can take x and y or an object containing x and y
	 * @param  {Number/Object} x - x position or object
	 * @param  {Number} y - y position
	 * @return {Point}
	 */
	constructor(x: number, y: number)
	constructor(x: PointObj | Point)
	constructor(x: any, y?: number) {
		if (typeof x == 'object') {
			this.x = x.x
			this.y = x.y
		} else {
			this.x = x
			this.y = y
		}
		return this
	}

	abs() {
		this.x = Math.abs(this.x)
		this.y = Math.abs(this.y)
		return this
	}

	add(/* point1, point2, ... */) {
		if (arguments.length === 1 && typeof arguments[0] == 'number') {
			this.x += arguments[0]
			this.y += arguments[0]
		} else {
			for (let argument of arguments) {
				this.x += argument.x
				this.y += argument.y
			}
		}
		return this
	}

	subtract(/* point1, point2, ... */) {
		if (arguments.length === 1 && typeof arguments[0] == 'number') {
			this.x -= arguments[0]
			this.y -= arguments[0]
		} else {
			for (let argument of arguments) {
				this.x -= argument.x
				this.y -= argument.y
			}
		}
		return this
	}

	multiply(point) {
		if (typeof point == 'number') {
			this.x *= point
			this.y *= point
		} else {
			this.x *= point.x
			this.y *= point.y
		}
		return this
	}

	divide(point) {
		if (typeof point == 'number') {
			this.x /= point
			this.y /= point
		} else {
			this.x /= point.x
			this.y /= point.y
		}
		return this
	}

	round(amount = 1) {
		this.x = amount * Math.round(this.x / amount)
		this.y = amount * Math.round(this.y / amount)
		return this
	}

	distance(point) {
		return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
	}

	angle(point) {
		return Math.atan2(point.y - this.y, point.x - this.x)
	}

	normalize(scale = 1) {
		const norm = Math.sqrt(this.x * this.x + this.y * this.y)
		if (norm !== 0) {
			this.x = (scale * this.x) / norm
			this.y = (scale * this.y) / norm
		}
		return this
	}

	limit(max) {
		if (this.x * this.x + this.y * this.y > max * max) {
			this.normalize()
			this.multiply(max)
		}
		return this
	}

	toObject() {
		return { x: this.x, y: this.y }
	}
}
