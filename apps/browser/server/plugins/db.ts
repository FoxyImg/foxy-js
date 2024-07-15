import {runMigrations} from "~/utils/server/db/migrations";

export default defineNitroPlugin(async (nitroApp) => {
	await runMigrations();
});