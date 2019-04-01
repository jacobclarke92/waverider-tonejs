import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _throttle from 'lodash/throttle'
import { ReduxStoreType, ThunkDispatchProp, TimeSignature } from '../../types'

import { ccMappingDebounce } from '../../constants/timings'
import { State as GuiStore } from '../../reducers/gui'
import {
	State as TransportStore,
	transportPlay,
	transportStop,
	updateBpm,
	updateTimeSignature,
} from '../../reducers/transport'
import Icon from '../Icon'
import KnobInput from '../input/KnobInput'
import SelectInput from '../input/SelectInput'

interface Props {}
interface StateProps {
	gui: GuiStore
	transport: TransportStore
}

class TransportControls extends Component<ThunkDispatchProp & StateProps & Props> {
	constructor(props) {
		super(props)
		this.handleBpmChange = _throttle(this.handleBpmChange, ccMappingDebounce)
	}
	handlePlayPause = () => {
		const { playing } = this.props.transport
		if (playing) this.props.dispatch(transportStop())
		else this.props.dispatch(transportPlay())
	}
	handleBpmChange = (val: number) => {
		this.props.dispatch(updateBpm(val))
	}
	handleTimeSignatureChange = (val: TimeSignature) => {
		this.props.dispatch(updateTimeSignature(val))
	}
	render() {
		const { playing, bpm, timeSignature } = this.props.transport
		return (
			<div className="transport-controls flex align-center margin-l-xl">
				<button
					type="button"
					className={cn('icon-button margin-r-m', playing && 'button-primary')}
					onClick={this.handlePlayPause}>
					<Icon name={playing ? 'stop' : 'play'} />
				</button>
				<KnobInput label="BPM" value={bpm} min={20} max={320} step={1} onChange={this.handleBpmChange} />
				<div className="field margin-l-m">
					<label>Beats</label>
					<SelectInput
						empty={false}
						options={[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(value => ({ value, text: value.toString() }))}
						value={timeSignature[0]}
						onChange={(val: string) => this.handleTimeSignatureChange([parseInt(val), timeSignature[1]])}
					/>
				</div>
				<div className="margin-h-s font-size-m">/</div>
				<div className="field">
					<label>Division</label>
					<SelectInput
						empty={false}
						options={[2, 4, 8, 16].map(value => ({ value, text: value.toString() }))}
						value={timeSignature[1]}
						onChange={(val: string) => this.handleTimeSignatureChange([timeSignature[0], parseInt(val)])}
					/>
				</div>
			</div>
		)
	}
}

export default connect(({ gui, transport }: ReduxStoreType): StateProps => ({ gui, transport }))(TransportControls)
