export function arraysAreEqual<T>(a: T[], b: T[]) {
	if (a.length !== b.length) {
		return false;
	}

	const s = new Set(a);
	const d = new Set(b);

	let equal = s.size === d.size;
	if (equal) {
		for (const item of s) {
			if (!d.has(item)) {
				equal = false;
				break;
			}
		}
	}

	return equal;
}