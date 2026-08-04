const mysql = require('mysql2/promise');
const fs = require("fs");

const database = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3yLVkRkeEWif26A.root',
    password: 'vJU1pykkucYAYnJQ',
    database: 'smart_village',

    waitForConnections: true,
    connectionLimit: 10,


    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
    }
    
});

module.exports = database;

