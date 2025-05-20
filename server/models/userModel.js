const db = require('../config/db');

// Insert a new user into the database
const createUser = (username, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Retrieve a user by username
const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) reject(err);
            else resolve(results[0]);
        });
    });
};

module.exports = { createUser, getUserByUsername };
