var express = require('express');
var Queue = require('bull');
var router = express.Router();
var db = require('../db/database');
var User = require('../domain/user');
var Source = require('../domain/source');
var AliQueue = require('../domain/aliqueue');
require('dotenv').config();

var validLanguageList = [];
var invalidLanguageList = [];

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
    });
};

router.post("/products", async (req, res, next) => {

    if (req.headers.authorization) {
        authCheck(req.headers.authorization.split(' ')[1], (err, data) => {
            if (err) {
                return res.json({
                    message: err
                });
            } else {
                let token = data[0].api_token;

                db.query(Source.getLanguageSourceSQL(), (err, data) => {
                    if (err) {
                        return res.json({
                            message: err
                        });
                    } else {
                        validLanguageList = JSON.parse(JSON.stringify(data)).map((lg) => (lg.store_language));

                        let products = [];

                        if (req.body.products) {
                            products = req.body.products;
                        } else if (req.body.items && req.body.languages) {
                            req.body.items.map((item1) => {
                                req.body.languages.map((item2) => {
                                    var product = {};

                                    if (validLanguageList.includes(item2)) {
                                        product.code = item1;
                                        product.language = item2;
                                        products.push(product);
                                    } else {
                                        invalidLanguageList.push(item2);
                                    }
                                });
                            });
                        } else {
                            return res.json({
                                message: 'Invalid Payload!'
                            });
                        }

                        products.map(async (product, key) => {

                            const data = {
                                product
                            };
                            const options = {
                                token: token,
                                payloadLen: products.length,
                                delay: 20,
                                attempts: 3
                            };

                            await workQueue.add(data, options);
                        });


                        const tempList = invalidLanguageList;
                        invalidLanguageList = [];


                        if (tempList.length === 0) {
                            return res.json({
                                message: "ok"
                            });
                        } else {
                            return res.json({
                                message: `Your requeset has some issues. ${tempList} is not registered. So you can't get any result about these languages.`
                            });
                        }
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'Authontication failed!'
        });
    }
});

router.post("/history", async (req, res, next) => {
    if (req.headers.authorization) {
        authCheck(req.headers.authorization.split(' ')[1], (err, data) => {
            if (err) {
                return res.json({
                    message: err
                });
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

                if (req.body.limit) {
                    params.push(req.body.limit);
                } else {
                    params.push(100);
                }

                sql = sql + condition;

                db.query(AliQueue.getAliQueueByFieldNameSQL(sql), params, (err, data) => {
                    if (err) {
                        return res.json({
                            message: err.message
                        });
                    } else {
                        var results = [];
                        results = data.map((data) => (JSON.parse(JSON.stringify(data))));

                        return res.json({
                            results: results
                        });
                    }
                });
            }
        });
    } else {
        return res.json({
            message: 'Authontication failed!'
        });
    }
});

workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${jobId}, ${result}`);
});

workQueue.on('global:error', (error) => {
    console.log(`Error occured with ${error}`);
});

workQueue.on(`global:failed`, (jobId, err) => {
    console.log(`${err} with ${jobId}`);
    workQueue.getJob(jobId)
    .then(function(job) {
        job.remove();
    });
});

module.exports = router;
