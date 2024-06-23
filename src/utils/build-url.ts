import {
	type BuiltParams,
	type DebugParams, getImageParams,
	type ImageParams
} from "@/types/params";
import signHMAC256 from "@/utils/sign";
import base64 from "@/utils/base-64";
import {useSourceCropParam} from "@/composables/params/source-crop";
import {useSizingParam} from "@/composables/params/sizing";
import {useBackgroundRemovalParam} from "@/composables/params/background-removal";
import {useRotationParam} from "@/composables/params/rotation";
import {useAdjustmentsParam} from "@/composables/params/adjustments";
import {useStylizeParam} from "@/composables/params/stylize";
import {useGradientMapParam} from "@/composables/params/gradient-map";
import {usePaddingParam} from "@/composables/params/padding";
import {useBorderParam} from "@/composables/params/border";
import {useMaskParam} from "@/composables/params/mask";
import {useRedactParam} from "@/composables/params/redact";
import {useExportParam} from "@/composables/params/export";
import {useOverlaysParam} from "@/composables/params/overlays";
import {leadingSlash, trimStartingSlash} from "@/utils/slash-it";
import type {DeepPartial} from "@/types/deep-partial";
import {useLevelsParam} from "@/composables/params/levels";

const sourceCropParam = useSourceCropParam();
const sizingParam = useSizingParam();
const backgroundRemovalParam = useBackgroundRemovalParam();
const rotationParam = useRotationParam();
const adjustmentsParam  = useAdjustmentsParam();
const stylizeParam = useStylizeParam();
const gradientMapParam = useGradientMapParam();
const paddingParam = usePaddingParam()
const borderParam = useBorderParam()
const maskParam = useMaskParam();
const redactParam = useRedactParam();
const exportParam = useExportParam()
const overlaysParam = useOverlaysParam();
const levelsParam = useLevelsParam();

export default function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, params:DeepPartial<ImageParams>, debugParams:DebugParams|null = null, preset:boolean = false, imgixMode:boolean = false) {
	const builtParams:BuiltParams = {};

	const imageParams = getImageParams(params);

	backgroundRemovalParam.buildParams(builtParams, imageParams.backgroundRemoval);
	sourceCropParam.buildParams(builtParams, imageParams.sourceCrop);
	redactParam.buildParams(builtParams, imageParams.redact);
	sizingParam.buildParams(builtParams, imageParams.sizing);
	paddingParam.buildParams(builtParams, imageParams.padding);
	borderParam.buildParams(builtParams, imageParams.border);
	stylizeParam.buildParams(builtParams, imageParams.stylize);
	rotationParam.buildParams(builtParams, imageParams.rotation);
	adjustmentsParam.buildParams(builtParams, imageParams.adjustments);
	levelsParam.buildParams(builtParams, imageParams.levels);
	gradientMapParam.buildParams(builtParams, imageParams.gradientMap);
	maskParam.buildParams(builtParams, imageParams.mask);
	exportParam.buildParams(builtParams, imageParams.export);
	overlaysParam.buildParams(builtParams, imageParams.overlays);

	if (imageParams.backgroundColor) {
		builtParams['bg'] = imageParams.backgroundColor;
	}

	if (imageParams.metaOnly) {
		builtParams['meta'] = null;
	}

	//region Debug Params
	const debug:string[] = [];

	if (debugParams) {
		if (debugParams.faces) {
			debug.push('faces');
		}

		if (debugParams.allFaces) {
			debug.push('all-faces');
		}

		if (debugParams.people) {
			debug.push('people');
		}

		if (debugParams.allPeople) {
			debug.push('all-people');
		}

		if (debugParams.otherLabels) {
			debug.push('other-labels');
		}

		if (debug.length > 0) {
			builtParams['debug'] = debug.join(':');
		}

		const nocache:string[] = [];

		if (debugParams.disableSourceCache) {
			nocache.push('source');
		}

		if (debugParams.disableMetaCache) {
			nocache.push('meta');
		}

		if (debugParams.disableRenderCache) {
			nocache.push('render');
		}

		if (nocache.length > 0) {
			builtParams['nocache'] = nocache.join(':');
		}
	}

	//endregion


	if (imgixMode) {
		const url = new URL(host + '/' + accessKey + leadingSlash(imageKey));
		const sigParams:string[] = [];

		for(const key of Object.keys(builtParams)) {
			sigParams.push(`${key.replaceAll(':', '-')}=${builtParams[key]??''}`);
			url.searchParams.set(key.replaceAll(':', '-'), builtParams[key] ?? "");
		}

		sigParams.sort((a, b) => a.localeCompare(b));
		const sigParamsStr = trimStartingSlash(decodeURI(imageKey).replaceAll('%2C', ',')) + '?' + sigParams.join('&');
		console.log('sigParamsStr', sigParamsStr);
		const sig = signHMAC256(secret, sigParamsStr);

		if (preset) {
			url.searchParams.set('showpreset', '');
		}

		url.searchParams.set('s', sig);
		url.searchParams.set('_', new Date().getTime().toString());
		return url.toString();
	} else {
		let encodedKey = base64('/'+imageKey, true);
		let newUrl = accessKey ? `/${accessKey}/${encodedKey}` : `/${encodedKey}`;

		for(const key of Object.keys(builtParams)) {
			if (builtParams[key] === null || builtParams[key] === '') {
				newUrl += `/${key}`;
			} else {
				newUrl += `/${key}:${builtParams[key]}`;
			}
		}

		return host + newUrl + `?_=${new Date().getTime()}&s=`+signHMAC256(secret, newUrl)+(preset ? '&showpreset': '');
	}
}