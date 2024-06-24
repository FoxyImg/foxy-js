import type {App, Plugin} from "vue";
import { foxy } from "@foxy/url-builder"

export { default as FoxyImage } from './components/FoxyImage.vue'
export { default as FoxyDynamicImage } from './components/FoxyDynamicImage.vue'

export type FoxyConfig = {
	host: string;
	sourceId: string;
	secret?: string|undefined;
	imgixMode?: boolean;
	cacheBuster?: boolean;
}

export const FoxyPlugin:Plugin= {
	install: (app:App, options:FoxyConfig) => {
		options = Object.assign({
			imgixMode: true,
			cacheBuster: false
		}, options);

		const { buildUrl } = foxy(options.host, options.sourceId, options.secret, options.imgixMode, options.cacheBuster);
		app.provide("foxy", buildUrl);
	}
}
