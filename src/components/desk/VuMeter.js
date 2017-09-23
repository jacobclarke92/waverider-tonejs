import React, { Component } from 'react'
import { MASTER, INSTRUMENT, FX } from '../../constants/deskItemTypes'
import { getInstrumentInstance } from '../../instrumentsController'

export default class VuMeter extends Component {

	constructor(props) {
		super(props)
		this.instance = null
		this.raf = null
		this.monitorLevel = this.monitorLevel.bind(this)
		this.getInstance(props)
		this.state = { level: 0 }
	}

	componentWillUnmount() {
		if(this.raf) cancelAnimationFrame(this.raf)
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.id != this.props.id || nextProps.type != this.props.type ) this.getInstance(nextProps)
	}

	getInstance(props = this.props) {
		const { id, type } = this.props
		if(type == INSTRUMENT) this.instance = getInstrumentInstance(id)
		if(!this.raf) this.raf = requestAnimationFrame(this.monitorLevel)
	}

	monitorLevel() {
		if(!this.instance) this.getInstance()
		if(this.instance) {
			const level = this.instance.meter ? this.instance.meter.value : 0
			this.setState({level})
		}
		this.raf = requestAnimationFrame(this.monitorLevel)
	}

	render() {
		const { level } = this.state
		const rms = Math.min(100, level*80)
		return (
			<div className="vu-meter">
				<div 
					className="vu-meter-bar" 
					style={{clipPath: `polygon(0% 0%, ${rms}% 0%, ${rms}% 100%, 0% 100%)`}} />
			</div>
		)
	}
}