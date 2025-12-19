import express from "express";
import { requireUser } from "../auth/middleware.js";

import {
  getPlaylistsByUserId,
  createPlaylist,
  getPlaylistById,
} from "#db/queries/playlists";
import { getTracksForPlaylist } from "#db/queries/playlists_tracks";

const router = express.Router();

// 🔒 all playlists routes require login
router.use(requireUser);

// GET /playlists (owned by user)
router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylistsByUserId(req.user.id);
    res.json(playlists);
  } catch (err) {
    next(err);
  }
});

// POST /playlists (create owned by user)
router.post("/", async (req, res, next) => {
  try {
    const { name, description } = req.body ?? {};
    if (!name || !description) {
      return res.status(400).json({ error: "name and description required" });
    }

    const playlist = await createPlaylist(req.user.id, name, description);
    res.status(201).json(playlist);
  } catch (err) {
    next(err);
  }
});

// helper: load + ownership check
async function loadOwnedPlaylist(req, res, next) {
  const playlist = await getPlaylistById(req.params.id);
  if (!playlist) return res.status(404).json({ error: "playlist not found" });
  if (playlist.user_id !== req.user.id)
    return res.status(403).json({ error: "forbidden" });
  req.playlist = playlist;
  next();
}

// GET /playlists/:id (403 if not owner)
router.get("/:id", async (req, res, next) => {
  try {
    await loadOwnedPlaylist(req, res, () => res.json(req.playlist));
  } catch (err) {
    next(err);
  }
});

// GET /playlists/:id/tracks (403 if not owner)
router.get("/:id/tracks", async (req, res, next) => {
  try {
    await loadOwnedPlaylist(req, res, async () => {
      const tracks = await getTracksForPlaylist(req.playlist.id);
      res.json(tracks);
    });
  } catch (err) {
    next(err);
  }
});

export default router;
