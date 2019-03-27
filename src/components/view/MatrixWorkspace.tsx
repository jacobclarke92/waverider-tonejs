import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { ReduxStoreType, MappingType, ThunkDispatchProp } from '../../types'

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
				{mappings.map(mapping => (
					<pre key={mapping.id}>{JSON.stringify(mapping)}</pre>
				))}
			</div>
		)
	}
}

export default connect(({ mappings }: ReduxStoreType): StateProps => ({ mappings }))(MatrixWorkspace)
