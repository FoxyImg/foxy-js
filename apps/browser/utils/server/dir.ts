import {foxy, type PartialImageParams} from "@foxyimg/url-builder";
import * as fs from "node:fs";
import {trailingSlash} from "@foxyimg/utils";
import * as path from "node:path";
import type {File, PreviewUrls} from "~/types/file";
import mime from "mime";

const validVideoExtensions = ['mp4', 'mov', 'm2v', 'mkv'];
const validImageExtensions = ['svg', 'png', 'jpg', 'jpeg', 'webp'];
const validFileExtensions = [...validImageExtensions, ...validVideoExtensions];

type FolderInfo = {
	dirCount: number,
	imageCount: number,
	videoCount: number,
	otherCount: number,
	images?: PreviewUrls[],
}

function getFolderInfo(buildUrl:(imageKey:string, params:PartialImageParams) => string, sourcePath:string):FolderInfo {
	const config = useRuntimeConfig();
	const finalPath = trailingSlash(config.fileRoot) + sourcePath;
	const images:PreviewUrls[] = [];

	let dirCount = 0;
	let imageCount = 0;
	let videoCount = 0;
	let otherCount = 0;

	const foundFiles = fs.readdirSync(finalPath);
	for(const file of foundFiles) {
		if (file.startsWith('.')) {
			continue;
		}

		const filePath = finalPath + '/' + file;
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			dirCount++;
			continue;
		}

		const ext = path.extname(file).substring(1).toLowerCase();
		if (!validFileExtensions.includes(ext)) {
			otherCount++;
			continue;
		}

		const mimeType = mime.getType(file) ?? undefined

		if (validVideoExtensions.includes(ext)) {
			videoCount++;
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
			imageCount++;

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
	}

	return {
		dirCount,
		imageCount,
		videoCount,
		otherCount,
		images: images.length === 0 ? undefined : images
	};
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

			const folderInfo = getFolderInfo(buildUrl,trailingSlash(sourcePath) + file);

			files.push({
				name: file,
				path: trailingSlash(sourcePath) + file,
				type: 'dir',
				size: 0,
				subdirs: folderInfo.dirCount,
				images: folderInfo.imageCount,
				videos: folderInfo.videoCount,
				other: folderInfo.otherCount,
				folderPreviews: folderInfo.images,
				lastModified: stat.mtime,
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
				dir: sourcePath,
				path: trailingSlash(sourcePath) + file,
				type: 'file',
				size: stat.size,
				mimeType,
				preview,
				lastModified: stat.mtime,
			});
		}
	});

	return files;
}