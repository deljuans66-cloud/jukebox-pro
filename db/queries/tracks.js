import db from "#db/client";

export async function createTrack(name, durationMs) {
  const sql = `
  INSERT INTO tracks
    (name, duration_ms)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [track],
  } = await db.query(sql, [name, durationMs]);
  return track;
}

export async function getTracks() {
  const sql = `
  SELECT *
  FROM tracks
  `;
  const { rows: tracks } = await db.query(sql);
  return tracks;
}

import db from "#db/client";

export async function getTracksForPlaylist(playlistId) {
  const { rows } = await db.query(
    `
    SELECT t.id, t.name, t.duration_ms
    FROM playlists_tracks pt
    JOIN tracks t ON t.id = pt.track_id
    WHERE pt.playlist_id = $1
    ORDER BY t.id;
    `,
    [playlistId]
  );
  return rows;
}

export async function getTracksByPlaylistId(id) {
  const sql = `
  SELECT tracks.*
  FROM
    tracks
    JOIN playlists_tracks ON playlists_tracks.track_id = tracks.id
    JOIN playlists ON playlists.id = playlists_tracks.playlist_id
  WHERE playlists.id = $1
  `;
  const { rows: tracks } = await db.query(sql, [id]);
  return tracks;
}

export async function getTrackById(id) {
  const sql = `
  SELECT *
  FROM tracks
  WHERE id = $1
  `;
  const {
    rows: [track],
  } = await db.query(sql, [id]);
  return track;
}

export async function getUserPlaylistsContainingTrack(userId, trackId) {
  const { rows } = await db.query(
    `
    SELECT p.id, p.user_id, p.name, p.description
    FROM playlists p
    JOIN playlists_tracks pt ON pt.playlist_id = p.id
    WHERE p.user_id = $1 AND pt.track_id = $2
    ORDER BY p.id;
    `,
    [userId, trackId]
  );
  return rows;
}
