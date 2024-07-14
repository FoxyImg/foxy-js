import {dir} from "~/utils/server/dir";
import {CachedDir} from "~/types/cache";
import {addMinutes} from "@foxyimg/utils";

export default defineEventHandler(async (event) => {
	const cached = await useStorage<CachedDir>('foxy-browser-dir-cache').getItem('/');
	if (cached && cached.expires > Date.now()) {
		console.log('cache hit', '/');
		return cached.files;
	}

	console.log('cache miss', '/');

	const files = dir('/');
	await useStorage<CachedDir>('foxy-browser-dir-cache').setItem('/', {
		expires: addMinutes(null, 5).getTime(),
		files,
	});

	return files;
});
