import type {PartialImageParams} from "@foxyimg/url-builder";

export type URLBuilder = (imageKey: string, params:PartialImageParams) => Promise<string|null>;
