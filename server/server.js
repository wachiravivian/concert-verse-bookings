// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Make sure path is imported

// Load environment variables from .env file
dotenv.config();

const app = express(); // This is where 'app' is defined
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_mysql_password',
    database: process.env.DB_NAME || 'eventbooker', // Ensure this matches your DB name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test DB connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database!');
        connection.release(); // Release the connection
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit process if cannot connect to DB
    });

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('EventBooker Backend API is running!');
});

// GET all events
app.get('/api/events', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        // CHANGE THIS LINE: From 'events' to 'Event'
        const [rows] = await connection.execute('SELECT eventId, name, description, eventDate, venue, ticketPrice FROM event ORDER BY eventDate ASC');
        res.json(rows);
    } catch (error) {
        console.error('Backend: Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// GET /api/venues - Fetch all venues (THIS WAS ADDED IN PREVIOUS STEP, ENSURE IT'S HERE)
app.get('/api/venues', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM venues');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching venues:', error);
        res.status(500).json({ message: 'Failed to fetch venues.', error: error.message });
    }
});

// Import and use booking routes
// This line connects the '/api/bookings' path to the routes defined in routes/bookings.js
const bookingRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});