var db = require('../db/database');
var Source = require('../domain/source');
var AliRequest = require('../domain/alirequest');
var AliQueue = require('../domain/aliqueue');
var callApifyMain = require('../services/main');
var moment = require('moment');
const uuidv4 = require('uuid/v4');

const aliExpressWorker = (product) => {
    db.query(Source.getSourceByFieldNameSQL('store_language'), [product.language], (err, data) => {
        if (!err) {
            if (data && data.length > 0) {
                let domain = data[0].store_url;
                let params = {
                    uuid: uuidv4(),
                    num_products: 1,
                    created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                    updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                };
                let aliRequest = new AliRequest();
                db.query(aliRequest.getAddAliRequestSQL(), params, (err, data) => {
                    let params = {
                        uuid: uuidv4(),
                        product_code: product.code.toString(),
                        language: product.language,
                        product_info_payload: null,
                        status: "READY",
                        imported: 0,
                        created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                        updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                    };
                    let aliQueue = new AliQueue();
                    db.query(aliQueue.getAddAliQueueSQL(), params, (err, data) => {
                        if (!err) {
                            let startUrl = domain + 'item/' + product.code + '.html';
                            let params = [
                                'RESERVED',
                                moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                                moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                                product.code.toString(),
                                product.language
                            ];
                            let fields = 'status = ?, reserved_at = ?, updated_at = ?';
                            let condition = 'product_code = ? AND language=? AND product_info_payload IS NULL';
                            db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, async (err, data) => {
                                await callApifyMain(startUrl);
                            });
                        }
                    });
                });
            }
        }
    })
}

module.exports = {
    aliExpressWorker
}