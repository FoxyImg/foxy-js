import type {BaseParam, BuiltParams, ComposableParam} from "../params";
import base64 from "../utils/base-64";

export const OverlayTypeOptions = [
	{ label: 'Image', value: 'image' },
	{ label: 'Text', value: 'text' },
]

export const FitOptions = [
	{ label: 'Fit', value: 'fit' },
	{ label: 'Fill', value: 'fill' },
	{ label: 'Crop', value: 'crop' },
]

export const OverlayBackgroundColorTypeOptions = [
	{ label: 'Color', value: 'color' },
	{ label: 'Dominant', value: 'dom' },
	{ label: 'Lightest', value: 'light' },
	{ label: 'Darkest', value: 'dark' },
]

export type DropShadowParams = BaseParam & {
	opacity: number,
	blur: number,
	color: string,
	offsetX: number,
	offsetY: number,
}

export const DefaultDropShadowParams = {
	enabled: false,
	opacity: 100,
	blur: 3,
	color: '#000000',
	offsetX: 1,
	offsetY: 1,
}

export type OverlaySizeParams = {
	relativeSize: boolean,
	width: number,
	height: number,
	minWidth: number,
	minHeight: number,
	maxWidth: number,
	maxHeight: number,
}

export type OverlayBackgroundParams = BaseParam & OverlaySizeParams & {
	backgroundColor: string,
	backgroundColorType: 'color' | 'dominant' | 'lightest' | 'darkest',
	dominantColorOpacity: number,
	blur: number,
	saturation: number,
	contrast: number,
	brightness: number,
	cornerRadius: number,
	relativePadding: boolean,
	hPadding: number,
	vPadding: number,
	hAlign: 'left'|'center'|'right',
	vAlign: 'top'|'center'|'bottom',
}

export const DefaultOverlayBackgroundParams: OverlayBackgroundParams = {
	enabled: false,
	backgroundColor: "#00000000",
	backgroundColorType: 'color',
	dominantColorOpacity: 100,
	blur: 0,
	saturation: 100,
	contrast: 1,
	brightness: 100,
	cornerRadius: 0,
	relativePadding: false,
	hPadding: 0,
	vPadding: 0,
	hAlign: 'left',
	vAlign: 'top',
	relativeSize: false,
	width: 0,
	height: 0,
	minWidth: 0,
	minHeight: 0,
	maxWidth: 0,
	maxHeight: 0,
}

export type OverlaySubstitutionParam = {
	key: string,
	value: string,
}

type BaseOverlayParams = OverlaySizeParams & {
	type: 'image'|'text'
	text: string|null,
	font: string|null,
	url: string|null,
	opacity: number,
	rotate: number,
	relativeCoords: boolean,
	hPadding: number,
	vPadding: number,
	x: number,
	y: number,
	fit: 'fit' | 'fill' | 'crop',
	hAnchor: 'left'|'center'|'right',
	vAnchor: 'top'|'center'|'bottom',
	textColor: string|null,
	fillColor: string|null,
	strokeColor: string|null,
	strokeWidth: number,
	dropShadow: DropShadowParams,
	background: OverlayBackgroundParams,
	trim: boolean,
}

export type OverlayParams =  BaseOverlayParams & {
	id: string,
	enabled: boolean,

	substitutions: OverlaySubstitutionParam[],
}

export type FoxyOverlayParams = Partial<BaseOverlayParams> & {
	dropShadow?: Partial<DropShadowParams>,
	background?: Partial<OverlayBackgroundParams>,
}

export const DefaultOverlayParams: OverlayParams = {
	id: '',
	type: 'image',
	enabled: true,
	relativeCoords: false,
	hPadding: 0,
	vPadding: 0,
	x: 0,
	y: 0,
	relativeSize: false,
	width: 0,
	height: 0,
	minWidth: 0,
	minHeight: 0,
	maxWidth: 0,
	maxHeight: 0,
	fit: 'fit',
	hAnchor: 'right',
	vAnchor: 'bottom',
	textColor: '#000000',
	fillColor: null,
	strokeColor: null,
	strokeWidth: 0,
	text: null,
	font: null,
	url: null,
	opacity: 100,
	rotate: 0,
	trim: true,
	substitutions: [],
	dropShadow: {...DefaultDropShadowParams},
	background: {...DefaultOverlayBackgroundParams},
}


