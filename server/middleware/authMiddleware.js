const jwt = require('jsonwebtoken');
const JWT_SECRET = "yourSuperSecretKey"; 

// Middleware function to authenticate incoming requests
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // If no Authorization header or it doesn't start with 'Bearer ', reject the request
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract the token part (after 'Bearer ')
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the decoded payload (userId, isAdmin) to req.user for access in controllers
        req.user = decoded;
        next();
    } catch (err) {
        // If verification fails, reject the request
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
