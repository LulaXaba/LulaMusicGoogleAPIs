// services/driveService.js
const { google } = require("googleapis");
const { oAuth2Client } = require("../config/googleAuth"); // Ensure correct import
const { Readable } = require('stream');
const Track = require("../models/Track"); // Import Track model

const drive = google.drive({ version: "v3", auth: oAuth2Client }); // Use oAuth2Client as auth

// List files in Google Drive
async function listFiles() {
    const res = await drive.files.list({
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
    });
    return res.data.files;
}

// Stream a file for music playback
async function streamFile(fileId, res) {
    drive.files.get(
        { fileId: fileId, alt: "media" },
        { responseType: "stream" },
        (err, { data }) => {
            if (err) {
                console.error("Error streaming file:", err);
                res.status(500).send("Error streaming file");
                return;
            }
            data.pipe(res);
        }
    );
}

// Upload a file to Google Drive
async function uploadFile(file, metadata) {
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null); // Signal the end of the stream

    try {
        const folderId = await getOrCreateMusicFolder();

        // Upload file to Google Drive with minimal properties
        const response = await drive.files.create({
            requestBody: {
                name: file.originalname,
                mimeType: file.mimetype,
                parents: [folderId],
                appProperties: {
                    trackId: metadata.trackId, // Only store trackId
                },
            },
            media: {
                mimeType: file.mimetype,
                body: bufferStream,
            },
        });

        // Save full metadata in MongoDB
        const newTrack = new Track({
            googleDriveFileId: response.data.id, // Save Drive file ID
            trackId: metadata.trackId, // Store trackId
            trackName: metadata.trackName,
            artistName: metadata.artistName,
            albumName: metadata.albumName,
            genre: metadata.genre,
            coverArtUrl: metadata.coverArtUrl, // Store cover art URL
            mimeType: file.mimetype // Ensure mimeType is saved
        });
        await newTrack.save();

        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

// Download a file from Google Drive
async function downloadFile(fileId) {
    const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
    }, { responseType: 'stream' });
    return response.data; // Return the stream for downloading
}

// Function to get or create "Music" folder
async function getOrCreateMusicFolder() {
    try {
        // Search for a folder named "Music"
        const res = await drive.files.list({
            q: "name = 'Music' and mimeType = 'application/vnd.google-apps.folder'",
            fields: "files(id, name)",
            spaces: "drive",
        });

        if (res.data.files.length > 0) {
            // Folder exists, return the first match's ID
            return res.data.files[0].id;
        } else {
            // Folder doesn't exist, create it
            const folder = await drive.files.create({
                requestBody: {
                    name: "Music",
                    mimeType: "application/vnd.google-apps.folder",
                },
                fields: "id",
            });
            console.log("Music folder created with ID:", folder.data.id);
            return folder.data.id;
        }
    } catch (error) {
        console.error("Error finding or creating Music folder:", error);
        throw error;
    }
}

// Temporarily add this test after `const drive = google.drive(...)` in driveService.js
(async () => {
    try {
        const tokenInfo = await oAuth2Client.getTokenInfo(oAuth2Client.credentials.access_token);
        console.log("OAuth2 Client Test - Token Info:", tokenInfo);
    } catch (error) {
        console.error("OAuth2 Client Test Error:", error);
    }
})();

module.exports = { listFiles, streamFile, uploadFile, downloadFile };
