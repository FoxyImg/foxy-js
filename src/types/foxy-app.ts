import type {FoxyPreset} from "@/types/foxy-preset";
import type {FoxySource} from "@/types/foxy-source";

export type FoxyApp = {
	id: string|null,
	name: string,
	url: string|null,
	secret: string|null,
	sources: FoxySource[],
	presets: {
		[key: string]: FoxyPreset,
	},
}

export const DefaultFoxyApp: FoxyApp = {
	id: null,
	name: "Default App",
	url: null,
	secret: null,
	sources: [],
	presets: {},
}
