import { STAGE, DESK, MATRIX } from './constants/uiViews'
import DeskWorkspace from './components/view/DeskWorkspace'
import DeskNavbar from './components/view/DeskNavbar'

export default {
	[STAGE]: {
		Workspace: null,
		Navbar: null,
		Sidebar: null,
	},
	[DESK]: {
		Workspace: DeskWorkspace,
		Navbar: DeskNavbar,
		Sidebar: null,
	},
	[MATRIX]: {
		Workspace: null,
		Navbar: null,
		Sidebar: null,
	},
}