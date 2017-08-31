const blobs = {}
const waveforms = {}

export const addBlob = (name, blob) => blobs[name] = blob
export const getBlob = name => (name in blobs) ? blobs[name] : false
export const getBlobUrl = name => (name in blobs) ? URL.createObjectURL(blobs[name]) : false
export const getAllBlobs = () => blobs

export const addWaveform = (name, uri) => waveforms[name] = uri
export const getWaveform = name => waveforms[name]
export const getAllWaveforms = () => waveforms