const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name of the playlist
    tracks: [{ type: Number }] // Array of track IDs
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist; 