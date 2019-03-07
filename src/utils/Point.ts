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
	constructor(x: PointObj)
	constructor(x: Point)
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

	abs(): Point {
		this.x = Math.abs(this.x)
		this.y = Math.abs(this.y)
		return this
	}

	add(...args: number[] | Point[] | PointObj[]): Point {
		if (!args.length) return this
		if (typeof args[0] == 'number') {
			this.x += args[0] as number
			this.y += args[0] as number
		} else {
			for (let arg of args as Point[] | PointObj[]) {
				this.x += arg.x
				this.y += arg.y
			}
		}
		return this
	}

	subtract(...args: number[] | Point[] | PointObj[]): Point {
		if (!args.length) return this
		if (typeof args[0] == 'number') {
			this.x -= args[0] as number
			this.y -= args[0] as number
		} else {
			for (let arg of args as Point[] | PointObj[]) {
				this.x -= arg.x
				this.y -= arg.y
			}
		}
		return this
	}

	multiply(point: number | Point | PointObj): Point {
		if (typeof point == 'number') {
			this.x *= point
			this.y *= point
		} else {
			this.x *= point.x
			this.y *= point.y
		}
		return this
	}

	divide(point: number | Point | PointObj): Point {
		if (typeof point == 'number') {
			this.x /= point
			this.y /= point
		} else {
			this.x /= point.x
			this.y /= point.y
		}
		return this
	}

	round(amount: number = 1): Point {
		this.x = amount * Math.round(this.x / amount)
		this.y = amount * Math.round(this.y / amount)
		return this
	}

	distance(point: Point | PointObj): number {
		return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2))
	}

	angle(point: Point | PointObj): number {
		return Math.atan2(point.y - this.y, point.x - this.x)
	}

	normalize(scale: number = 1): Point {
		const norm = Math.sqrt(this.x * this.x + this.y * this.y)
		if (norm !== 0) {
			this.x = (scale * this.x) / norm
			this.y = (scale * this.y) / norm
		}
		return this
	}

	limit(max: number): Point {
		if (this.x * this.x + this.y * this.y > max * max) {
			this.normalize()
			this.multiply(max)
		}
		return this
	}

	toObject(): PointObj {
		return { x: this.x, y: this.y }
	}
}
