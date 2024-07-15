import {useDatabase} from "~/utils/server/db/db";

export async function runMigrations() {
	const db = await useDatabase();
	await db.migrate({
		migrationsPath: useRuntimeConfig().migrationsPath,
	});
	await db.close();
}