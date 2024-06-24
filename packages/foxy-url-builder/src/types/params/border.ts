import {type BorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const useBorderParam:ComposableParam<BorderParams> = () => {
	const abstractBorderParam = useAbstractBorderParam('border');

	return {
		buildParams:abstractBorderParam.buildParams,
		importParams:abstractBorderParam.buildParams,
	}
}