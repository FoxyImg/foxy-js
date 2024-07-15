--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
create table if not exists meta
(
    path text primary key,
    name text,
    width integer,
    height integer,
    mimeType text,
    description text,
    copyright text,
    tags text
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
drop table if exists meta;