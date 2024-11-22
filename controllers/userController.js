const { createUser, findUserById, authenticateUser } = require("../services/userService");
const { generateToken } = require("../utils/jwtUtil");

// Function to register a new user
async function registerUser(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await createUser(username, email, password);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
}

// Function to log in a user
async function loginUser(req, res) {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    try {
        const user = await authenticateUser(email, password);
        console.log("User authenticated:", user);

        const token = generateToken({ userId: user._id });
        console.log("Generated token:", token);

        // Set the JWT as a cookie
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send the token in the response body
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(401).json({ message: error.message });
    }
}

// Function to get user details by ID
async function getUser(req, res) {
    const { userId } = req.params;
    try {
        const user = await findUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).send("User not found");
    }
}

module.exports = { registerUser, loginUser, getUser }; 