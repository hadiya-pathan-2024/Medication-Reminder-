const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { generateAndSendReport } = require('./controllers/report.generation.controller');

const connection = new Redis();

const reportWorker = new Worker('reportQueue', async job => {
  await generateAndSendReport(job.data.userId);
}, { 
    connection: {
        host: 'localhost',
        port: 6379,
      }
 });

reportWorker.on('completed', (job) => {
  console.log(`Completed job ${job.id}`);
});

reportWorker.on('failed', (job, err) => {
  console.error(`Failed job ${job.id} with ${err}`);
});