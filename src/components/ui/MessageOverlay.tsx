import React, { FunctionComponent, CSSProperties, memo } from 'react'
import cn from 'classnames'

interface Props {
	message: string
	hide?: boolean
	className?: string
	style?: CSSProperties
}

const MessageOverlay: FunctionComponent<Props> = memo(({ message = '', hide = false, className, style = {} }) => (
	<div className={cn('message-overlay', className, { hide })} style={style}>
		{message}
	</div>
))

export default MessageOverlay
