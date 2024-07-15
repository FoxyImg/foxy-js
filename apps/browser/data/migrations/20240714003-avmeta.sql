--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
alter table meta add column video_codec text;
alter table meta add column audio_codec text;
alter table meta add column duration real;
alter table meta add column fps real;
alter table meta add column frame_count integer;

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
alter table meta drop column video_codec;
alter table meta drop column audio_codec;
alter table meta drop column duration;
alter table meta drop column fps;
alter table meta drop column frame_count;
