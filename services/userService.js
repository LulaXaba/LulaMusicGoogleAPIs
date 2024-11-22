const bcrypt = require("bcrypt");
const User = require("../models/User");

// Function to create a new user
async function createUser(username, email, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        console.log("User created:", user);
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}

// Function to find a user by ID
async function findUserById(userId) {
    return await User.findById(userId);
}

// Function to authenticate a user
async function authenticateUser(email, password) {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found for email:", email);
            throw new Error("User not found");
        }
        // Compare the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error("Invalid password for user:", email);
            throw new Error("Invalid password");
        }
        return user;
    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
}

module.exports = { createUser, findUserById, authenticateUser }; 