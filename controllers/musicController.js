// controllers/musicController.js
const { listFiles, streamFile, uploadFile, downloadFile } = require("../services/driveService");
const {
    createPlaylist: createPlaylistService,
    addToFavorites: addToFavoritesService,
    addTrackToPlaylist: addTrackToPlaylistService,
    listPlaylists,
    getPlaylistById,
    removeTrackFromPlaylist: removeTrackFromPlaylistService,
    deletePlaylistById, // Corrected import for deletion
    addToFavorites,
    listFavorites,
    removeFromFavorites,
} = require("../services/musicService");
const { v4: uuidv4 } = require("uuid"); // Import UUID
const { refreshAccessToken } = require("../config/googleAuth"); // Import refreshAccessToken
const Track = require("../models/Track"); // Ensure this line is present
const { google } = require("googleapis"); // Add this line
const { oAuth2Client } = require("../config/googleAuth"); // Add this line

const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

async function listAllFiles(req, res) {
    try {
        const files = await listFiles();
        res.json(files);
    } catch (error) {
        res.status(500).send("Error listing files");
    }
}

async function streamMusicFile(req, res) {
    const { trackId } = req.params;
    console.log("Streaming track with ID:", trackId);

    const numericTrackId = Number(trackId);
    if (isNaN(numericTrackId)) {
        return res.status(400).send("Invalid track ID format. It must be a number.");
    }

    try {
        const track = await Track.findOne({ trackId: numericTrackId });
        console.log("Track from DB:", track);

        if (!track) {
            return res.status(404).send("Track not found");
        }

        const drive = google.drive({ version: "v3", auth: oAuth2Client });
        const fileStream = await drive.files.get({
            fileId: track.googleDriveFileId,
            alt: "media",
        }, { responseType: "stream" });

        res.setHeader("Content-Type", track.mimeType);
        res.setHeader("Content-Disposition", "inline");

        fileStream.data
            .on("end", () => {
                console.log("Done streaming file.");
            })
            .on("error", (err) => {
                console.error("Error streaming file:", err);
                res.status(500).send("Error streaming file");
            })
            .pipe(res);
    } catch (error) {
        console.error("Error streaming music file:", error);
        res.status(500).send("Error streaming music file");
    }
}

async function uploadMusicFile(req, res) {
    const file = req.file;
    const { trackName, artistName, albumName, genre, coverArtUrl } = req.body;

    if (!file || !trackName || !artistName || !albumName || !genre || !coverArtUrl) {
        return res.status(400).send("All fields are required.");
    }

    const trackId = Math.floor(Math.random() * 1000000);

    try {
        await refreshAccessToken();

        const result = await uploadFile(file, {
            trackId,
            trackName,
            artistName,
            albumName,
            genre,
            coverArtUrl,
            mimeType: file.mimetype,
        });
        res.status(201).json(result);
    } catch (error) {
        console.error("Upload error in uploadMusicFile:", error);
        res.status(500).send("Error uploading file");
    }
}

async function downloadMusicFile(req, res) {
    const { fileId } = req.params;
    console.log("Attempting to download file with ID:", fileId);

    try {
        const track = await Track.findOne({ googleDriveFileId: fileId });
        if (!track) {
            console.log("Track not found in database for fileId:", fileId);
            return res.status(404).send("Track not found");
        }

        const drive = google.drive({ version: "v3", auth: oAuth2Client });

        const fileStream = await drive.files.get({
            fileId: track.googleDriveFileId,
            alt: "media",
        }, { responseType: "stream" });

        res.setHeader("Content-Disposition", `attachment; filename="${track.trackName}.mp3"`);
        res.setHeader("Content-Type", track.mimeType);

        fileStream.data
            .on("end", () => {
                console.log("Done downloading file.");
            })
            .on("error", (err) => {
                console.error("Error downloading file:", err);
                res.status(500).send("Error downloading file");
            })
            .pipe(res);
    } catch (error) {
        console.error("Error downloading music file:", error);
        res.status(500).send("Error downloading music file");
    }
}

async function createPlaylist(req, res) {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send("Playlist name is required");
    }
    try {
        const playlist = await createPlaylistService(name);
        console.log("Successfully created playlist:", playlist);
        res.status(201).json(playlist);
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).send("Error creating playlist");
    }
}

// async function addToFavorites(req, res) {
//     const { trackId } = req.body;
//     try {
//         const result = await addToFavoritesService(trackId);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).send("Error adding to favorites");
//     }
// }

async function addTrack(req, res) {
    const { playlistId, trackId } = req.body;
    if (!playlistId || !trackId) {
        return res.status(400).send("Both playlistId and trackId are required");
    }
    try {
        const updatedPlaylist = await addTrackToPlaylistService(playlistId, trackId);
        console.log("Successfully added track to playlist:", updatedPlaylist);
        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error("Error adding track to playlist:", error);
        res.status(500).send(error.message);
    }
}

async function listAllPlaylists(req, res) {
    try {
        const playlists = await listPlaylists();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).send("Error retrieving playlists");
    }
}

async function getPlaylist(req, res) {
    const { playlistId } = req.params;
    try {
        const playlist = await getPlaylistById(Number(playlistId));
        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function removeTrack(req, res) {
    const { playlistId, trackId } = req.body;
    if (!playlistId || !trackId) {
        return res.status(400).send("Both playlistId and trackId are required");
    }
    try {
        const updatedPlaylist = await removeTrackFromPlaylistService(playlistId, trackId);
        console.log("Successfully removed track from playlist:", updatedPlaylist);
        res.status(200).json(updatedPlaylist);
    } catch (error) {
        console.error("Error removing track from playlist:", error);
        res.status(500).send(error.message);
    }
}

async function deletePlaylist(req, res) {
    const { playlistId } = req.body;
    if (!playlistId) {
        return res.status(400).send("Playlist ID is required");
    }
    try {
        const result = await deletePlaylistById(playlistId);
        console.log("Successfully deleted playlist:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting playlist:", error);
        res.status(500).send(error.message);
    }
}

async function addTrackToFavorites(req, res) {
    const { userId, trackId } = req.body;
    if (!userId || !trackId) {
        return res.status(400).send("Both userId and trackId are required");
    }
    try {
        const result = await addToFavorites(userId, trackId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error adding track to favorites:", error);
        res.status(500).send("Error adding track to favorites");
    }
}

async function listUserFavorites(req, res) {
    const { userId } = req.params;
    try {
        const favorites = await listFavorites(userId);
        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error retrieving favorite tracks:", error);
        res.status(500).send("Error retrieving favorite tracks");
    }
}

async function removeTrackFromFavorites(req, res) {
    const { userId, trackId } = req.body;
    if (!userId || !trackId) {
        return res.status(400).send("Both userId and trackId are required");
    }
    try {
        const result = await removeFromFavorites(userId, trackId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error removing track from favorites:", error);
        res.status(500).send("Error removing track from favorites");
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    try {
        const user = await authenticateUser(email, password);
        console.log("User authenticated:", user);

        const token = generateToken({ userId: user._id });
        console.log("Generated token:", token);

        // Set the JWT as a cookie
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Set cookie options as needed
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(401).json({ message: error.message });
    }
}

module.exports = {
    listAllFiles,
    streamMusicFile,
    uploadMusicFile,
    downloadMusicFile,
    createPlaylist,
    addToFavorites,
    addTrack,
    listAllPlaylists,
    getPlaylist,
    removeTrack,
    deletePlaylist,
    addTrackToFavorites,
    listUserFavorites,
    removeTrackFromFavorites,
    loginUser,
};
