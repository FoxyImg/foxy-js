import {foxy, type PartialImageParams} from "@foxyimg/url-builder";
import * as fs from "node:fs";
import {trailingSlash} from "@foxyimg/utils";
import * as path from "node:path";
import type {File, PreviewUrls} from "~/types/file";
import mime from "mime";

const validVideoExtensions = ['mp4', 'mov', 'm2v', 'mkv'];
const validImageExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp'];
const validFileExtensions = [...validImageExtensions, ...validVideoExtensions];

function getFolderPreviews(buildUrl:(imageKey:string, params:PartialImageParams) => string, sourcePath:string):PreviewUrls[]|undefined {
	const config = useRuntimeConfig();
	const finalPath = trailingSlash(config.fileRoot) + sourcePath;
	const images:PreviewUrls[] = [];

	const foundFiles = fs.readdirSync(finalPath);
	for(const file of foundFiles) {
		if (file.startsWith('.')) {
			continue;
		}

		const filePath = finalPath + '/' + file;
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			continue;
		}

		const ext = path.extname(file).substring(1).toLowerCase();
		if (!validFileExtensions.includes(ext)) {
			continue;
		}

		const mimeType = mime.getType(file) ?? undefined

		if (validVideoExtensions.includes(ext)) {
			images.push({
				mimeType,
				small: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 64,
						height: 64,
						crop: ['fill']
					},
					video: {
						type: 'frame',
						frameType: 'rel',
						time: 50,
					}
				}),
				large: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 128,
						height: 128,
						crop: ['fill']
					},
					video: {
						type: 'frame',
						frameType: 'rel',
						time: 50,
					}
				}),
				xl: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 256,
						height: 256,
						crop: ['fill']
					},
					video: {
						type: 'frame',
						frameType: 'rel',
						time: 50,
					}
				}),
			});
		} else {
			images.push({
				mimeType,
				small: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 64,
						height: 64,
						crop: ['fill']
					}
				}),
				large: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 128,
						height: 128,
						crop: ['fill']
					}
				}),
				xl: buildUrl(trailingSlash(sourcePath) + file, {
					sizing: {
						width: 256,
						height: 256,
						crop: ['fill']
					}
				}),
			});
		}

		if (images.length >= 4) {
			return images;
		}
	}

	return images.length === 0 ? undefined : images;
}

export function dir(sourcePath:string):File[] {
	console.log('dir', sourcePath);

	const config = useRuntimeConfig();

	const { buildUrl } = foxy(config.foxyHost, config.foxySource, config.foxySecret, config.foxyImgixMode);

	sourcePath = decodeURIComponent(sourcePath);
	const finalPath = trailingSlash(config.fileRoot) + sourcePath;
	const files:any = [];
	fs.readdirSync(finalPath).forEach((file) => {
		if (file.startsWith('.')) {
			return;
		}

		const filePath = finalPath + '/' + file;
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			console.log('dir', trailingSlash(sourcePath) + file);

			const folderPreviews = getFolderPreviews(buildUrl,trailingSlash(sourcePath) + file);

			files.push({
				name: file,
				path: trailingSlash(sourcePath) + file,
				type: 'dir',
				size: 0,
				folderPreviews,
				lastModified: stat.mtime.getTime(),
			});
		} else {
			const ext = path.extname(file).substring(1).toLowerCase();
			if (!validFileExtensions.includes(ext)) {
				return;
			}

			const mimeType = mime.getType(file) ?? undefined

			let preview: PreviewUrls|undefined = undefined;
			if (validVideoExtensions.includes(ext)) {
				preview = {
					mimeType,
					small: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 384,
							height: 384,
							crop: ['fit']
						},
						video: {
							type: 'frame',
							frameType: 'rel',
							time: 50,
						}
					}),
					large: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 768,
							height: 768,
							crop: ['fit']
						},
						video: {
							type: 'frame',
							frameType: 'rel',
							time: 50,
						}
					}),
					xl: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 1920,
							height: 1920,
							crop: ['fit']
						},
						video: {
							type: 'frame',
							frameType: 'rel',
							time: 50,
						}
					}),
				};
			} else {
				preview = {
					mimeType,
					small: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 384,
							height: 384,
							crop: ['fit']
						}
					}),
					large: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 768,
							height: 768,
							crop: ['fit']
						}
					}),
					xl: buildUrl(trailingSlash(sourcePath) + file, {
						sizing: {
							width: 1920,
							height: 1920,
							crop: ['fit']
						}
					}),
				};
			}

			files.push({
				name: file,
				path: trailingSlash(sourcePath) + file,
				type: 'file',
				size: stat.size,
				mimeType,
				preview,
				lastModified: stat.mtime.getTime(),
			});
		}
	});

	return files;
}