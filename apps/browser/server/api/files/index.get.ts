import {dir} from "~/utils/server/dir";

export default defineCachedEventHandler(async (event) => {
	return dir('/');
}, { maxAge: 5 * 60 });
