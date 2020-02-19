let worker = require('./worker');
let throng = require('throng');
let Queue = require("bull");
var AliQueue = require('../domain/aliqueue');
var db = require('../db/database');
var moment = require('moment');

let workers = process.env.WEB_CONCURRENCY || 1;
let maxJobsPerWorker = 50;

function start() {
	let workQueue = new Queue('worker', {
		redis: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		}
	});

	workQueue.process(maxJobsPerWorker, async (data) => {
		let job = data;
		await worker.aliExpressWorker(job.data.product, job.opts.payloadLen, (err, data) => {
			if (err) {
				db.query(AliQueue.getAliQueueSQL(), [job.data.product.code, job.data.product.language], (err, data) => {
					if (!err) {
						if (data && data.length > 0) {
							let params = [
								'FAILED',
								moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
								moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
								data[0].product_code,
								data[0].language
							];
							let fields = 'status = ?, failed_at = ?, updated_at = ?';
							let condition = 'product_code = ? AND language=? AND product_info_payload IS NULL';

							db.query(AliQueue.updateAliQueueByFieldNameSQL(fields, condition), params, (err, data) => { });
						} else {
							let params = {
								uuid: uuidv4(),
								user_token: 'arjtT1zdp7dc54eC39HqLyjWD',
								product_code: job.data.product.code.toString(),
								language: job.data.product.language,
								product_info_payload: null,
								status: "READY",
								imported: 0,
								created_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss"),
								updated_at: moment(Date.now()).format("YYYY-MM-DD hh:mm:ss")
							};
							let aliQueue = new AliQueue();

							db.query(aliQueue.getAddAliQueueSQL(), params, (err, data) => { });
						}
					}
				});
			}
		});
		return {
			value: "This will be stored"
		};
	});
}

throng({
	workers,
	start
});
