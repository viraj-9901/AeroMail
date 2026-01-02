import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL as string, { lazyConnect: true });

const orderQueue = new Queue("orderQueue", { connection });
const returnQueue = new Queue("returnQueue", { connection });

export { orderQueue, returnQueue, connection };