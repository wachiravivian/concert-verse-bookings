// server/routes/events.js (example)
const express = require('express');
const mysql = require('mysql2/promise'); // Assuming you use the same pool
const router = express.Router();

// Database connection pool (should be defined/imported correctly)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

router.get('/', async (req, res) => {
    try {
        // This is the query that fetches events for your landing page
        const [rows] = await pool.query('SELECT eventId, name, description, eventDate, venue, ticketPrice FROM Event');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events.', error: error.message });
    }
});

module.exports = router;