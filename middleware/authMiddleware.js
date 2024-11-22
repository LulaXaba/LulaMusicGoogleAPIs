const { validateToken } = require("../utils/jwtUtil");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const user = validateToken(token);
        req.user = user; // Attach user info to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Forbidden: Invalid or expired token" });
    }
}

module.exports = { authenticateToken }; 