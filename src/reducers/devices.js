import { getAll, bulkPut } from '../api/db'
export const DEVICES_UPDATED = 'DEVICES_UPDATED'
export const DEVICE_CONNECTED = 'DEVICE_CONNECTED'
export const DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED'

const initialState = []

export default function(state = initialState, action) {
	switch (action.type) {
		case DEVICES_UPDATED:
			return action.devices || []
	}
	return state
}

export const loadDevices = () => dispatch =>
	getAll('devices')
		.then(devices => dispatch({ type: DEVICES_UPDATED, devices }))
		.catch(e => console.warn('Unable to load previous midi devices', e))

export const updateDevices = devicesToUpdate => dispatch =>
	bulkPut('devices', devicesToUpdate)
		.then(updatedDevices =>
			getAll('devices')
				.then(devices => dispatch({ type: DEVICES_UPDATED, devices }))
				.catch(e => console.warn('Unable to load midi devices after updating them', e))
		)
		.catch(e => console.warn('Unable to update devices', devices, e))
