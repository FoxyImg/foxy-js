import {type BorderParams, FoxyBorderParams, useAbstractBorderParam} from "./abstract-border";
import type {ComposableParam} from "../params";


export const usePaddingParam:ComposableParam<BorderParams, FoxyBorderParams> = () => {
	return useAbstractBorderParam('pad');
}
