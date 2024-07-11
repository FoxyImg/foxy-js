import {dir} from "~/utils/server/dir";

export default defineCachedEventHandler(async (event) => {
	const path = event.context.params!._;
	return dir(path);
}, { maxAge: 5 * 60 });
