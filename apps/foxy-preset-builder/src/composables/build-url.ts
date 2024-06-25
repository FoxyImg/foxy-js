import {foxy, type PartialImageParams} from "@foxy/url-builder";
import {useFoxyAppStore} from "@/stores/foxy-app-store";
import {storeToRefs} from "pinia";

export default function buildUrl(imageKey: string, params:PartialImageParams) {
		const {
			currentApp,
			currentSource,
		} = storeToRefs(useFoxyAppStore());


		if (!currentApp.value || !currentSource.value || !currentApp.value.url || !currentSource.value.key || !imageKey) {
			return null;
		}

		return foxy(currentApp.value.url, currentSource.value.key,  currentApp.value.signingKey ?? undefined, currentSource.value.imgixMode ?? false, true).buildUrl(imageKey, params);
}