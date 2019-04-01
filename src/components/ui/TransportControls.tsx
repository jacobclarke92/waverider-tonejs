import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _throttle from 'lodash/throttle'
import { ReduxStoreType, ThunkDispatchProp } from '../../types'

import { ccMappingDebounce } from '../../constants/timings'
import { State as GuiStore } from '../../reducers/gui'
import { State as TransportStore, transportPlay, transportStop, updateBpm } from '../../reducers/transport'
import Icon from '../Icon'
import KnobInput from '../input/KnobInput'

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
	render() {
		const { playing, bpm } = this.props.transport
		return (
			<div className="transport-controls flex align-center margin-l-xl">
				<button
					type="button"
					className={cn('icon-button margin-r-m', playing && 'button-primary')}
					onClick={this.handlePlayPause}>
					<Icon name={playing ? 'stop' : 'play'} />
				</button>
				<KnobInput label="BPM" value={bpm} min={20} max={320} step={1} onChange={this.handleBpmChange} />
			</div>
		)
	}
}

export default connect(({ gui, transport }: ReduxStoreType): StateProps => ({ gui, transport }))(TransportControls)
