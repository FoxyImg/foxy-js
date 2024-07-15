import {foxy, type PartialImageParams} from "@foxyimg/url-builder";
import * as fs from "node:fs";
import {trailingSlash} from "@foxyimg/utils";
import path from "node:path";
import type {File, PreviewUrls} from "~/types/file";
import mime from "mime";
import type {Database} from "sqlite";
import type {H3Event} from "h3";

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

async function getFolderInfo(buildUrl:(imageKey:string, params:PartialImageParams) => string, sourcePath:string):Promise<FolderInfo> {
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

			try {
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
			} catch(ex:any) {
				console.log('ex', ex.message, trailingSlash(sourcePath) + file);
			}

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

export async function dir(event: H3Event, db: Database,sourcePath:string):Promise<File[]> {
	const scheme = getRequestProtocol(event);
	const host = `${scheme}://`+getRequestHost(event);

	const config = useRuntimeConfig();

	const { buildUrl } = foxy(config.foxyHost, config.foxySource, config.foxySecret, config.foxyImgixMode);

	sourcePath = decodeURIComponent(sourcePath);
	const finalPath = path.normalize(path.join(config.fileRoot, sourcePath));
	const files:any = [];
	const foundFiles = fs.readdirSync(finalPath);
	for(const file of foundFiles) {
		if (file.startsWith('.')) {
			continue;
		}

		const filePath = trailingSlash(finalPath) + file;
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			const folderInfo = await getFolderInfo(buildUrl, trailingSlash(sourcePath) + file);

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
				lastModified: stat.mtime.toISOString(),
				created: stat.birthtime.toISOString(),
			});
		} else {
			const ext = path.extname(file).substring(1).toLowerCase();
			if (!validFileExtensions.includes(ext)) {
				continue;
			}

			const mimeType = mime.getType(file) ?? undefined

			let preview: PreviewUrls | undefined = undefined;
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

			const meta = await db.get("select width, height, description, copyright, video_codec, audio_codec, duration, fps, frame_count, tags from meta where path = ?", filePath);

			files.push({
				name: file,
				dir: sourcePath,
				path: trailingSlash(sourcePath) + file,
				type: 'file',
				size: stat.size,
				mimeType,
				preview,
				lastModified: stat.mtime.toISOString(),
				created: stat.birthtime.toISOString(),
				meta: meta ? {
					width: meta.width ?? 0,
					height: meta.height ?? 0,
					description: meta.description,
					copyright: meta.copyright,
					videoCodec: meta.video_codec ?? undefined,
					audioCodec: meta.audio_codec ?? undefined,
					fps: meta.fps ?? undefined,
					frameCount: meta.frame_count ?? undefined,
					duration: meta.duration ?? undefined,
					tags: meta.tags ? meta.tags.split(',') : [],
				} : undefined,
			});
		}
	}
	return files;
}