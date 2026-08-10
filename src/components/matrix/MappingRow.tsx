import React, { Component } from 'react'
import cn from 'classnames'
import _get from 'lodash/get'
import _throttle from 'lodash/throttle'
import { MappingType, ReduxStoreType, Instrument, Effect, ThunkDispatchProp } from '../../types'
import { connect } from 'react-redux'

import { ccMappingDebounce } from '../../constants/timings'
import { scale } from '../../utils/mathUtils'
import { updateMapping } from '../../reducers/mappings'
import AudioTrim, { TrimType } from '../AudioTrim'
import CurveInput from '../input/CurveInput'

interface Props {
	mapping: MappingType
}

interface StateProps {
	value: number
	// effect?: Effect
	instrument?: Instrument
}

class MappingRow extends Component<ThunkDispatchProp & StateProps & Props> {
	constructor(props: ThunkDispatchProp & StateProps & Props) {
		super(props)
		this.onRangeChange = _throttle(this.onRangeChange, ccMappingDebounce)
	}
	onRangeChange = (trim: TrimType) => {
		const { dispatch, mapping } = this.props
		dispatch(
			updateMapping(mapping.id!, {
				min: scale(trim.start, 0, 1, mapping.actualMin || 0, mapping.actualMax || 1),
				max: scale(trim.end, 0, 1, mapping.actualMin || 0, mapping.actualMax || 1),
			})
		)
	}
	render() {
		const { mapping, value } = this.props
		const trim: TrimType = {
			start: scale(mapping.min || 0, mapping.actualMin || 0, mapping.actualMax || 1, 0, 1),
			end: scale(mapping.max || 1, mapping.actualMin || 0, mapping.actualMax || 1, 0, 1),
		}
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
				<div style={{ paddingBottom: '1rem' }}>
					<div style={{ position: 'relative', display: 'block', width: 150, height: 75, border: '1px solid white' }}>
						<AudioTrim trim={trim} onChange={this.onRangeChange} />
					</div>
				</div>
				<div>
					<CurveInput size={75} onChange={() => {}} />
				</div>
			</div>
		)
	}
}

export default connect(
	({ instruments, effects }: ReduxStoreType, { mapping }: Props): StateProps => {
		let value: number = 0
		let effect: Effect | undefined
		let instrument: Instrument | undefined
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
