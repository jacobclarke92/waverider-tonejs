import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'

const defaultChecker = (a, b) => (~['string', 'number'].indexOf(typeof a) ? a != b : !_isEqual(a, b))

export function checkDifferenceAll(prevProps, nextProps, paths, checker = defaultChecker) {
	if (typeof paths == 'string') paths = [paths]
	for (let path of paths) {
		if (!checker(_get(prevProps, path), _get(nextProps, path))) return false
	}
	return true
}

export function checkDifferenceAny(prevProps, nextProps, paths, checker = defaultChecker) {
	if (typeof paths == 'string') paths = [paths]
	for (let path of paths) {
		if (checker(_get(prevProps, path), _get(nextProps, path))) return true
	}
	return false
}
