import type {PartialImageParams} from "@foxy/url-builder";

export type URLBuilder = (imageKey: string, params:PartialImageParams) => Promise<string|null>;