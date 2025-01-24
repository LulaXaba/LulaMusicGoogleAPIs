

Project Description:
Overview:
MusicGoogleAPIs is a web application designed to manage and stream music tracks, create and manage playlists, and handle user authentication and favorites. The application leverages Google Drive for storing music files and utilizes a MongoDB database for managing user data, playlists, and favorite tracks. The API is built using Node.js and Express, providing a robust and scalable backend for music management.
Key Features:
User Management: Users can register, log in, and manage their profiles. Authentication is handled using JSON Web Tokens (JWT) to ensure secure access to user-specific data.
Music Management: Users can upload, stream, and download music tracks. The application integrates with Google Drive to store and retrieve music files.
Playlist Management: Users can create, update, and delete playlists. They can also add or remove tracks from their playlists, allowing for personalized music collections.
Favorites Management: Users can mark tracks as favorites, enabling quick access to their preferred songs. The application provides endpoints to add, list, and remove favorite tracks.

Technology Stack:
Backend: Node.js, Express.js
Database: MongoDB (using Mongoose for object modeling)
Authentication: JSON Web Tokens (JWT)
File Storage: Google Drive API
Environment Variables: dotenv for managing sensitive information

Folder Structure:
controllers/: Contains the logic for handling requests and responses for various functionalities, including user management, music management, and playlist management.
routes/: Defines the API endpoints for different functionalities, organizing them into user, music, playlist, and favorites routes.
models/: Contains Mongoose schemas for User, Track, Playlist, and Favorite, defining the structure of the data stored in MongoDB.
services/: Implements the business logic for user authentication, music handling, and playlist management.
middleware/: Contains middleware functions for authentication and token validation.
config/: Configuration files for connecting to the database and Google API.
utils/: Utility functions for generating and validating JWTs.

API Endpoints:
User Endpoints:
POST /users/register: Register a new user.
POST /users/login: Authenticate a user and return a JWT token.
GET /users/:userId: Retrieve user details by user ID.

Music Endpoints:
POST /music: Add a new song to the collection.
GET /music: Retrieve a list of all songs or individual song details.
GET /music/download/:id: Download a song based on the song's ID.
GET /music/play/:id: Stream a song based on the song's ID.
PUT /music/:id: Update song information based on the song’s ID.
DELETE /music/:id: Delete a song from the collection based on the song’s ID.

Playlist Endpoints:
POST /playlist: Create a new playlist.
GET /playlists: Retrieve all playlists for the authenticated user.
GET /playlist/:playlistId: Fetch a specific playlist by its ID.
PUT /playlist/:playlistId/music: Add a song to a playlist.
DELETE /playlist/:playlistId/music: Remove a song from a playlist.
DELETE /playlist/:playlistId: Delete a specific playlist by its ID.

Favorites Endpoints:
POST /favorites: Add a track to the user's favorites.
GET /favorites/:userId: List all favorite tracks for the specified user.
DELETE /favorites: Remove a track from the user's favorites.


Installation and Setup:
git clone cd LulaMusicGoogleAPIs
npm install
JWT_SECRET=your_secret_key_hereCLIENT_ID=your_google_client_idCLIENT_SECRET=your_google_client_secretREDIRECT_URI=your_google_redirect_uriREFRESH_TOKEN=your_google_refresh_tokenACCESS_TOKEN=your_google_access_tokenMONGO_URI=your_mongodb_connection_string
npm start
The server will run on http://localhost:3000.

Conclusion:
MusicGoogleAPIs provides a comprehensive solution for music management, allowing users to interact with their music collections seamlessly. With a focus on user experience and data integrity, this application is designed to cater to music enthusiasts looking for a robust platform to manage their favorite tracks and playlists.
