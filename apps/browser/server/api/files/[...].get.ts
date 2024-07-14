import {dir} from "~/utils/server/dir";
import {CachedDir} from "~/types/cache";
import {addMinutes} from "@foxyimg/utils";

export default defineEventHandler(async (event) => {
	const path = event.context.params!._;

	const cached = await useStorage<CachedDir>('foxy-browser-dir-cache').getItem(path);
	if (cached && cached.expires > Date.now()) {
		console.log('cache hit', path);
		return cached.files;
	}

	console.log('cache miss', path);

	const files = dir(path);
	await useStorage<CachedDir>('foxy-browser-dir-cache').setItem(path, {
		expires: addMinutes(null, 5).getTime(),
		files,
	});

	return files;
});//, { maxAge: 5 * 60 });
