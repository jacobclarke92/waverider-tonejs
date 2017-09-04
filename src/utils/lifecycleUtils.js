import _get from 'lodash/get'

const defaultChecker = (a, b) => a != b;

export function checkDifferenceAll(prevProps, nextProps, paths, checker = defaultChecker) {
	if(typeof paths == 'string') paths = [paths];
	for(let path of paths) {
		if(!checker(_get(prevProps, path), _get(nextProps, path))) return false;
	}
	return true;
}

export function checkDifferenceAny(prevProps, nextProps, paths, checker = defaultChecker) {
	if(typeof paths == 'string') paths = [paths];
	for(let path of paths) {
		if(checker(_get(prevProps, path), _get(nextProps, path))) return true;
	}
	return false;
}