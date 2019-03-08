import React, { Component } from 'react'
import { MASTER, INSTRUMENT, EFFECT } from '../../constants/deskItemTypes'
import { getEffectInstance } from '../../effectsController'
import { getInstrumentInstance } from '../../instrumentsController'
import BaseEffect from '../../effects/BaseEffect'
import BaseInstrument from '../../instruments/BaseInstrument'

interface Props {
	id: number
	type: string
}

interface State {
	level: number
}

export default class VuMeter extends Component<Props, State> {
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

	componentWillReceiveProps(nextProps) {
		if (nextProps.id != this.props.id || nextProps.type != this.props.type) this.getInstance(nextProps)
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
		if (this.instance) {
			const level = this.instance.meter ? this.instance.meter.getValue() : 0
			this.setState({ level })
		}
		this.raf = requestAnimationFrame(this.monitorLevel)
	}

	render() {
		const { level } = this.state
		const rms = Math.min(100, level * 80)
		return (
			<div className="vu-meter">
				<div className="vu-meter-bar" style={{ clipPath: `polygon(0% 0%, ${rms}% 0%, ${rms}% 100%, 0% 100%)` }} />
			</div>
		)
	}
}
