import type {DeepPartial} from "../deep-partial";

export function extractChanges<T>(sourceObj: T, defaultObj: T, skip:string[] = []):DeepPartial<T>|null|undefined {
	if (sourceObj === undefined || defaultObj === undefined) {
		return undefined;
	}

	if (sourceObj === null || defaultObj === null) {
		return null;
	}

	const newObj: DeepPartial<T> = {};
	for (const key in sourceObj) {
		if (skip.includes(key)) {
			continue;
		}

		if (sourceObj[key] === undefined) {
			continue;
		}

		if (sourceObj[key] === null && defaultObj[key] === null) {
			continue;
		}

		if (Array.isArray(sourceObj[key])) {
			if (Array.isArray(defaultObj[key])) {
				const s = new Set((<any[]>sourceObj[key]));
				const d = new Set((<any[]>defaultObj[key]));

				let equal = s.size === d.size;
				if (equal) {
					for (const item of s) {
						if (!d.has(item)) {
							equal = false;
							break;
						}
					}
				}

				if (!equal) {
					(<any>newObj)[key] = sourceObj[key];
				}
			} else {
				(<any>newObj)[key] = sourceObj[key];
			}
		} else if (typeof sourceObj[key] === "object") {
			const v = extractChanges(sourceObj[key], defaultObj[key]);
			if (v !== defaultObj[key] && (v !== undefined && v !== null && Object.keys(v).length > 0)) {
				(<any>newObj)[key] = v;
			}
		} else if (sourceObj[key] !== defaultObj[key]) {
			(<any>newObj)[key] = sourceObj[key];
		}
	}

	return newObj;
}
