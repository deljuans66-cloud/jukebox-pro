import db from "#db/client";

export async function getPlaylistsByUserId(userId) {
  const { rows } = await db.query(
    `
    SELECT id, user_id, name, description
    FROM playlists
    WHERE user_id = $1
    ORDER BY id;
    `,
    [userId]
  );
  return rows;
}

export async function createPlaylist(userId, name, description) {
  const { rows } = await db.query(
    `
    INSERT INTO playlists (user_id, name, description)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, name, description;
    `,
    [userId, name, description]
  );
  return rows[0];
}

export async function getPlaylistById(id) {
  const { rows } = await db.query(
    `
    SELECT id, user_id, name, description
    FROM playlists
    WHERE id = $1;
    `,
    [id]
  );
  return rows[0] ?? null;
}
