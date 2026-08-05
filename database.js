const mysql = require('mysql2/promise');
const fs = require("fs");
require('dotenv').config();

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,


    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    }
    
});

module.exports = database;

