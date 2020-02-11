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
    let products = req.body.products;

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