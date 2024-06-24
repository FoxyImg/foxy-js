import {type BorderParams, useAbstractBorderParam} from "@/composables/params/abstract-border";
import type {ComposableParam} from "@/types/params";


export const usePaddingParam:ComposableParam<BorderParams> = () => {
	const abstractBorderParam = useAbstractBorderParam('pad');

	return {
		buildParams:abstractBorderParam.buildParams,
		importParams:abstractBorderParam.buildParams,
	}
}