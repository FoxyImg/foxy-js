import type {BaseParam, BuiltParams, ComposableParam, ImageParams} from "@/types/params";

export type BoxCropParams = {
	index: number,
	hGravity: 'left' | 'center' | 'right',
	vGravity: 'top' | 'center' | 'bottom',
	padding: number,
	zoom: number,
	focus: boolean,
}

export type SizingParams = BaseParam & {
	crop: string[],
	width: number,
	height: number,
	aspectRatioWidth: number,
	aspectRatioHeight: number,
	zoom: number,
	smartMode: string|null,
	hGravity: string,
	vGravity: string,
	focalPoint: { x: number, y: number },
	focalPointZoom: number,

	face: BoxCropParams,
	person: BoxCropParams,
}

export const DefaultSizingParams: SizingParams = {
	enabled: true,

	crop: [],
	width: 0,
	height: 0,
	aspectRatioWidth: 0,
	aspectRatioHeight: 0,
	zoom: 1,
	smartMode: null,
	hGravity: 'center',
	vGravity: 'center',
	focalPoint: { x: 0.5, y: 0.5 },
	focalPointZoom: 0,

	face: {
		index: -1,
		hGravity: 'center',
		vGravity: 'top',
		padding: 8,
		zoom: 0,
		focus: false,
	},

	person: {
		index: -1,
		hGravity: 'center',
		vGravity: 'center',
		padding: 0,
		zoom: 0,
		focus: false,
	},
}

export const useSizingParam:ComposableParam<SizingParams> = () => {
	function processBoxParams(urlParams:BuiltParams, noun:string, params:BoxCropParams){
		if (params.padding != 8) {
			urlParams[`${noun}:pad`] = params.padding.toFixed(0);
		}

		if (params.index > -1) {
			urlParams[`${noun}:index`] = params.index.toFixed(0);
		} else if (params.index < -1) {
			if (params.index === -2) {
				urlParams[`${noun}:index`] = 'largest';
			} else {
				urlParams[`${noun}:index`] = 'smallest';
			}
		}

		if (params.zoom > 0) {
			urlParams[`${noun}:zoom`] = params.zoom.toFixed(0);
		}

		if (params.vGravity !== 'top' || params.hGravity !== 'center') {
			urlParams[`${noun}:gravity`] = `${params.hGravity}:${params.vGravity}`;
		}

		if (params.focus) {
			urlParams[`${noun}:focus`] = null;
		}
	}

	function buildParams(urlParams: BuiltParams, params:SizingParams) {
		if (!params.enabled) {
			return urlParams;
		}

		if (params.width > 0 && params.height > 0) {
			urlParams['d'] = [params.width, params.height].join(":");
		} else if (params.width > 0) {
			urlParams['w'] = params.width.toFixed(0);
		} else if (params.height > 0) {
			urlParams['h'] = params.height.toFixed(0);
		}

		if (params.crop.length > 0) {
			urlParams['crop'] = params.crop.join(':');
		}

		if (params.crop.includes('smart') && params.smartMode) {
			urlParams['smart'] = params.smartMode;
		}

		if (params.aspectRatioWidth > 0 && params.aspectRatioHeight > 0) {
			urlParams['ar'] = [params.aspectRatioWidth,params.aspectRatioHeight].join(":");
		}

		if (params.zoom > 1) {
			urlParams['zoom'] = params.zoom.toFixed(2);
		}

		if (params.hGravity || params.vGravity) {
			const hg = params.hGravity ?? 'center';
			const vg = params.vGravity ?? 'center';

			let gravity = `${hg}:${vg}`;
			gravity = gravity === 'center:center' ? 'center' : gravity;

			if (gravity !== 'center') {
				urlParams['gravity'] = gravity;
			}
		}

		if (params.crop.includes('face')) {
			processBoxParams(urlParams, 'face', params.face);
		}

		if (params.crop.includes('person')) {
			processBoxParams(urlParams, 'person', params.person);
		}

		if (params.crop.includes('focus')) {
			const fpx = params.focalPoint.x.toFixed(4);
			const fpy = params.focalPoint.y.toFixed(4);
			urlParams['fp'] = `${fpx}:${fpy}`;

			if (params.focalPointZoom > 0) {
				urlParams['fp:zoom'] = `${params.focalPointZoom}`;
			}
		}

		return urlParams;
	}

	function importParams(foxyParams:any, params:SizingParams) {
	}

	return {
		buildParams,
		importParams,
	}
}