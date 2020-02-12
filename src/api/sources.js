var express = require('express');
var Queue = require('bull');
require('dotenv').config()
const router = express.Router();
var db = require('../db/database');
var User = require('../domain/user');
var AliQueue = require('../domain/aliqueue');

const workQueue = new Queue('worker', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

const authCheck = (token, callback) => {
    db.query(User.getUserByFieldNameSQL('api_token'), [token], (err, data) => {
        if (err) {
            callback(err.message, null);
        } else {
            if (data && data.length > 0) {
                callback(null, data);
            } else {
                callback('Authontication failed!', null);
            }
        }
    })
};

router.post("/products", async (req, res, next) => {

    if (req.headers.authorization) {
        authCheck(req.headers.authorization.split(' ')[1], (err, data) => {
            if (err) {
                return res.json({ message: err });
            } else {
                let products = [];

                if (req.body.products) {
                    products = req.body.products;
                } else if (req.body.items && req.body.languages) {
                    req.body.items.map((item1) => {
                        req.body.languages.map((item2) => {
                            var product = {};
                            product.code = item1;
                            product.language = item2;
                            products.push(product);
                        })
                    });            
                } else {
                    return res.json({ message: 'Invalid Payload!' });
                }
            
                products.map(async (product, key) => {
                    const data = { product };
                    const options = {
                        delay: 20,
                        attempts: 3
                    }
                    await workQueue.add(data, options);
                });
            
                return res.json({ message: "ok" });                
            }
        })
    } else {
        return res.json({ message: 'Authontication failed!' })
    }
});

router.post("/history", async (req, res, next) => {
    if (req.headers.authorization) {
        authCheck(req.headers.authorization.split(' ')[1], (err, data) => {
            if (err) {
                return res.json({ message: err });
            } else {
                var sql = `SELECT status, reserved_at, finished_at, failed_at FROM ali_queue `;
                var params = [];
                var condition = 'ORDER BY updated_at ASC LIMIT ?';

                if (req.body.status) {
                    params.push(req.body.status);
                    sql = sql + 'WHERE status = ? ';
                }

                if (req.body.last_ts) {
                    params.push(req.body.last_ts);

                    if (sql.includes('WHERE')) {
                        sql = sql + 'AND updated_at > ? ';
                    } else {
                        sql = sql + 'WHERE updated_at > ? ';
                    }
                }

                params.push(req.body.limit);
                sql = sql + condition;

                db.query(AliQueue.getAliQueueByFieldNameSQL(sql), params, (err, data) => {
                    if (err) {
                        return res.json({ message: err.message });
                    } else {
                        var results = [];
                        results = data.map((data) => {
                            return JSON.parse(JSON.stringify(data));
                        });

                        return res.json({ results: results });                
                    }
                })
            }
        })
    } else {
        return res.json({ message: 'Authontication failed!' })
    }
});

workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${jobId}, ${result}`);
});

module.exports = router;