export function trailingSlash(url:string) {
	return trimEndingSlash(url) + '/';
}

export function leadingSlash(url:string) {
	return "/" + trimStartingSlash(url);
}

export function trimStartingSlash(url:string) {
	return url.startsWith('/') ? url.slice(1) : url;
}

export function trimEndingSlash(url:string) {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}
