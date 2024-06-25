import {type BorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const usePaddingParam:ComposableParam<BorderParams> = () => {
	return useAbstractBorderParam('pad');
}
