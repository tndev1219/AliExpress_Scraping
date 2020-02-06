var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var Queue = require('bull');
var { setQueues, UI } = require('bull-board');
var sources = require('./api/sources');

const app = express();
require('dotenv').config()

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use("/api/v1/sources", sources);
app.use('/admin/queues', UI)

//if we are here then the specified request is not found
app.use((req, res, next)=> {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});
 
app.use((err, req, res, next) => {
   res.status(err.status || 501);
   res.json({
       error: {
           code: err.status || 501,
           message: err.message
       }
   });
});

var workQueue = new Queue('worker', {
    redis: {
      host: 'aliexpress.3yq7qt.0001.use1.cache.amazonaws.com' ,
      port: 6379
    }
});
setQueues([workQueue]);

module.exports = app;