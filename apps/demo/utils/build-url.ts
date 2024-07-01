import type {URLBuilder} from "@foxyimg/vue-ui";
import type {PartialImageParams} from "@foxyimg/url-builder";

export const buildUrl:URLBuilder = async (imageKey: string, params:PartialImageParams) =>{
	try {
		const res = await $fetch("/api/url", {
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				imageKey,
				params,
			},
		});

		return res?.url ?? null;
	} catch(ex:any) {
		console.error(ex);
		return null;
	}
}