import {dir} from "~/utils/server/dir";

export default defineEventHandler(async (event) => {
	return dir('/');
});
