import React, { Component, memo } from 'react'
import { MASTER, INSTRUMENT, EFFECT } from '../../constants/deskItemTypes'
import { getEffectInstance } from '../../effectsController'
import { getInstrumentInstance } from '../../instrumentsController'
import BaseEffect from '../../effects/BaseEffect'
import BaseInstrument from '../../instruments/BaseInstrument'
import { clamp } from '../../utils/mathUtils'

interface Props {
	id: number
	type: string
}

interface State {
	level: number
}

export default class VuMeterSmart extends Component<Props, State> {
	raf: number
	instance: BaseEffect | BaseInstrument

	constructor(props) {
		super(props)
		this.instance = null
		this.raf = null
		this.monitorLevel = this.monitorLevel.bind(this)
		this.getInstance(props)
		this.state = { level: 0 }
	}

	componentWillUnmount() {
		if (this.raf) cancelAnimationFrame(this.raf)
	}

	componentDidUpdate(prevProps) {
		if (prevProps.id != this.props.id || prevProps.type != this.props.type) this.getInstance()
	}

	getInstance(props = this.props) {
		const { id, type } = this.props
		if (type == EFFECT) {
			const instance = getEffectInstance(id)
			if (instance) this.instance = instance
		}
		if (type == INSTRUMENT) {
			const instance = getInstrumentInstance(id)
			if (instance) this.instance = instance
		}
		if (!this.raf) this.raf = requestAnimationFrame(this.monitorLevel)
	}

	monitorLevel() {
		if (!this.instance) this.getInstance()
		if (this.instance && this.instance.meter) {
			// console.log(this.instance.meter.getLevel(), this.instance.meter.getValue())
			const level = this.instance.meter.getLevel()
			this.setState({ level })
		}
		this.raf = requestAnimationFrame(this.monitorLevel)
	}

	render() {
		return <VuMeter level={this.state.level} />
	}
}

const VuMeter = memo<{ level: number }>(({ level }) => {
	const rms = clamp(level + 100, 0, 100)
	return (
		<div className="vu-meter">
			<div className="vu-meter-bar" style={{ clipPath: `polygon(0% 0%, ${rms}% 0%, ${rms}% 100%, 0% 100%)` }} />
		</div>
	)
})
