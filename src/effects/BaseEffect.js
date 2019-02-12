import { Meter } from 'tone'

export default class BaseEffect {
	constructor(value = {}, dispatch) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		console.log(`Mounting ${this.type}...`)
		this.mounted = false
		this.dispatch = dispatch
		this.meter = new Meter()
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
