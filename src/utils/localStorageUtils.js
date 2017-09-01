const defaultLocalStorageBytes = 1024*1024*128

export const getStorageQuota = () => new Promise((resolve, reject) => 
	navigator.webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => resolve({usedBytes, grantedBytes}), reject)
)

export const requestStorage = (bytes = defaultLocalStorageBytes) => new Promise((resolve, reject) => 
	navigator.webkitPersistentStorage.requestQuota(bytes, resolve, reject)
)