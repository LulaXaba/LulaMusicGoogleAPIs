// app.js
require("dotenv").config({ path: require('path').resolve(__dirname, '../.env') });
const express = require("express");
const musicRoutes = require("./routes/musicRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use("/music", musicRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
