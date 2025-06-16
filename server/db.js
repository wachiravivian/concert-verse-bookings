// lib/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',      // Default to 'localhost' if env var not set
  user: process.env.DB_USER || 'root',          // Default to 'root'
  password: process.env.DB_PASSWORD || '',      // Default to empty string (BAD IN PRODUCTION!)
  database: process.env.DB_NAME || 'eventbooker', // Default to 'eventbooker'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;