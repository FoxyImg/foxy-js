import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { useRuntimeConfig } from '#imports'

export async function useDatabase() {
	const config = useRuntimeConfig();
	return await open({
		filename: config.dbPath,
		driver: sqlite3.Database,
	});
}