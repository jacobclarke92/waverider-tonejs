import { ComponentType } from 'react'
import { STAGE, DESK, MATRIX } from './constants/uiViews'
import DeskWorkspace from './components/view/DeskWorkspace'
import DeskSidebar from './components/view/DeskSidebar'
import DeskNavbar from './components/view/DeskNavbar'

export interface UiViewType {
	Workspace: ComponentType
	Navbar: ComponentType
	Sidebar: ComponentType
}

const views: { [k: string]: UiViewType } = {
	[STAGE]: {
		Workspace: null,
		Navbar: null,
		Sidebar: null,
	},
	[DESK]: {
		Workspace: DeskWorkspace,
		Navbar: DeskNavbar,
		Sidebar: DeskSidebar,
	},
	[MATRIX]: {
		Workspace: null,
		Navbar: null,
		Sidebar: null,
	},
}

export default views
