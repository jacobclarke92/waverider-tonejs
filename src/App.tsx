import React, { Component } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import Main from './Main'

class App extends Component {
	render() {
		return (
			<DndProvider backend={HTML5Backend}>
				<Main />
			</DndProvider>
		)
	}
}

export default App
