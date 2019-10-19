// const mysql = require('mysql2');

// // creating a connection each time while querying is inefficient because the connection has to be opened and closed every time a query is run.
// // a better alternative is to create a "connection pool".

// const connectionPool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Andymama1'
// });

// module.exports = connectionPool.promise(); // exporting connectionPool promise

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Andymama1', {dialect: 'mysql', host: 'localhost'});

// host by default is localhost-- need not be specified
module.exports = sequelize;