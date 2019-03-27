import React, { Component } from 'react'
import cn from 'classnames'
import _get from 'lodash/get'
import { MappingType, ReduxStoreType, Instrument, Effect } from '../../types'
import { connect } from 'react-redux'

interface Props {
	mapping: MappingType
}

interface StateProps {
	value: number
	// effect?: Effect
	// instrument?: Instrument
}

class MappingRow extends Component<Props & StateProps> {
	render() {
		const { mapping, value } = this.props
		return (
			<div className={cn('mapping-row flex')}>
				<div style={{ width: 100 }}>
					{mapping.type} [{mapping.ownerId}]
				</div>
				<div style={{ width: 100 }}>{mapping.ownerType}</div>
				<div style={{ width: 100 }}>{mapping.paramPath}</div>
				<div style={{ width: 100 }}>{value}</div>
				<div style={{ width: 100 }}>{mapping.min}</div>
				<div style={{ width: 100 }}>{mapping.max}</div>
				<div style={{ width: 100 }}>Linear</div>
			</div>
		)
	}
}

export default connect(
	({ instruments, effects }: ReduxStoreType, { mapping }: Props): StateProps => {
		let value: number = null
		let effect: Effect = null
		let instrument: Instrument = null
		if (mapping.type == 'instrument') {
			instrument = instruments.find(
				instrument => instrument.id === mapping.ownerId && instrument.type === mapping.ownerType
			)
			if (instrument) {
				value = _get(instrument.instrument, mapping.paramPath) || 0
			}
		} else if (mapping.type == 'effect') {
			effect = effects.find(effect => effect.id === mapping.ownerId && effect.type === mapping.ownerType)
			if (effect) {
				value = _get(effect.effect, mapping.paramPath) || 0
			}
		}
		return {
			value,
			// effect,
			// instrument,
		}
	}
)(MappingRow)
