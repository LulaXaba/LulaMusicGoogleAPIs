// routes/musicRoutes.js
const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
    createPlaylist,
    addTrack,
    listAllPlaylists,
    getPlaylist,
    removeTrack,
    deletePlaylist,
    addTrackToFavorites,
    listUserFavorites,
    removeTrackFromFavorites
} = require("../controllers/musicController");

const router = express.Router();

router.post("/playlist", authenticateToken, createPlaylist);
router.post("/playlist/add", authenticateToken, addTrack);
router.get("/playlists", authenticateToken, listAllPlaylists);
router.get("/playlist/:playlistId", authenticateToken, getPlaylist);
router.post("/playlist/remove", authenticateToken, removeTrack);
router.delete("/playlist", authenticateToken, deletePlaylist);

// Favorites routes
router.post("/favorites", authenticateToken, addTrackToFavorites); // Add track to favorites
router.get("/favorites/:userId", authenticateToken, listUserFavorites); // List user's favorites
router.delete("/favorites", authenticateToken, removeTrackFromFavorites); // Remove track from favorites

module.exports = router;
