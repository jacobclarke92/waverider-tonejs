import { Device, ThunkDispatchType } from '../types'
import { Action } from 'redux'
import { getAll, bulkPut } from '../api/db'
import { defer } from '../utils/lifecycleUtils'

export const DEVICES_UPDATED = 'DEVICES_UPDATED'
export const DEVICE_CONNECTED = 'DEVICE_CONNECTED'
export const DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED'

export type State = Device[]

interface ReducerAction extends Action {
	devices: Device[]
}

export const internalPiano: Device = {
	id: '_interal_piano',
	name: 'Keyboard Piano',
	type: 'input',
	disconnected: false,
	state: 'connected',
	connection: 'open',
	// open: () => new Promise(resolve => resolve()),
	// close: () => new Promise(resolve => resolve()),
	// onstatechange: (e: WebMidi.MIDIConnectionEvent) => true,
	// addEventListener: () => {},
	// removeEventListener: () => {},
	// dispatchEvent: (e: Event) => true,
} as Device

const initialState: State = [internalPiano]

export default function(state: State = initialState, action: ReducerAction) {
	switch (action.type) {
		case DEVICES_UPDATED:
			return action.devices || []
	}
	return state
}

export const loadDevices = () => (dispatch: ThunkDispatchType) =>
	getAll<Device>('devices')
		.then(devices => defer(() => dispatch({ type: DEVICES_UPDATED, devices })))
		.catch(e => console.warn('Unable to load previous midi devices', e))

export const updateDevices = (devicesToUpdate: Device[]) => (dispatch: ThunkDispatchType) =>
	bulkPut<Device>('devices', devicesToUpdate)
		.then(updatedDevices =>
			getAll<Device>('devices')
				.then(devices => defer(() => dispatch({ type: DEVICES_UPDATED, devices })))
				.catch(e => console.warn('Unable to load midi devices after updating them', e))
		)
		.catch(e => console.warn('Unable to update devices', devicesToUpdate, e))
