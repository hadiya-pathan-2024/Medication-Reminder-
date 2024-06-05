const { Queue } = require('bullmq');
const Redis = require('ioredis');

const connection = new Redis();

const reportQueue = new Queue('reportQueue', { 
    connection: {
        host: 'localhost',
        port: 6379,
      }
 });

 const scheduleQueue = new Queue('scheduleQueue', { 
  connection: {
      host: 'localhost',
      port: 6379,
    }
});

module.exports = reportQueue,scheduleQueue;