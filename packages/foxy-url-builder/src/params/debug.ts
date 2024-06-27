import type {BaseParam, BuiltParams, ComposableParam} from "../params";

type BaseDebugParams = {
	faces: boolean,
	allFaces: boolean,
	people: boolean,
	allPeople: boolean,
	otherLabels: boolean,

	disableSourceCache: boolean,
	disableMetaCache: boolean,
	disableRenderCache: boolean,
}

export type DebugParams = BaseParam & BaseDebugParams;
export type FoxyDebugParams = Partial<BaseDebugParams>;

export const DefaultDebugParams: DebugParams = {
	enabled: true,

	faces: false,
	allFaces: false,
	people: false,
	allPeople: false,
	otherLabels: false,

	disableSourceCache: false,
	disableMetaCache: false,
	disableRenderCache: false,
}

export const useDebugParam:ComposableParam<DebugParams, FoxyDebugParams> = () => {
	function buildParams(urlParams: BuiltParams, params:DebugParams) {
		const debug:string[] = [];

		if (params.faces) {
			debug.push('faces');
		}

		if (params.allFaces) {
			debug.push('all-faces');
		}

		if (params.people) {
			debug.push('people');
		}

		if (params.allPeople) {
			debug.push('all-people');
		}

		if (params.otherLabels) {
			debug.push('other-labels');
		}

		if (debug.length > 0) {
			urlParams['debug'] = debug.join(':');
		}

		const nocache:string[] = [];

		if (params.disableSourceCache) {
			nocache.push('source');
		}

		if (params.disableMetaCache) {
			nocache.push('meta');
		}

		if (params.disableRenderCache) {
			nocache.push('render');
		}

		if (nocache.length > 0) {
			urlParams['nocache'] = nocache.join(':');
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyDebugParams):DebugParams {
		return {
			...DefaultDebugParams,
			...foxyParams,
		}
	}

	return {
		buildParams,
		importParams,
	}
}
