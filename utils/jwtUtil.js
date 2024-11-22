const jwt = require('jsonwebtoken');

// Use a secure secret key from your environment variables
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Function to generate a JWT.
 * @param {Object} payload - Data to encode in the JWT.
 * @param {string} [expiresIn='7d'] - Expiration time for the token (default is 7 days).
 * @returns {string} - Signed JWT token.
 */
function generateToken(payload, expiresIn = '7d') {
    try {
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn });
        return token;
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Could not generate token");
    }
}

/**
 * Function to validate a JWT.
 * @param {string} token - JWT to validate.
 * @returns {Object} - Decoded payload if valid.
 */
function validateToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error("Invalid Token:", error.message);
        throw new Error("Token is invalid or expired");
    }
}

module.exports = { generateToken, validateToken }; 