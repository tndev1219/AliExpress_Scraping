let worker = require('./worker');
let throng = require('throng');
let Queue = require("bull");

let workers = process.env.WEB_CONCURRENCY || 1;
let maxJobsPerWorker = 50;

function start() {
  let workQueue = new Queue('worker', {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  });

  workQueue.process(maxJobsPerWorker, async (job) => {
    await worker.aliExpressWorker(job.data.product, job.opts.payloadLen);
    return { value: "This will be stored" };
  });
}

throng({ workers, start });
