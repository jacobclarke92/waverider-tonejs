import React, { Component, ReactNode } from 'react'
import cn from 'classnames'
import { connect, DispatchProp } from 'react-redux'
import { ReduxStoreType, MappingType } from '../../types'
import { updateActiveControl } from '../../reducers/gui'

export interface MidiInputProps {
	id: number
	type: string
	slug: string
	paramPath: string
	render?: (renderProps) => ReactNode
}

interface State {
	selected: boolean
}

export interface StateProps {
	selected: boolean
	hasMapping: boolean
	mapping: MappingType | null
	midiMappingEnabled: boolean
}

export type MidiInputRenderProps = State &
	StateProps & {
		onSelect: () => void
	}

class MidiInput extends Component<DispatchProp & MidiInputProps & StateProps, State> {
	onSelect = () => {
		const { id, type, slug, paramPath } = this.props
		this.props.dispatch(updateActiveControl({ type, ownerId: id, ownerType: slug, paramPath }))
	}

	render() {
		const { children, selected, hasMapping, mapping, midiMappingEnabled } = this.props
		const renderProps: MidiInputRenderProps = {
			midiMappingEnabled,
			hasMapping,
			mapping,
			selected,
			onSelect: this.onSelect,
		}
		if (typeof children == 'function') return children(renderProps)
		return (
			<div
				className={cn('midi-input', { active: midiMappingEnabled, selected, used: hasMapping })}
				onClick={() => midiMappingEnabled && this.onSelect()}>
				{children}
			</div>
		)
	}
}

export default connect(
	({ mappings, gui }: ReduxStoreType, props: MidiInputProps): StateProps => {
		const mapping = mappings.find(
			({ ownerId, ownerType, paramPath }) =>
				ownerId === props.id && ownerType === props.type && paramPath === props.paramPath
		)
		const selected =
			gui.activeControl &&
			gui.activeControl.ownerId === props.id &&
			gui.activeControl.ownerType === props.type &&
			gui.activeControl.paramPath === props.paramPath
		return { selected, mapping, hasMapping: !!mapping, midiMappingEnabled: gui.midiMappingEnabled }
	}
)(MidiInput)
