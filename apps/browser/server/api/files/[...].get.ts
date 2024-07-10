import {dir} from "~/utils/server/dir";

export default defineEventHandler(async (event) => {
	const path = event.context.params!._;
	return dir(path);
});
