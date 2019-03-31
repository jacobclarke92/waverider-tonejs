import React, { Component } from 'react'
import cn from 'classnames'
import { connect } from 'react-redux'
import { ReduxStoreType, ThunkDispatchProp } from '../../types'
import { State as GuiStore, toggleKeyboardPiano, toggleMidiMapping } from '../../reducers/gui'

import Icon from '../Icon'
import UploadWrapper from '../UploadWrapper'
import TransportControls from './TransportControls'
import { updateView } from '../../reducers/gui'
import { STAGE, DESK, MATRIX } from '../../constants/uiViews'
import { saveProjectFile, loadProjectFile } from '../../fileManager'
import { readBlobAsText } from '../../utils/blobUtils'

interface StateProps {
	gui: GuiStore
}

class Header extends Component<ThunkDispatchProp & StateProps> {
	processFile(files: FileList) {
		if (files.length === 1) readBlobAsText(files[0]).then(loadProjectFile)
	}
	render() {
		const { dispatch, gui } = this.props
		return (
			<header className="header">
				<div className="header-inner">
					<div className="header-left">
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
						<TransportControls />
					</div>
					<div className="header-right">
						<button
							className={cn('icon-button', { active: gui.midiMappingEnabled })}
							onClick={() => dispatch(toggleMidiMapping())}>
							<Icon name="midi" size="s" />
						</button>
						<UploadWrapper className="button icon-button" accept="application/json" onChange={this.processFile}>
							<Icon name="load" size="s" />
						</UploadWrapper>
						<button type="button" className={cn('icon-button')} onClick={() => saveProjectFile()}>
							<Icon name="save" size="s" />
						</button>
						<button
							type="button"
							className={cn('icon-button', { active: gui.keyboardPianoEnabled })}
							onClick={() => dispatch(toggleKeyboardPiano())}>
							<Icon name="keyboard" size="m" />
						</button>
					</div>
				</div>
			</header>
		)
	}
}

export default connect(({ gui }: ReduxStoreType): StateProps => ({ gui }))(Header)
