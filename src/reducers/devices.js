export const DEVICES_UPDATED = 'DEVICES_UPDATED'
export const DEVICE_CONNECTED = 'DEVICE_CONNECTED'
export const DEVICE_DISCONNECTED = 'DEVICE_DISCONNECTED'

const initialState = []

export default function(state = initialState, action) {
	switch(action.type) {
		case DEVICES_UPDATED: return action.devices || []
	}
	return state
}