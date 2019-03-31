import React, { Component } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { ReduxStoreType, ThunkDispatchProp } from '../../types'
import { State as GuiStore } from '../../reducers/gui'
import { State as TransportStore, transportPause, transportPlay } from '../../reducers/transport'
import Icon from '../Icon'
import KnobInput from '../input/KnobInput'

interface Props {}
interface StateProps {
	gui: GuiStore
	transport: TransportStore
}

class TransportControls extends Component<ThunkDispatchProp & StateProps & Props> {
	handlePlayPause = () => {
		const { playing } = this.props.transport
		if (playing) this.props.dispatch(transportPause())
		else this.props.dispatch(transportPlay())
	}
	render() {
		const { playing, bpm } = this.props.transport
		return (
			<div className="transport-controls flex align-center margin-l-xl">
				<button
					type="button"
					className={cn('icon-button margin-r-m', playing && 'button-primary')}
					onClick={this.handlePlayPause}>
					<Icon name={playing ? 'pause' : 'play'} />
				</button>
				<KnobInput label="BPM" value={bpm} min={20} max={320} step={1} onChange={val => {}} />
			</div>
		)
	}
}

export default connect(({ gui, transport }: ReduxStoreType): StateProps => ({ gui, transport }))(TransportControls)
