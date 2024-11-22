// services/musicService.js

const Playlist = require("../models/Playlist"); // Import the Playlist model
const Favorite = require("../models/Favorite");

// Function to create a new playlist
async function createPlaylist(name) {
    const newPlaylist = new Playlist({
        name: name,
        tracks: [] // Initialize with no tracks
    });
    await newPlaylist.save(); // Save the playlist to MongoDB
    console.log("Playlist saved to MongoDB:", newPlaylist); // Log the saved playlist
    return newPlaylist; // Return the created playlist
}

// Function to add a track to a playlist
async function addTrackToPlaylist(playlistId, trackId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Error("Playlist not found");
    }
    // Check if the track is already in the playlist
    if (playlist.tracks.includes(trackId)) {
        return { message: "Track is already in the playlist." };
    }
    playlist.tracks.push(trackId); // Add the track ID to the playlist
    await playlist.save(); // Save the updated playlist
    console.log("Track added to playlist:", playlist); // Log the updated playlist
    return playlist; // Return the updated playlist
}

// Function to list all playlists
async function listPlaylists() {
    return await Playlist.find(); // Retrieve all playlists from MongoDB
}

// Function to get a specific playlist by ID
async function getPlaylistById(playlistId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Error("Playlist not found");
    }
    return playlist;
}

// Function to remove a track from a playlist
async function removeTrackFromPlaylist(playlistId, trackId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Error("Playlist not found");
    }
    // Check if the track is in the playlist
    if (!playlist.tracks.includes(trackId)) {
        return { message: "Track is not in the playlist." };
    }
    // Remove the track ID from the playlist
    playlist.tracks = playlist.tracks.filter(id => id !== trackId);
    await playlist.save(); // Save the updated playlist
    console.log("Track removed from playlist:", playlist); // Log the updated playlist
    return playlist; // Return the updated playlist
}

// Function to delete a playlist
async function deletePlaylistById(playlistId) {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new Error("Playlist not found");
    }
    await Playlist.deleteOne({ _id: playlistId }); // Delete the playlist from MongoDB
    console.log("Playlist deleted:", playlistId); // Log the deleted playlist ID
    return { message: "Playlist deleted successfully" }; // Return a success message
}

// Function to add a track to favorites
async function addToFavorites(userId, trackId) {
    const favorite = new Favorite({ userId, trackId });
    await favorite.save();
    console.log("Track added to favorites:", favorite);
    return favorite;
}

// Function to list all favorite tracks for a user
async function listFavorites(userId) {
    return await Favorite.find({ userId }).populate('trackId');
}

// Function to remove a track from favorites
async function removeFromFavorites(userId, trackId) {
    const result = await Favorite.deleteOne({ userId, trackId });
    console.log("Track removed from favorites:", result);
    return result;
}

module.exports = { createPlaylist, addTrackToPlaylist, listPlaylists, getPlaylistById, removeTrackFromPlaylist, deletePlaylistById, addToFavorites, listFavorites, removeFromFavorites };
