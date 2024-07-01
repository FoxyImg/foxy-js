import {useValidatedBody} from "h3-zod";
import {z} from "zod";
import {ImageParamsSchema, PartialImageParams} from "@foxyimg/url-builder";
import SampleImages from "@/data/sample-images.json";
import OverlayImages from "@/data/overlay-images.json";
import Foxy from "@/data/foxy.json";
import {foxy} from "@foxyimg/url-builder";

export default defineEventHandler(async (event) => {
	const options = await useValidatedBody(event, z.object({
		imageKey: z.string(),
		params: ImageParamsSchema
	}));

	if (options.imageKey.trim().length === 0) {
		sendError(event, createError({ statusCode: 400, statusMessage: "Image key is required." }));
		return;
	}

	if (!SampleImages.includes(options.imageKey)) {
		sendError(event, createError({ statusCode: 404, statusMessage: "Image not found." }));
		return;
	}

	if (options.params.backgroundRemoval && options.params.backgroundRemoval.imageKey) {
		if (!SampleImages.includes(options.params.backgroundRemoval.imageKey)) {
			sendError(event, createError({ statusCode: 404, statusMessage: "Background removal image not found." }));
			return;
		}
	}

	if (options.params.overlays && options.params.overlays.overlays && options.params.overlays.overlays.length > 0) {
		for(const overlay of options.params.overlays.overlays) {
			if (overlay.type === 'image' && overlay.url) {
				if (!OverlayImages.includes(overlay.url)) {
					sendError(event, createError({ statusCode: 404, statusMessage: "Overlay image not found." }));
					return;
				}
			}
		}
	}

	if (options.params.sizing) {
		if (options.params.sizing.width) {
			options.params.sizing.width = Math.min(options.params.sizing.width, 1920);
		}

		if (options.params.sizing.height) {
			options.params.sizing.height = Math.min(options.params.sizing.height, 1920);
		}
	}

	const url = foxy(Foxy.host, Foxy.source, Foxy.secret, Foxy.imgixMode).buildUrl(options.imageKey, options.params);
	console.log(decodeURIComponent(url));
	return {
		url
	}
});
