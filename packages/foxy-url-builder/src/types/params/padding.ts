import {type BorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const usePaddingParam:ComposableParam<BorderParams> = () => {
	const abstractBorderParam = useAbstractBorderParam('pad');

	return {
		buildParams:abstractBorderParam.buildParams,
		importParams:abstractBorderParam.buildParams,
	}
}