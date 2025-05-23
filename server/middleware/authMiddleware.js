const jwt = require('jsonwebtoken');
const JWT_SECRET = "yourSuperSecretKey"; 

// Middleware function to authenticate incoming requests using JWT
const authenticate = (req, res, next) => {
    // Extract the Authorization header
    const authHeader = req.headers.authorization;

    // If no Authorization header or it doesn't start with 'Bearer ', reject the request
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Extract the token part (after 'Bearer ')
    const token = authHeader.split(" ")[1];

    try {
        // Verify and decode the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach the decoded payload to req.user
        // We explicitly map userId → req.user.id so downstream code can use it
        req.user = {
            id: decoded.userId,
            isAdmin: decoded.isAdmin || false
        };

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If verification fails, respond with an unauthorized error
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticate;
