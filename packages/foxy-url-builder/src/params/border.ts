import {type BorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const useBorderParam:ComposableParam<BorderParams> = () => {
	return useAbstractBorderParam('border');
}
