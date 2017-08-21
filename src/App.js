import React, { Component } from 'react'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import WaveformContainer from './WaveformContainer'

class App extends Component {
	render() {
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<WaveformContainer />
			</DragDropContextProvider>
		)
	}
}

export default DragDropContext(HTML5Backend)(App)