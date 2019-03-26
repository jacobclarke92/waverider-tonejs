import React, { Component, ElementType } from 'react'
import _get from 'lodash/get'
import { AnyParamType, KeyedObject, GenericProps } from '../types'
import KnobInput from './input/KnobInput'
import SelectInput from './input/SelectInput'
import Checkbox from './input/Checkbox'

interface Props {
	value: KeyedObject
	defaultValue: KeyedObject
	params: AnyParamType[]
	onChange: (path: string, value: any) => void
}

export default class AutoParamInputs extends Component<Props> {
	render() {
		const { params, children } = this.props
		return (
			<div className="flex">
				{params.map((param, i) => {
					const node = this.renderParam(param, i)
					return typeof children == 'function' ? children(node, param, i) : node
				})}
			</div>
		)
	}

	renderParam(param: AnyParamType, i: number) {
		let ParamComponent: ElementType = null
		let props: GenericProps = { ...param }
		if ('type' in param && param.type == 'boolean') {
			ParamComponent = Checkbox
			props.text = param.description || param.label
		} else if ('options' in param) {
			ParamComponent = SelectInput
			props.options = param.options.map(value => ({ value, text: value }))
		} else {
			ParamComponent = KnobInput
		}
		props.value = _get(this.props.value, param.path)
		props.onChange = val => this.props.onChange(param.path, val)
		return <ParamComponent key={`param${i}`} {...props} />
	}
}
