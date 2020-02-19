// routes.js
const Apify = require('apify');
const extractors = require('./extractors');
var moment = require('moment');
var db = require('../db/database');
var AliQueue = require('../domain/aliqueue');
var Store = require('../domain/store');

const {
    utils: {
        log
    },
} = Apify;

// Product page crawler
// Fetches product detail from detail page
exports.PRODUCT = async ({
    dataScript,
    userInput,
    request
}, {
    requestQueue
}) => {
    const {
        productId,
        language
    } = request.userData;
    const {
        includeDescription
    } = userInput;
    let product = '';

    log.info(`CRAWLER -- Fetching product: ${productId}`);

    try {
        // Fetch product details    
        product = await extractors.getProductDetail(dataScript, request.url);
    } catch (error) {
        await new Promise((resolve, reject) => {
            let params = [
                'FAILED',
                moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                productId.toString(),
                language
            ];
            let fields = 'status = ?, failed_at = ?, updated_at = ?';
            let condition = 'product_code = ? AND language=? AND product_info_payload IS NULL';

            db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => {
                if (err) {
                    reject();
                } else {
                    resolve();
                }
            });
        });
    } finally {
        if (!product) {
            await new Promise((resolve, reject) => {
                let params = [
                    'FAILED',
                    moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                    moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                    productId.toString(),
                    language
                ];
                let fields = 'status = ?, failed_at = ?, updated_at = ?';
                let condition = 'product_code = ? AND language=? AND product_info_payload IS NULL';
    
                db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => {
                    if (err) {
                        reject();
                    } else {
                        resolve();
                    }
                });
            });
        } else {
            // Check description option
            if (includeDescription) {
                // Fetch description
                await requestQueue.addRequest({
                    url: product.descriptionURL,
                    userData: {
                        label: 'DESCRIPTION',
                        product,
                    },
                }, {
                    forefront: true
                });
            } else {
                await new Promise((resolve, reject) => {
                    let store = new Store();
                    db.query(Store.getStoreByFieldNameSQL('store_id'), [product.store.id], (err, data) => {
                        if (!err) {
                            if (data && data.length > 0) {
                                let params = [
                                    product.store.name,
                                    product.store.url,
                                    parseFloat(product.store.positiveRate),
                                    moment(product.store.establishedAt, 'MMM D, YYYY').format('YYYY-MM-DD'),
                                    moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                                    product.store.id
                                ];
                                let fields = 'store_name = ?, store_url = ?, store_feedbacks = ?, seller_since = ? modified_at = ?';
                                let condition = 'store_id = ?';
                                db.query(Store.updateStoreByFieldNameSQL(fields, condition), params, (err, data) => { });
                            } else {
                                let params = {
                                    store_id: product.store.id,
                                    store_name: product.store.name,
                                    store_url: product.store.url,
                                    store_feedbacks: parseFloat(product.store.positiveRate),
                                    seller_since: moment(product.store.establishedAt, 'MMM D, YYYY').format('YYYY-MM-DD'),
                                    created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                                    modified_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
                                };
                                db.query(store.getAddStoreSQL(), params, (err, data) => { });
                            }
                        }
                    });
    
                    let params = [
                        product.link,
                        'FINISHED',
                        moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                        JSON.stringify(product),
                        moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
                        productId.toString(),
                        product.language
                    ];
                    let fields = 'product_url=?, status = ?, finished_at = ?, product_info_payload = ?, updated_at = ?';
                    let condition = 'product_code = ? AND language=? AND product_info_payload IS NULL';
                    db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => {
                        if (err) {
                            reject();
                        } else {
                            resolve();
                        }
                    });
                });
                // await Apify.pushData({ ...product });
                console.log(`CRAWLER -- Fetching product: ${productId} completed and successfully pushed to dataset`);
            }
        }
    }
};

// Description page crawler
// Fetches description detail and push data
exports.DESCRIPTION = async ({
    $,
    request
}) => {
    const {
        product
    } = request.userData;

    log.info(`CRAWLER -- Fetching product description: ${product.id}`);

    // Fetch product details
    const description = await extractors.getProductDescription($);
    product.description = description;
    delete product.descriptionURL;

    // Push data
    // await Apify.pushData({ ...product });

    log.debug(`CRAWLER -- Fetching product description: ${product.id} completed and successfully pushed to dataset`);
};
