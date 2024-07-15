import {useDatabase} from "~/utils/server/db/db";
import {useValidatedBody} from "h3-zod";
import {z} from "zod";
import path from "node:path";
import {getFileMeta} from "~/utils/server/meta";
import mime from "mime";
import {trailingSlash} from "@foxyimg/utils";

export default defineEventHandler(async (event) => {
	const body = await useValidatedBody(
		event,
		z.object({
			filePath: z.string(),
		})
	);

	const config = useRuntimeConfig();
	const filePath = path.normalize(path.join(config.fileRoot, body.filePath));
	if (!filePath.startsWith(config.fileRoot)) {
		sendError(event, createError({ statusCode: 400, statusMessage: "Invalid file path." }));
		return;
	}

	const db = await useDatabase();

	const mimeType = mime.getType(filePath) ?? null;
	const meta = await getFileMeta(filePath);
	await db.run("insert or replace into meta (path, name, width, height, mimeType, description, copyright, video_codec, audio_codec, duration, fps, frame_count, tags) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		filePath,
		path.basename(filePath),
		meta.width,
		meta.height,
		mimeType,
		meta.description,
		meta.copyright,
		meta.videoCodec,
		meta.audioCodec,
		meta.duration,
		meta.fps,
		meta.frameCount,
		meta.tags.join(','),
	);

	await db.run("delete from cache where path = ?", trailingSlash(path.parse(filePath).dir));
	await db.close();

	return meta;
});//, { maxAge: 5 * 60 });
