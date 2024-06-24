import {type BorderParams, useAbstractBorderParam} from "@/composables/params/abstract-border";
import type {ComposableParam} from "@/types/params";


export const useBorderParam:ComposableParam<BorderParams> = () => {
	const abstractBorderParam = useAbstractBorderParam('border');

	return {
		buildParams:abstractBorderParam.buildParams,
		importParams:abstractBorderParam.buildParams,
	}
}