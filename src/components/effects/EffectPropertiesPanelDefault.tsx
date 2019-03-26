import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatchProp, EffectPropertiesPanelProps } from '../../types'
import _set from 'lodash/set'

import AutoParamInputs from '../AutoParamInputs'
import MidiInput from '../input/MidiInput'
import { updateEffect } from '../../reducers/effects'

class EffectPropertiesPanelDefault extends Component<ThunkDispatchProp & EffectPropertiesPanelProps> {
	render() {
		const { dispatch, id, effect, params, defaultValue } = this.props
		return (
			<div className="flex">
				<div className="flex-column">
					<AutoParamInputs
						params={params}
						defaultValue={defaultValue}
						value={effect}
						onChange={(path, value) => dispatch(updateEffect(id, { effect: _set({ ...effect }, path, value) }))}>
						{(element, param, index) => (
							<MidiInput key={`param${index}`} id={effect.id} type="effect" paramPath={param.path}>
								{element}
							</MidiInput>
						)}
					</AutoParamInputs>
				</div>
			</div>
		)
	}
}

export default connect()(EffectPropertiesPanelDefault)
