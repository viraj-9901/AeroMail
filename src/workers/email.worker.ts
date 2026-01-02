import { Worker } from 'bullmq';
import IORedis from 'ioredis';

import { orderQueue, processOrderSubmitEmail, processOrderCompleteEmail } from '../queues/order.queue';
import { returnQueue, processReturnSubmitEmail, processReturnCollectEmail } from '../queues/return.queue';

const connection = new IORedis(process.env.REDIS_URL as string);

const orderWorker = new Worker(
  'orderQueue',
  async (job) => {
    if (job.name === 'sendOrderSubmitEmail') {
      return processOrderSubmitEmail(job);
    } else if (job.name === 'sendOrderCompleteEmail') {
      return processOrderCompleteEmail(job);
    }
  },
  { connection }
);

const returnWorker = new Worker(
  'returnQueue',
  async (job) => {
    if (job.name === 'sendReturnSubmitEmail') {
      return processReturnSubmitEmail(job);
    } else if (job.name === 'sendReturnCollectEmail') {
      return processReturnCollectEmail(job);
    }
  },
  { connection }
);

orderWorker.on('completed', (job) => console.log(`Order job ${job.id} completed`));
orderWorker.on('failed', (job, err) => console.log(`Order job ${job && job.id} failed: ${err?.message}`));

returnWorker.on('completed', (job) => console.log(`Return job ${job.id} completed`));
returnWorker.on('failed', (job, err) => console.log(`Return job ${job && job.id} failed: ${err?.message}`));

console.log('Queue workers started');