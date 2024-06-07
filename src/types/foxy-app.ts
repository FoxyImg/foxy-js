import type {FoxyPreset} from "@/types/foxy-preset";
import type {FoxySource} from "@/types/foxy-source";

export type FoxyApp = {
	id: string|null,
	name: string,
	url: string|null,
	signingKey: string|null,
	sources: FoxySource[],
	presets: {
		[key: string]: FoxyPreset,
	},
}

export const DefaultFoxyApp: FoxyApp = {
	id: null,
	name: "Default App",
	url: null,
	signingKey: null,
	sources: [],
	presets: {},
}
