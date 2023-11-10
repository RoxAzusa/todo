const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const pool = mysql.createPool({
    'host': '127.0.0.1',
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'database': process.env.DB_NAMEV2
});

// const pool = mysql.createPool({
//     'host': '127.0.0.1',
//     'user': 'root',
//     'password': '',
//     'database': 'tasksV2'
// });

function sqlQuery(query, callback) {
    pool.getConnection((connError, connection) => {
        if(connError) {
            console.log(connError);
            return callback(connError, null);
        }

        connection.query(query, (error, result) => {
            connection.release();

            if(error) {
                console.log(error);
                return callback(error, null);
            }

            callback(null, result);
        });
    });
}

function processDate(inputDate) {
    try {
        const date = new Date(Date.parse(inputDate));
        return date.toISOString().slice(0, 19).replace('T', ' ');
    } catch(e) {
        throw new Error('format date invalide');
    }
}

sequelizeInstance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD , {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = {
    sqlQuery, 
    processDate,
    sequelizeInstance
}