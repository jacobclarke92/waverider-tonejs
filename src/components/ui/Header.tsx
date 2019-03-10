import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { ReduxStoreType, ThunkDispatchProp } from '../../types'
import { State as GuiStore, toggleKeyboardPiano } from '../../reducers/gui'

import Icon from '../Icon'
import { updateView } from '../../reducers/gui'
import { STAGE, DESK, MATRIX } from '../../constants/uiViews'

interface StateProps {
	gui: GuiStore
}

class Header extends Component<ThunkDispatchProp & StateProps> {
	render() {
		const { dispatch, gui } = this.props
		return (
			<header className="header">
				<div className="header-inner">
					<div className="header-left">
						<button type="button" className="icon-button margin-r-m">
							<Icon name="play" />
						</button>
						<button
							type="button"
							className={cn({ active: gui.view == STAGE })}
							onClick={() => dispatch(updateView(STAGE))}>
							Stage
						</button>
						<button
							type="button"
							className={cn({ active: gui.view == DESK })}
							onClick={() => dispatch(updateView(DESK))}>
							Desk
						</button>
						<button
							type="button"
							className={cn({ active: gui.view == MATRIX })}
							onClick={() => dispatch(updateView(MATRIX))}>
							Matrix
						</button>
					</div>
					<div className="header-right">
						<button
							type="button"
							className={cn('icon-button', { active: gui.keyboardPianoEnabled })}
							onClick={() => dispatch(toggleKeyboardPiano())}>
							<Icon name="keyboard" />
						</button>
					</div>
				</div>
			</header>
		)
	}
}

export default connect(({ gui }: ReduxStoreType): StateProps => ({ gui }))(Header)
