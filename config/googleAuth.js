// config/googleAuth.js
require("dotenv").config();
const { google } = require("googleapis");
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
    access_token: process.env.ACCESS_TOKEN,
});

// Function to refresh the access token
async function refreshAccessToken() {
    try {
        const { credentials } = await oAuth2Client.refreshAccessToken();
        oAuth2Client.setCredentials(credentials);
        console.log("Access token refreshed:", credentials.access_token);
    } catch (error) {
        console.error("Error refreshing access token:", error);
    }
}

module.exports = { oAuth2Client, refreshAccessToken };
