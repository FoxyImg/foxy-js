import {
	type BuiltParams,
	type DebugParams,
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
import {leadingSlash} from "@/utils/slash-it";

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

export default function buildUrl(host:string, accessKey:string|null, secret:string, imageKey:string, imageParams:ImageParams, debugParams:DebugParams|null = null, preset:boolean = false) {
	const builtParams:BuiltParams = {};

	backgroundRemovalParam.buildParams(builtParams, imageParams.backgroundRemoval);
	sourceCropParam.buildParams(builtParams, imageParams.sourceCrop);
	redactParam.buildParams(builtParams, imageParams.redact);
	sizingParam.buildParams(builtParams, imageParams.sizing);
	paddingParam.buildParams(builtParams, imageParams.padding);
	borderParam.buildParams(builtParams, imageParams.border);
	stylizeParam.buildParams(builtParams, imageParams.stylize);
	rotationParam.buildParams(builtParams, imageParams.rotation);
	adjustmentsParam.buildParams(builtParams, imageParams.adjustments);
	gradientMapParam.buildParams(builtParams, imageParams.gradientMap);
	maskParam.buildParams(builtParams, imageParams.mask);
	exportParam.buildParams(builtParams, imageParams.export);
	overlaysParam.buildParams(builtParams, imageParams.overlays);

	if (imageParams.backgroundColor) {
		builtParams['bg'] = imageParams.backgroundColor;
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


	const url = new URL(host + '/' + accessKey + leadingSlash(imageKey));
	for(const key of Object.keys(builtParams)) {
		url.searchParams.set(key.replaceAll(':', '-'), builtParams[key] ?? "");
	}

	console.log('builtParams', url.toString(), imageParams, builtParams);

	let encodedKey = base64('/'+imageKey, true);
	let newUrl = accessKey ? `/${accessKey}/${encodedKey}` : `/${encodedKey}`;

	for(const key of Object.keys(builtParams)) {
		newUrl += `/${key}:${builtParams[key]}`;
	}

	return host + newUrl + `?_=${new Date().getTime()}&s=`+signHMAC256(secret, newUrl)+(preset ? '&preset': '');
}