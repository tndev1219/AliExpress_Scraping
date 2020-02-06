var mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
                connectionLimit : 10,
                host     : process.env.MYSQL_HOST,
                user     : process.env.MYSQL_USER,
                password : process.env.MYSQL_USER_PASSWORD,
                database : 'dbaliexpress',
                debug    : false 
            });

const executeQuery = (sql, params, callback) => {
    pool.getConnection((err, connection) => {
        if(err) {
            console.log(err)
            return callback(err, null);
        } else {
            if(connection) {
                connection.query(sql, params, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        return callback(error, null);
                    } 
                    return callback(null, results);
                });
            }
        }
    });
}
 
const query = (sql, params, callback) => {
    executeQuery(sql, params, function(err, data) {
        if(err) {
            return callback(err);
        }
        callback(null, data);
    });
}
 
module.exports = {
    query
}