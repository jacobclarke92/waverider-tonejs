import { Meter } from 'tone'
import { GenericProps } from '../types'

export interface BaseEffectConstructor {
	new (value: GenericProps, dispatch: Function): BaseEffect
}

export default class BaseEffect {
	id?: number
	mounted: boolean
	type: string
	dispatch: Function
	meter: Meter
	instance: any

	constructor(value: GenericProps = {}, dispatch: Function) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		console.log(`Mounting ${this.type}...`)
		this.mounted = false
		this.dispatch = dispatch
		this.meter = new Meter(0.5)
		this.initEffect(() => {
			this.mounted = true
			console.log(this.type + ' mounted', this)
		})
	}

	update(value, oldValue) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		// this.instance = new AutoFilter()
		// this.instance.connect(this.meter)
		callback()
	}

	getToneSource() {
		return this.mounted && this.instance ? this.instance : false
	}
}
