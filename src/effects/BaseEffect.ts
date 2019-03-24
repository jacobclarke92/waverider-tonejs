import { Meter, Waveform } from 'tone'
import { GenericProps, AnyParamType } from '../types'
import { checkDifferenceAny, getDeepDiff } from '../utils/lifecycleUtils'

export interface BaseEffectConstructor {
	new (value: GenericProps, dispatch: Function, params: AnyParamType[]): BaseEffect
}

export default class BaseEffect {
	id?: number
	mounted: boolean
	type: string
	dispatch: Function
	params: AnyParamType[]
	meter: Meter
	effect: any
	instance: any
	analyser?: Waveform

	constructor(value: GenericProps = {}, dispatch: Function, params: AnyParamType[]) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		console.log(`Mounting ${this.type}...`)
		this.mounted = false
		this.dispatch = dispatch
		this.params = params || []
		this.meter = new Meter(1)
		this.initEffect.bind(this)
		this.initEffect(() => {
			this.mounted = true
			this.updateParams(this.effect || {})
			console.log(this.type + ' mounted', this)
		})
	}

	initEffect(callback = () => {}) {
		if (this.instance) this.instance.dispose()
		// this.instance = new AutoFilter()
		// this.instance.connect(this.meter)
		callback()
	}

	update(value: GenericProps, oldValue: GenericProps) {
		Object.keys(value).forEach(key => (this[key] = value[key]))
		if (checkDifferenceAny(value.effect, oldValue.effect, this.params.map(({ path }) => path))) {
			this.updateParams(getDeepDiff(value.effect, oldValue.effect))
		}
	}

	updateParams(changes: GenericProps) {
		if (!this.mounted || !this.instance) return
		Object.keys(changes).forEach(key => {
			const param = this.params.find(({ path }) => path === key)
			if (param && param.pathHasValue) this.instance[key].value = changes[key]
			else this.instance[key] = changes[key]
		})
	}

	getToneSource() {
		return this.mounted && this.instance ? this.instance : false
	}
}
