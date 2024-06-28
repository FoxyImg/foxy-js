export function trailingSlash(url:string) {
	if (url.endsWith('/')) {
		return url;
	}

	return url + '/';
}

export function leadingSlash(url:string) {
	if (url.startsWith('/')) {
		return url;
	}

	return '/' + url;
}

export function trimStartingSlash(url:string) {
	if (url.startsWith('/')) {
		return url.slice(1);
	}

	return url;
}
