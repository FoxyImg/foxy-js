import {dir} from "~/utils/server/dir";
import {addMinutes, trailingSlash} from "@foxyimg/utils";
import {useDatabase} from "~/utils/server/db/db";
import path from "node:path";

export default defineEventHandler(async (event) => {
	const db = await useDatabase();

	const filePath = decodeURIComponent(event.context.params!._ ?? '/');

	const config = useRuntimeConfig();
	const finalPath = path.normalize(path.join(config.fileRoot, filePath));

	const cached = await db.get("select * from cache where path = ?", trailingSlash(finalPath));
	if (cached && cached.expires > Date.now()) {
		console.log('cache hit', filePath);
		return JSON.parse(cached.data);
	}

	console.log('cache miss', filePath);

	const files = await dir(event, db, filePath);
	await db.run("insert or replace into cache (path, expires, data) values (?, ?, ?)", trailingSlash(finalPath), addMinutes(null, 5).getTime(), JSON.stringify(files));
	await db.close();

	return files;
});//, { maxAge: 5 * 60 });
