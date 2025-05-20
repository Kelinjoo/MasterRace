const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByUsername } = require('../models/userModel');

const JWT_SECRET = "yourSuperSecretKey"; // Use environment variable in production

// Handles user registration
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
        await createUser(username, email, hashedPassword);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Handles user login and JWT issuance
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await getUserByUsername(username);
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        // Include isAdmin flag in the token payload
        const token = jwt.sign({ userId: user.id, isAdmin: user.is_admin }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };
