import React, { Component } from 'react'
import { connect } from 'react-redux'

import instrumentLibrary from '../instrumentLibrary'
import { addInstrument } from '../reducers/instruments'
import { ReduxStoreType, Instrument, ThunkDispatchProp } from '../types'

interface StateProps {
	instruments: Instrument[]
}

class InstrumentList extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { dispatch, instruments = [] } = this.props
		return (
			<div style={{ padding: '4rem 2rem' }}>
				<div className="instrument-buttons">
					{Object.keys(instrumentLibrary).map(instrumentType => (
						<button key={instrumentType} type="button" onClick={() => dispatch(addInstrument(instrumentType))}>
							{'Add ' + instrumentLibrary[instrumentType].name}
						</button>
					))}
				</div>
				<hr />
				<div className="instrument-list">
					{instruments.map(instrument => {
						const InstrumentComponent = instrumentLibrary[instrument.type].Editor
						return <InstrumentComponent key={instrument.id} {...instrument} />
					})}
				</div>
			</div>
		)
	}
}

export default connect(({ instruments }: ReduxStoreType): StateProps => ({ instruments }))(InstrumentList)
