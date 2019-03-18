import React, { Component, CSSProperties } from 'react'
import cn from 'classnames'

interface Props {
	className?: string
	style?: CSSProperties
	multiple?: boolean
	accept?: string
	onChange: (files: FileList) => void
}

export default class UploadWrapper extends Component<Props> {
	labelFor: string

	static defaultProps = {
		multiple: false,
	}

	constructor(props) {
		super(props)
		this.labelFor = 'uploader' + Math.round(Math.random() * 9999999)
	}

	handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChange(e.target.files)
	}

	render() {
		const { children, className, style, multiple, accept } = this.props
		return (
			<label htmlFor={this.labelFor} className={cn('upload-label', className)} style={style}>
				{children}
				<input
					type="file"
					id={this.labelFor}
					accept={accept}
					multiple={multiple}
					style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
					onChange={this.handleInputChange}
				/>
			</label>
		)
	}
}
