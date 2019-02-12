import React, { Component } from 'react'
import { DragDropContext, DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import Main from './Main'

class App extends Component {
	render() {
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<Main />
			</DragDropContextProvider>
		)
	}
}

export default DragDropContext(HTML5Backend)(App)
