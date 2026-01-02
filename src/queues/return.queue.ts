import { sendEmail } from "../services/email/email.service";
import { returnQueue } from "../config/queue.config";
import { EmailJobData } from "../types/express";

// Export processors to be used in worker
export const processReturnSubmitEmail = async (job: { data: EmailJobData }): Promise<void> => {
  await sendEmail(job.data);
};

export const processReturnCollectEmail = async (job: { data: EmailJobData }): Promise<void> => {
  await sendEmail(job.data);
};

export { returnQueue };