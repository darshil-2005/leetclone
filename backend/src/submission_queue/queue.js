const {Queue} = require('bullmq');

const connection = { 
  host: process.env.REDIS_HOST || "127.0.0.1", 
  port: parseInt(process.env.REDIS_PORT || "6379") 
};

const submissionsQueue = new Queue('submission_queue', {connection});

module.exports = {submissionsQueue};
