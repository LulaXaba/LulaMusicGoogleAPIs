const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
    googleDriveFileId: { type: String, required: true }, // File ID from Google Drive
    trackId: { type: Number, required: true, unique: true }, // Change to Number
    trackName: String,
    artistName: String,
    albumName: String,
    genre: String,
    coverArtUrl: String, // URL for album art
    mimeType: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }, // Timestamp for upload
});

const Track = mongoose.model("Track", trackSchema);
module.exports = Track; 