export const useOverlayParam:ComposableParam<OverlayParams, FoxyOverlayParams> = (prefix?:string) => {
	function buildParams(urlParams: BuiltParams, params:OverlayParams) {
		if ((!params.url || params.url.trim().length === 0) && (!params.text || params.text.trim().length === 0)) {
			return urlParams;
		}

		prefix = prefix ?? 'overlay';

		if (params.url && params.url.trim().length > 0) {
			urlParams[`${prefix}:url`] = base64(params.url, true);
		}

		if (params.text && params.text.trim().length > 0) {
			urlParams[`${prefix}:text`] = base64(params.text, true);
		}

		if (params.type === 'image') {
			if (params.trim) {
				urlParams[`${prefix}:trim`] = null;
			}

			if (params.substitutions.length > 0) {
				for(const substitution of params.substitutions) {
					urlParams[`${prefix}:sub`] = `${base64(substitution.key, true)}:${base64(substitution.value, true)}`;
				}
			}
		}

		if (params.font && params.font.trim().length > 0) {
			urlParams[`${prefix}:font`] = base64(params.font, true);
		}

		if (params.hPadding > 0 || params.vPadding > 0) {
			urlParams[`${prefix}:pad`] = `${params.hPadding}:${params.vPadding}`;
		}

		const coordType = params.relativeCoords ? 'rel' : 'px';

		if (params.x > 0 || params.y > 0) {
			urlParams[`${prefix}:xy`] = `${coordType}:${params.x}:${params.y}`;
		}

		if (params.hAnchor !== 'right' || params.vAnchor !== 'bottom') {
			urlParams[`${prefix}:a`] = `${params.hAnchor}:${params.vAnchor}`;
		}

		const sizeType = params.relativeSize ? 'rel' : 'px';

		if (params.width > 0 || params.height > 0) {
			urlParams[`${prefix}:sz`] = `${sizeType}:${params.width}:${params.height}`;
		}

		if (params.minWidth > 0 || params.minHeight > 0) {
			urlParams[`${prefix}:minsz`] = `${params.minWidth}:${params.minHeight}`;
		}

		if (params.maxWidth > 0 || params.maxHeight > 0) {
			urlParams[`${prefix}:maxsz`] = `${params.maxWidth}:${params.maxHeight}`;
		}

		if (params.opacity !== 100) {
			urlParams[`${prefix}:o`] = `${params.opacity}`;
		}

		if (params.rotate !== 0) {
			urlParams[`${prefix}:rot`] = `${params.rotate}`;
		}

		if (params.type === 'image' && params.fit !== 'fit') {
			urlParams[`${prefix}:fit`] = params.fit;
		}

		if (params.type === 'text' && params.textColor && params.textColor !== '#000000') {
			urlParams[`${prefix}:tc`] = params.textColor.replaceAll('#', '');
		}

		if (params.dropShadow.enabled) {
			if (params.dropShadow.opacity !== 100) {
				urlParams[`${prefix}:ds:o`] = `${params.dropShadow.opacity}`;
			}

			if (params.dropShadow.blur > 0) {
				urlParams[`${prefix}:ds:bl`] = `${params.dropShadow.blur}`;
			}

			urlParams[`${prefix}:ds:c`] = params.dropShadow.color.replaceAll('#', '');

			if (params.dropShadow.offsetX > 0 || params.dropShadow.offsetY > 0) {
				urlParams[`${prefix}:ds:xy`] = `${params.dropShadow.offsetX}:${params.dropShadow.offsetY}`;
			}
		}

		if (params.background.enabled) {
			if (params.background.backgroundColorType !== 'color' || (params.background.backgroundColorType === 'color' && params.background.backgroundColor !== '#00000000')) {
				if (params.background.backgroundColorType === 'color') {
					urlParams[`${prefix}:bg:c`] = params.background.backgroundColor.replaceAll('#', '');
				} else {
					urlParams[`${prefix}:bg:c`] = `${params.background.backgroundColorType}:${params.background.dominantColorOpacity}:${params.background.backgroundColor.replaceAll('#', '')}`;
				}
			}

			if (params.background.blur > 0) {
				urlParams[`${prefix}:bg:bl`] = `${params.background.blur}`;
			}

			if (params.background.saturation !== 100) {
				urlParams[`${prefix}:bg:sat`] = `${params.background.saturation}`;
			}

			if (params.background.contrast !== 100) {
				urlParams[`${prefix}:bg:con`] = `${params.background.contrast}`;
			}

			if (params.background.brightness !== 100) {
				urlParams[`${prefix}:bg:bri`] = `${params.background.brightness}`;
			}

			if (params.background.cornerRadius > 0) {
				urlParams[`${prefix}:bg:br`] = `${params.background.cornerRadius}`;
			}

			const sizeType = params.background.relativeSize ? 'rel' : 'px';

			if (params.background.width > 0 || params.background.height > 0) {
				urlParams[`${prefix}:bg:sz`] = `${sizeType}:${params.background.width}:${params.background.height}`;
			}

			if (params.background.minWidth > 0 || params.background.minHeight > 0) {
				urlParams[`${prefix}:bg:minsz`] = `${params.background.minWidth}:${params.background.minHeight}`;
			}

			if (params.background.maxWidth > 0 || params.background.maxHeight > 0) {
				urlParams[`${prefix}:bg:maxsz`] = `${params.background.maxWidth}:${params.background.maxHeight}`;
			}

			if (params.background.hAlign !== 'center' || params.background.vAlign !== 'center') {
				urlParams[`${prefix}:bg:align`] = `${params.background.hAlign}:${params.background.vAlign}`;
			}

			const paddingType = params.background.relativePadding ? 'rel' : 'px';
			if (params.background.hPadding > 0 || params.background.vPadding > 0) {
				urlParams[`${prefix}:bg:pad`] = `${paddingType}:${params.background.hPadding}:${params.background.vPadding}`;
			}
		}

		return urlParams;
	}

	function importParams(foxyParams:FoxyOverlayParams):OverlayParams {
		return {
			...DefaultOverlayParams,
			...foxyParams,
			dropShadow: {
				...DefaultDropShadowParams,
				...foxyParams.dropShadow,
			},
			background: {
				...DefaultOverlayBackgroundParams,
				...foxyParams.background,
			},
		}
	}

	return {
		buildParams,
		importParams,
	}
}
