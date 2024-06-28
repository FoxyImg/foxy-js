import {type BorderParams, FoxyBorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const useBorderParam:ComposableParam<BorderParams, FoxyBorderParams> = () => {
	return useAbstractBorderParam('border');
}
