const mysql = require('mysql2/promise');

const database = mysql.createPool({
    host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3yLVkRkeEWif26A.root',
    password: 'vJU1pykkucYAYnJQ',
    database: 'sys',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = database;