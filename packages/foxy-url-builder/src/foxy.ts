import {useSourceCropParam} from "./params/source-crop";
import {useSizingParam} from "./params/sizing";
import {useBackgroundRemovalParam} from "./params/background-removal";
import {useRotationParam} from "./params/rotation";
import {useAdjustmentsParam} from "./params/adjustments";
import {useStylizeParam} from "./params/stylize";
import {useGradientMapParam} from "./params/gradient-map";
import {usePaddingParam} from "./params/padding";
import {useBorderParam} from "./params/border";
import {useMaskParam} from "./params/mask";
import {useRedactParam} from "./params/redact";
import {useExportParam} from "./params/export";
import {useOverlaysParam} from "./params/overlays";
import {useLevelsParam} from "./params/levels";
import {type BuiltParams, getImageParams, type PartialImageParams} from "./params";
import {leadingSlash, trimStartingSlash} from "./utils/slash-it";
import signHMAC256 from "./utils/sign";
import base64 from "./utils/base-64";

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

export function foxy(host:string, accessKey:string, secret:string|undefined = undefined, imgixMode:boolean = false, cacheBuster:boolean = false) {
	const buildUrl = (imageKey:string, params:PartialImageParams) => {
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

		if (imgixMode) {
			const url = new URL(host + '/' + accessKey + leadingSlash(imageKey));
			const sigParams:string[] = [];

			for(const key of Object.keys(builtParams)) {
				sigParams.push(`${key.replaceAll(':', '-')}=${builtParams[key]??''}`);
				url.searchParams.set(key.replaceAll(':', '-'), builtParams[key] ?? "");
			}

			if (secret) {
				sigParams.sort((a, b) => a.localeCompare(b));
				const sigParamsStr = trimStartingSlash(decodeURI(imageKey).replaceAll('%2C', ',')) + '?' + sigParams.join('&');
				const sig = signHMAC256(secret, sigParamsStr);

				url.searchParams.set('s', sig);
			}

			if (params.showPreset) {
				url.searchParams.set('showpreset', '');
			}

			if (cacheBuster) {
				url.searchParams.set('_', Date.now().toString());
			}

			return url.toString();
		} else {
			const encodedKey = base64('/'+imageKey, true);
			let newUrl = accessKey ? `/${accessKey}/${encodedKey}` : `/${encodedKey}`;

			for(const key of Object.keys(builtParams)) {
				newUrl += builtParams[key] === null || builtParams[key] === '' ? `/${key}` : `/${key}:${builtParams[key]}`;
			}

			const queryString:string[] = [];

			if (secret) {
				queryString.push('s='+signHMAC256(secret, newUrl));
			}

			if (params.showPreset) {
				queryString.push('showpreset');
			}

			if (cacheBuster) {
				queryString.push('_='+Date.now().toString());
			}

			let url =  host + newUrl;
			if (queryString.length > 0) {
				url += '?' + queryString.join('&');
			}

			return url;
		}
	}

	return {
		buildUrl,
	}
}
