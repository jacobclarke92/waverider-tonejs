import React, { Component } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import Icon from '../Icon'
import { updateView } from '../../reducers/gui'
import { STAGE, DESK, MATRIX } from '../../constants/uiViews'

class Header extends Component {
	render() {
		const { dispatch, gui } = this.props
		return (
			<header className="header">
				<div className="header-inner">
					<div className="header-left">
						<button type="button" className="icon-button margin-r-m"><Icon name="play" /></button>
						<button
							type="button"
							className={classnames({active: gui.view == STAGE})} 
							onClick={() => dispatch(updateView(STAGE))}>
							Stage
						</button>
						<button
							type="button"
							className={classnames({active: gui.view == DESK})} 
							onClick={() => dispatch(updateView(DESK))}>
							Desk
						</button>
						<button 
							type="button" 
							className={classnames({active: gui.view == MATRIX})} 
							onClick={() => dispatch(updateView(MATRIX))}>
							Matrix
						</button>
					</div>
					<div className="header-right">

					</div>
				</div>
			</header>
		)
	}
}

export default connect(({gui}) => ({gui}))(Header)