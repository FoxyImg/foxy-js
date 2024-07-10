export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const path = event.context.params!._;
	await sendRedirect(event, config.foxyStaticHost + '/' + path, 301);
});
