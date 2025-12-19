import db from "#db/client";

import { createUser } from "#db/queries/users";
import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const user1 = await createUser("user1", "password1");
  const user2 = await createUser("user2", "password2");

  for (let i = 1; i <= 10; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  const playlist1 = await createPlaylist(
    user1.id,
    "User 1 Playlist",
    "lorem ipsum playlist description"
  );

  const playlist2 = await createPlaylist(
    user2.id,
    "User 2 Playlist",
    "lorem ipsum playlist description"
  );

  for (let trackId = 1; trackId <= 5; trackId++) {
    await createPlaylistTrack(playlist1.id, trackId);
  }

  for (let trackId = 6; trackId <= 10; trackId++) {
    await createPlaylistTrack(playlist2.id, trackId);
  }
}
