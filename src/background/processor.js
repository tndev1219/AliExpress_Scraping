let worker = require('./worker');
let throng = require('throng');
let Queue = require("bull");

let workers = process.env.WEB_CONCURRENCY || 1;
let maxJobsPerWorker = 50;

function start() {
  let workQueue = new Queue('worker', {
    redis: {
      host: 'aliexpress.3yq7qt.0001.use1.cache.amazonaws.com' ,
      port: 6379
    }
  });
  workQueue.process(maxJobsPerWorker, async (job) => {
    await worker.aliExpressWorker(job.data.product);
    return { value: "This will be stored" };
  });
}

throng({ workers, start });
