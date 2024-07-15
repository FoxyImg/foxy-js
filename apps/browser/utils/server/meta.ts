import {exiftool} from "exiftool-vendored";

export async function getFileMeta(path:string):Promise<any> {
	const meta = await exiftool.read(path);

	let tags = meta.Keywords ?? [];
	if (!Array.isArray(tags)) {
		tags = [tags];
	}

	return {
		width: meta.ImageWidth ?? 0,
		height: meta.ImageHeight ?? 0,
		copyright: meta.Copyright ?? null,
		description: meta.ImageDescription ?? null,
		duration: meta.Duration ?? null,
		videoCodec: meta.VideoCodec ?? null,
		audioCodec: meta.AudioCodec ?? null,
		fps: meta.FrameRate ?? null,
		frameCount: meta.VideoFrameCount ?? meta.FrameCount ?? null,
		tags
	}
}