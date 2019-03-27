import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { ReduxStoreType, MappingType, ThunkDispatchProp } from '../../types'

import MappingRow from '../matrix/MappingRow'

interface Props {}

interface StateProps {
	mappings: MappingType[]
}

class MatrixWorkspace extends Component<ThunkDispatchProp & StateProps & Props> {
	container: HTMLDivElement
	render() {
		const { mappings } = this.props
		return (
			<div ref={(elem: HTMLDivElement) => (this.container = elem)} className={cn('matrix-interface-container')}>
				<div className="mapping-rows">
					{mappings.map(mapping => (
						<MappingRow key={mapping.id} mapping={mapping} />
					))}
				</div>
			</div>
		)
	}
}

export default connect(({ mappings }: ReduxStoreType): StateProps => ({ mappings }))(MatrixWorkspace)
