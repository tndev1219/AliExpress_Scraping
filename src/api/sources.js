var express = require('express');
var Queue = require('bull');
require('dotenv').config()
const router = express.Router();

const workQueue = new Queue('worker', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

router.post("/products", async (req, res, next) => {
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
        return res.json({ message: 'Invalid Payload' });
    }

    products.map(async (product, key) => {
        const data = { product };
        const options = {
            delay: 20,
            attempts: 3
        }
        await workQueue.add(data, options);
    });
    res.json({ message: "ok" });
})

workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${jobId}, ${result}`);
});

module.exports = router;