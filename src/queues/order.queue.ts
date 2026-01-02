import { sendEmail } from "../services/email/email.service";
import { orderQueue, returnQueue } from "../config/queue.config";
import { EmailJobData } from "../types/express";

export const processOrderSubmitEmail = async (job: { data: EmailJobData }): Promise<void> => {
  await sendEmail(job.data);
};

export const processOrderCompleteEmail = async (job: { data: EmailJobData }): Promise<void> => {
  await sendEmail(job.data);
};

export { orderQueue };