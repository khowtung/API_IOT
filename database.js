const mysql = require('mysql2/promise');

const database = mysql.createPool({
    host: 'HOST จาก TiDB',
    port: 4000,
    user: 'USERNAME',
    password: 'PASSWORD',
    database: 'smart_village',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = database;