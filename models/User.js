const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real app, ensure this is hashed
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User; 