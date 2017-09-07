const defaultLocalStorageBytes = 1024*1024*128

export const getStorageQuota = () => new Promise((resolve, reject) => {
	if(navigator.webkitTemporaryStorage) {
		navigator.webkitTemporaryStorage.queryUsageAndQuota((usedBytes, grantedBytes) => resolve({usedBytes, grantedBytes}), reject)
	}else{
		reject('webkitTemporaryStorage not available')
	}
})

export const requestStorage = (bytes = defaultLocalStorageBytes) => new Promise((resolve, reject) => {
	if(navigator.webkitPersistentStorage) {
		navigator.webkitPersistentStorage.requestQuota(bytes, resolve, reject)
	}else{
		reject('webkitPersistentStorage not available')
	}
})