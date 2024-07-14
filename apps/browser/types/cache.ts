import type {File} from "./file";

export type CachedDir = {
	expires: number,
	files: File[],
}